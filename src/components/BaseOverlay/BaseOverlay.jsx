import React, { useRef, useEffect, Suspense, useState, useMemo } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload } from '@react-three/drei';
import { FaceMesh, FACEMESH_TESSELATION } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from '@mediapipe/drawing_utils';
import './ARSuperDebug.css';

// ====================================================================
// Component 3D สำหรับโมเดล (เวอร์ชันใช้ Raycaster เพื่อความแม่นยำ)
// ====================================================================
function FaceAnchor({ landmarksRef, modelSrc, stickSrc, animSrc }) {
    const groupRef = useRef();
    const { camera } = useThree();

    // --- 1. โหลดโมเดลทั้งหมด ---
    const { scene: baseModel } = useGLTF(modelSrc);
    const { scene: stickModel } = useGLTF(stickSrc);
    // useGLTF จะคืนค่า scene และ animations มาให้
    const { scene: animModel, animations: animClips } = useGLTF(animSrc);

    // --- 2. ตั้งค่า Animation Mixer ---
    const mixer = useMemo(() => new THREE.AnimationMixer(animModel), [animModel]);
    const actions = useMemo(() => {
        const action = mixer.clipAction(animClips[0]); // สมมติว่ามีอนิเมชันเดียว
        action.play();
        action.paused = true; // เริ่มต้นด้วยการหยุดเล่น
        return { main: action };
    }, [animClips, mixer]);

    const lastMouthState = useRef("Close");

    useFrame((state, delta) => {
        const landmarks = landmarksRef.current;
        if (!landmarks || !groupRef.current) {
            if (groupRef.current) groupRef.current.visible = false;
            return;
        }

        const anchorPoint = landmarks[152]; // ยึดกับปลายคาง
        if (!anchorPoint) {
            groupRef.current.visible = false;
            return;
        }

        groupRef.current.visible = true;

        // --- คำนวณตำแหน่งที่ถูกต้อง 100% ---
        const target = new THREE.Vector3();

        // --- 1. คำนวณตำแหน่งด้วย Raycaster (แม่นยำที่สุด) ---
        // แปลงพิกัด landmark (0-1) ให้อยู่ใน Screen Space (-1 to 1)
        // **สำคัญ: พลิกแกน X ที่นี่ (-anchorPoint.x) เพื่อให้ตรงกับการพลิกกระจกของภาพ**
        const screenX = (-anchorPoint.x + 0.5) * 2;
        const screenY = -(anchorPoint.y - 0.5) * 2;

        state.raycaster.setFromCamera({ x: screenX, y: screenY }, camera);
        state.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), target);
        groupRef.current.position.lerp(target, 0.5);

        // --- 2. คำนวณการหมุน (Rotation) - ใช้ Logic เดิมที่แม่นยำ ---
        const forehead = new THREE.Vector3(landmarks[10].x, landmarks[10].y, landmarks[10].z);
        const chin = new THREE.Vector3(landmarks[152].x, landmarks[152].y, landmarks[152].z);
        const leftCheek = new THREE.Vector3(landmarks[234].x, landmarks[234].y, landmarks[234].z);
        const rightCheek = new THREE.Vector3(landmarks[454].x, landmarks[454].y, landmarks[454].z);

        const yAxis = new THREE.Vector3().subVectors(forehead, chin).normalize();
        const xAxis = new THREE.Vector3().subVectors(rightCheek, leftCheek).normalize();
        const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();

        const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

        groupRef.current.quaternion.slerp(quaternion, 0.5);

        // --- 3. ตรวจจับการอ้าปากและควบคุมอนิเมชัน ---
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];

        if (upperLip && lowerLip) {
            const mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
            const MOUTH_OPEN_THRESHOLD = 15;
            const currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";

            if (currentMouthState !== lastMouthState.current) {
                console.log(`Mouth State: ${currentMouthState}`);
                lastMouthState.current = currentMouthState;

                const shouldBeVisible = currentMouthState === "Open";
                // ควบคุมการมองเห็นของโมเดล
                stickModel.visible = shouldBeVisible;
                animModel.visible = shouldBeVisible;
                // ควบคุมการเล่นอนิเมชัน
                actions.main.paused = !shouldBeVisible;
            }
        }

        // อัปเดต Mixer ในทุกๆ เฟรม
        mixer.update(delta);
    });

    // 4. ตั้งค่าเริ่มต้นให้โมเดลที่ต้องซ่อน มองไม่เห็นก่อน
    useEffect(() => {
        stickModel.visible = false;
        animModel.visible = false;
    }, [stickModel, animModel]);

    return (
        <group ref={groupRef} visible={false}>
            {/* 5. Render โมเดลทั้ง 3 ตัวเป็น child ของ group */}
            <primitive object={baseModel.clone()} rotation={[Math.PI / 1, 0, 0]} scale={0.5} position={[0, 0.3, -0.2]} />
            <primitive object={stickModel} rotation={[Math.PI / 1, 0, 0]} scale={0.5} position={[0, 0.3, -0.2]} />
            <primitive object={animModel} rotation={[Math.PI / 1, 0, 0]} scale={0.5} position={[0, 0.3, -0.2]} />

        </group>
    );
}


// ====================================================================
// Component หลักที่รวมทุกอย่างเข้าด้วยกัน
// ====================================================================
const ARSuperDebug = () => {
    const videoRef = useRef(null);
    const canvas2DRef = useRef(null);
    const landmarksRef = useRef(null);

    // State ใหม่เพื่อเก็บขนาดของวิดีโอ
    const [videoSize, setVideoSize] = useState({ width: 1280, height: 720 });

    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

        faceMesh.onResults((results) => {
            const videoElement = videoRef.current;
            const canvasElement = canvas2DRef.current;
            if (!canvasElement || !videoElement || videoElement.videoWidth === 0) return;

            const canvasCtx = canvasElement.getContext("2d");
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                landmarksRef.current = results.multiFaceLandmarks[0];
                for (const landmarks of results.multiFaceLandmarks) {
                    drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: 'rgba(255, 255, 255, 0.7)', lineWidth: 1.5 });
                }
            } else {
                landmarksRef.current = null;
            }
            canvasCtx.restore();
        });

        if (videoRef.current) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await faceMesh.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
    }, []);

    return (
        <div className="super-debug-container">
            <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
            <canvas ref={canvas2DRef} className="output_canvas_debug" />

            <Canvas className="ar-canvas-3d-debug">
                {/* 
                  ตั้งค่ากล้อง 3D ให้มีสัดส่วนตรงกับวิดีโอ (16:9)
                  R3F จะจัดการให้มัน 'cover' หน้าจอโดยอัตโนมัติ
                */}


                <ambientLight intensity={1.2} />
                <directionalLight position={[0, 5, 5]} intensity={1.8} />
                <Suspense fallback={null}>
                    {/* ส่งขนาดของวิดีโอเข้าไปด้วย */}
                    <FaceAnchor
                        landmarksRef={landmarksRef}
                        modelSrc="https://res.cloudinary.com/da8eemrq8/image/upload/v1750132482/TKO/MAMAOK/models/tonkotsu.glb"
                        stickSrc="https://res.cloudinary.com/da8eemrq8/image/upload/v1750132483/TKO/MAMAOK/models/stick.glb"
                        animSrc="https://res.cloudinary.com/da8eemrq8/image/upload/v1750132483/TKO/MAMAOK/models/tonkotsu_anim.glb"
                    />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ARSuperDebug;