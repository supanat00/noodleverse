import React, { useRef, useEffect, Suspense, useState } from "react";
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
function FaceAnchor({ landmarksRef, modelSrc }) {
    const groupRef = useRef();
    const { scene: model } = useGLTF(modelSrc);
    const { camera } = useThree();

    useFrame((state) => {
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
    });

    return (
        <group ref={groupRef} visible={false}>
            <primitive
                object={model.clone()}
                // รีเซ็ต rotation ที่นี่ เพราะเราควบคุมด้วย lookAt/Matrix แล้ว
                // แต่ยังคงสามารถใส่ rotation เริ่มต้นเพื่อ "ปรับแก้" มุมได้
                rotation={[Math.PI / 1, 0, 0]}
                scale={0.5} // อาจจะต้องปรับค่า scale ใหม่ให้เหมาะสม
                position={[0, 0, 0]} // ปรับตำแหน่งเทียบกับจุดอ้างอิง (คาง)
            />
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
                    <FaceAnchor landmarksRef={landmarksRef} modelSrc="/models/tonkotsu.glb" videoSize={videoSize} />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ARSuperDebug;