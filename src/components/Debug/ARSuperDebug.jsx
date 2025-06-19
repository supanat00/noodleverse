import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload, useVideoTexture, useTexture } from '@react-three/drei';
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

import './ARSuperDebug.css';

/**
 * HeadsUpDisplay (HUD) Component
 * สร้าง UI ของวิดีโอพรีเซนเตอร์และโลโก้ขึ้นมาใหม่ในฉาก 3D
 * โดยเลียนแบบการจัดวางจาก CSS เดิมให้แม่นยำที่สุด
 */
function HeadsUpDisplay({ selectedFlavor }) {
    // ดึง 'viewport' (ขนาดที่เห็นในหน่วย 3D) และ 'size' (ขนาด canvas เป็น pixel) มาใช้
    const { viewport, size } = useThree();

    // --- 1. โหลด Textures ---
    const logoUrl = '/assets/images/mama-logo.webp';
    const videoUrl = selectedFlavor?.videoPublicId || '';

    const logoTexture = useTexture(logoUrl);
    // ตรวจสอบให้แน่ใจว่า videoUrl ไม่ใช่ค่าว่างก่อนเรียกใช้ useVideoTexture
    const videoTexture = useVideoTexture(videoUrl, {
        muted: true, loop: true, start: true, crossOrigin: "anonymous",
    });

    // ====================================================================
    // --- 2. [หัวใจหลัก] แปลงค่าจาก CSS (px, rem) เป็นหน่วย 3D ---
    // ====================================================================

    // ค่าคงที่จากไฟล์ AROverlay.css
    const remToPx = 16; // ค่ามาตรฐานของ 1rem คือ 16px
    const topMarginInRem = 2; // top: 2rem;
    const containerMaxWidthInPx = 450; // max-width: 450px;
    const containerWidthPercent = 0.90; // width: 90%;
    const containerAspectRatio = 3 / 2; // aspect-ratio: 3 / 2;
    const logoWidthInPx = 60; // width: 60px;
    const logoMarginInPx = 15; // top: 15px; left: 15px;

    // คำนวณอัตราส่วนการแปลง pixel (ของ canvas) ไปเป็นหน่วย 3D (world unit)
    // นี่คือกุญแจสำคัญที่ทำให้เราเทียบขนาดได้
    const pxToWorldRatio = viewport.width / size.width;

    // --- คำนวณความกว้างของ Container (วิดีโอ) ---
    // 1. ความกว้างแบบ responsive (90% ของ viewport) ในหน่วย 3D
    const responsiveWidth = viewport.width * containerWidthPercent;
    // 2. ความกว้างสูงสุด (450px) ในหน่วย 3D
    const maxWidthInWorld = containerMaxWidthInPx * pxToWorldRatio;
    // 3. เลือกค่าที่น้อยกว่ามาใช้ (นี่คือ logic ของ `max-width` ใน CSS)
    const containerWidth = Math.min(responsiveWidth, maxWidthInWorld);

    // --- คำนวณความสูงของ Container จาก Aspect Ratio ---
    const containerHeight = containerWidth / containerAspectRatio;

    // --- คำนวณตำแหน่งของ Container (กึ่งกลางบน) ---
    const containerX = 0; // CSS: left: 50%, transform: translateX(-50%) คือกึ่งกลางแนวนอน
    // คำนวณระยะห่างจากขอบบน (top: 2rem)
    const topMarginInWorld = (topMarginInRem * remToPx) * pxToWorldRatio;
    // ตำแหน่ง Y คือ ขอบบนสุดของจอ (viewport.height / 2)
    // ลบด้วยระยะห่างที่คำนวณไว้
    // และลบอีกครึ่งหนึ่งของความสูง container เพื่อให้ขอบบนของ container ตรงตำแหน่ง
    const containerY = (viewport.height / 2) - topMarginInWorld - (containerHeight / 2);

    // --- คำนวณขนาดและตำแหน่งของ Logo (อ้างอิงจาก Container) ---
    const logoWidth = logoWidthInPx * pxToWorldRatio;
    const logoHeight = logoWidth; // สมมติว่าโลโก้เป็นสี่เหลี่ยมจัตุรัส
    const logoMargin = logoMarginInPx * pxToWorldRatio;

    // ตำแหน่งโลโก้จะสัมพันธ์กับจุดกึ่งกลางของ Container (ซึ่งตอนนี้อยู่ที่ 0,0)
    // X: ขอบซ้ายสุด (-containerWidth/2) + ระยะห่าง (logoMargin) + ครึ่งนึงของความกว้างโลโก้
    const logoX = -containerWidth / 2 + logoMargin + (logoWidth / 2);
    // Y: ขอบบนสุด (+containerHeight/2) - ระยะห่าง (logoMargin) - ครึ่งนึงของความสูงโลโก้
    const logoY = containerHeight / 2 - logoMargin - (logoHeight / 2);

    return (
        // Group หลักของ HUD ทั้งหมด จะถูกจัดตำแหน่งตามที่คำนวณไว้
        <group position={[containerX, containerY, -0.1]}>
            {/* Plane สำหรับวิดีโอ (พื้นหลังของ HUD) */}
            <mesh>
                <planeGeometry args={[containerWidth, containerHeight]} />
                <meshBasicMaterial map={videoTexture} transparent />
            </mesh>

            {/* Plane สำหรับโลโก้ (อยู่ข้างหน้าวิดีโอเล็กน้อย z=0.01 เพื่อกันภาพซ้อน) */}
            <mesh position={[logoX, logoY, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={logoTexture} transparent />
            </mesh>
        </group>
    );
}


// ====================================================================
// Component 3D สำหรับโมเดล (เวอร์ชันใช้ Raycaster เพื่อความแม่นยำ)
// ====================================================================
function FaceAnchor({ landmarksRef, modelUrls }) {
    const groupRef = useRef();
    const { camera } = useThree();

    // --- 1. โหลดโมเดลทั้งหมด ---
    const { scene: bowlModel } = useGLTF(modelUrls.bowl);
    const { scene: chopstickModel } = useGLTF(modelUrls.chopstick);
    const { scene: propModel, animations: propAnims } = useGLTF(modelUrls.prop);

    // --- 2. ตั้งค่า Animation Mixer ---
    const mixer = useMemo(() => new THREE.AnimationMixer(propModel), [propModel]);
    const actions = useMemo(() => {
        if (propAnims && propAnims.length > 0) {
            const action = mixer.clipAction(propAnims[0]);
            action.play();
            action.paused = true;
            return { main: action };
        }
        return { main: null };
    }, [propAnims, mixer]);

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

        if (upperLip && lowerLip && actions.main) {
            const mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
            const MOUTH_OPEN_THRESHOLD = 15;
            const currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";

            if (currentMouthState !== lastMouthState.current) {
                console.log(`Mouth State: ${currentMouthState}`);
                lastMouthState.current = currentMouthState;

                const shouldBeVisible = currentMouthState === "Open";
                // ควบคุมการมองเห็นของโมเดล
                chopstickModel.visible = shouldBeVisible;
                propModel.visible = shouldBeVisible;
                actions.main.paused = !shouldBeVisible;
            }
        }

        // อัปเดต Mixer ในทุกๆ เฟรม
        mixer.update(delta);
    });

    // 4. ตั้งค่าเริ่มต้นให้โมเดลที่ต้องซ่อน มองไม่เห็นก่อน
    useEffect(() => {
        chopstickModel.visible = false;
        propModel.visible = false;
    }, [chopstickModel, propModel]);

    return (
        <group ref={groupRef} visible={false}>
            {/* 5. Render โมเดลทั้ง 3 ตัวเป็น child ของ group */}
            <primitive object={bowlModel.clone()} rotation={[Math.PI / 1, 0, 0]} scale={1.35} position={[0, 2.2, 0]} />
            <primitive object={chopstickModel} rotation={[Math.PI / 1, 0, 0]} scale={1.35} position={[0, 2.2, 0]} />
            <primitive object={propModel} rotation={[Math.PI / 1, 0, 0]} scale={1.35} position={[0, 2.2, 0]} />

        </group>
    );
}

// ====================================================================
// Component หลักที่รวมทุกอย่างเข้าด้วยกัน
// ====================================================================
const ARSuperDebug = forwardRef(({ selectedFlavor, cameraFacingMode }, ref) => {

    const videoRef = useRef(null);
    const canvas2DRef = useRef(null);
    const landmarksRef = useRef(null);
    const glRef = useRef(null); // Ref ใหม่สำหรับเก็บ WebGL Renderer

    useImperativeHandle(ref, () => ({
        // ใช้ getter เพื่อให้แน่ใจว่าได้ค่า .current ล่าสุดเสมอ
        get arCanvas() {
            return glRef.current?.domElement;
        },
        get cameraCanvas() {
            return canvas2DRef.current;
        }
    }), []); // Dependency array ว่างเปล่าก็ยังใช้ได้ เพราะ getter จะถูกเรียกเมื่อมีการเข้าถึง

    const modelUrls = useMemo(() => {
        if (!selectedFlavor?.models) {
            return { bowl: null, chopstick: null, prop: null };
        }

        // ใช้ Public ID จาก Cloudinary มาสร้าง URL ที่สมบูรณ์
        return {
            bowl: selectedFlavor.models.bowl,
            chopstick: selectedFlavor.models.chopstick,
            prop: selectedFlavor.models.prop,
        };
    }, [selectedFlavor]);

    // ถ้า URL ยังไม่พร้อม (เช่น ตอนเริ่มต้น), ไม่ต้อง render อะไรเลย
    if (!modelUrls.bowl) return null;

    // State ใหม่เพื่อเก็บขนาดของวิดีโอ
    // const [videoSize, setVideoSize] = useState({ width: 1280, height: 720 });

    // **[แก้ไข 3]** ทำให้ useEffect ทำงานใหม่เมื่อ cameraFacingMode เปลี่ยน
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        let camera = null;
        const faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

        faceMesh.onResults((results) => {
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
            } else {
                landmarksRef.current = null;
            }
            canvasCtx.restore();
        });

        // สร้าง Camera object ใหม่เมื่อมีการเปลี่ยนโหมด
        camera = new Camera(videoElement, {
            onFrame: async () => {
                await faceMesh.send({ image: videoElement });
            },
            width: 1280,
            height: 720,
            // **[แก้ไข 3]** บอก MediaPipe ให้ใช้กล้องที่ถูกต้อง
            facingMode: cameraFacingMode
        });
        camera.start();

        // Cleanup function: สำคัญมากเมื่อ dependency เปลี่ยน
        return () => {
            camera?.stop();
            faceMesh.close();
        };

    }, [cameraFacingMode]); // <-- เพิ่ม cameraFacingMode ใน dependency array

    return (
        <div className="super-debug-container">
            <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
            <canvas ref={canvas2DRef} className="output_canvas_debug" />

            <Canvas className="ar-canvas-3d-debug"
                onCreated={(state) => { glRef.current = state.gl; }}
                gl={{ preserveDrawingBuffer: true }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[0, 5, 5]} intensity={1.8} />
                <Suspense fallback={null}>
                    {/* ส่งขนาดของวิดีโอเข้าไปด้วย */}
                    <FaceAnchor
                        landmarksRef={landmarksRef} modelUrls={modelUrls}
                    />
                    <HeadsUpDisplay selectedFlavor={selectedFlavor} />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
});

export default ARSuperDebug;