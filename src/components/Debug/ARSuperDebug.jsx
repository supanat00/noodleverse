import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle, useState } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload, useVideoTexture, useTexture } from '@react-three/drei';
import mediaPipeService from "../../services/mediaPipeService";
import { Camera } from "@mediapipe/camera_utils";

import './ARSuperDebug.css';

// HeadsUpDisplay component ไม่มีการเปลี่ยนแปลง
function HeadsUpDisplay({ selectedFlavor, isVisible }) {
    const { viewport, size } = useThree();

    const logoUrl = '/assets/images/mama-logo.webp';
    const videoUrl = selectedFlavor?.videoPublicId || '';
    const logoTexture = useTexture(logoUrl);
    // [แก้ไขเล็กน้อย] แก้ไข useVideoTexture ให้ start: false เพื่อให้ useEffect ควบคุมได้ 100%
    const videoTexture = useVideoTexture(videoUrl, {
        muted: true, loop: true, start: false, crossOrigin: "anonymous",
    });

    useEffect(() => {
        if (videoTexture.image) {
            if (isVisible) {
                videoTexture.image.play().catch(e => console.error("Video play failed:", e));
            } else {
                videoTexture.image.pause();
            }
        }
    }, [isVisible, videoTexture.image]);

    // การคำนวณขนาดและตำแหน่งทั้งหมดเหมือนเดิม
    const remToPx = 16;
    const topMarginInRem = 2;
    const containerMaxWidthInPx = 450;
    const containerWidthPercent = 0.90;
    const logoWidthInPx = 60;
    const logoMarginInPx = 15;
    const pxToWorldRatio = viewport.width / size.width;
    const responsiveWidth = viewport.width * containerWidthPercent;
    const maxWidthInWorld = containerMaxWidthInPx * pxToWorldRatio;
    const containerWidth = Math.min(responsiveWidth, maxWidthInWorld);
    const videoAspectRatio = (videoTexture.image?.videoWidth / videoTexture.image?.videoHeight) || (16 / 9);
    const containerHeight = containerWidth / videoAspectRatio;
    const containerX = 0;
    const topMarginInWorld = (topMarginInRem * remToPx) * pxToWorldRatio;
    const containerY = (viewport.height / 2) - topMarginInWorld - (containerHeight / 2);
    const cornerRadius = 0.05;
    const logoWidth = logoWidthInPx * pxToWorldRatio;
    const logoAspectRatio = (logoTexture.image?.naturalWidth / logoTexture.image?.naturalHeight) || 1;
    const logoHeight = logoWidth / logoAspectRatio;
    const logoMargin = logoMarginInPx * pxToWorldRatio;
    const logoX = -containerWidth / 2 + logoMargin + (logoWidth / 2);
    const logoY = containerHeight / 2 - logoMargin - (logoHeight / 2);

    const roundedVideoMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { uMap: { value: videoTexture }, uRadius: { value: cornerRadius }, uAspect: { value: containerWidth / containerHeight } },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D uMap; uniform float uRadius; uniform float uAspect; varying vec2 vUv; float sdRoundedBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r; } void main() { vec2 centeredUv = (vUv - 0.5) * vec2(uAspect, 1.0); vec2 boxSize = vec2(uAspect, 1.0) * 0.5; float d = sdRoundedBox(centeredUv, boxSize, uRadius); vec4 texColor = texture2D(uMap, vUv); float alpha = 1.0 - smoothstep(0.0, 0.005, d); gl_FragColor = vec4(texColor.rgb, texColor.a * alpha); }`,
        transparent: true,
    }), [videoTexture, cornerRadius, containerWidth, containerHeight]);

    return (
        <group position={[containerX, containerY, -0.1]}>
            <mesh>
                <planeGeometry args={[containerWidth, containerHeight]} />
                <primitive object={roundedVideoMaterial} />
            </mesh>
            <mesh position={[logoX, logoY, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
            </mesh>
        </group>
    );
}


// ====================================================================
// FaceAnchor Component ที่มีการแก้ไขตามที่ต้องการ
// ====================================================================
function FaceAnchor({ landmarksRef, flavor, isVisible }) {
    const groupRef = useRef();
    const chopstickGroupRef = useRef();
    const { camera } = useThree();

    const defaultAdjust = { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 };
    const bowlAdjust = flavor.adjustments?.bowl || defaultAdjust;
    const propAdjust = flavor.adjustments?.prop || defaultAdjust;
    const chopstickAdjust = flavor.adjustments?.chopstick || defaultAdjust;

    const { scene: bowlModel } = useGLTF(flavor.models.bowl);
    const { scene: propModel, animations: propAnims } = useGLTF(flavor.models.prop);
    const { scene: chopstickModel, animations: chopstickAnims } = useGLTF(flavor.models.chopstick);

    // [แก้ไข] สร้างตัวแปรสำหรับเก็บ URL ของ texture ก่อน
    const customTextureUrl = bowlAdjust.customTexture;

    // [แก้ไข] เรียกใช้ useTexture แบบมีเงื่อนไขผ่าน hook แยก
    // โดยถ้าไม่มี URL จะ return null
    const customBowlTexture = useMemo(() => {
        return customTextureUrl ? new THREE.TextureLoader().load(customTextureUrl) : null;
    }, [customTextureUrl]);
    // เราไม่ใช้ useTexture โดยตรงเพื่อหลีกเลี่ยงการเรียก hook แบบมีเงื่อนไข
    // แต่การใช้ new TextureLoader() ภายใน useMemo ให้ผลลัพธ์เหมือนกันและปลอดภัยกว่าในกรณีนี้

    useEffect(() => {
        // [แก้ไข] เพิ่มการเช็คว่า customBowlTexture ไม่ใช่ null
        if (customTextureUrl && bowlModel && customBowlTexture) {
            bowlModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    // ตรวจสอบว่า material เป็น standard material หรือไม่
                    if (child.material instanceof THREE.MeshStandardMaterial) {
                        const newMaterial = child.material.clone();
                        newMaterial.map = customBowlTexture;
                        // สำคัญ: ต้องตั้งค่า flipY เป็น false สำหรับ GLTF texture
                        newMaterial.map.flipY = false;
                        newMaterial.needsUpdate = true;
                        child.material = newMaterial;
                    }
                }
            });
        }
    }, [bowlModel, customBowlTexture, customTextureUrl]);

    const propMixer = useMemo(() => new THREE.AnimationMixer(propModel), [propModel]);
    const propActions = useMemo(() => {
        if (propAnims?.length > 0) {
            const action = propMixer.clipAction(propAnims[0]);
            action.play();
            action.paused = true; // prop ยังคงรอการอ้าปาก
            return { main: action };
        }
        return { main: null };
    }, [propAnims, propMixer]);

    const chopstickMixer = useMemo(() => new THREE.AnimationMixer(chopstickModel), [chopstickModel]);

    const chopstickActions = useMemo(() => {
        if (chopstickAnims?.length > 0) {
            const action = chopstickMixer.clipAction(chopstickAnims[0]);
            action.play();
            // [แก้ไข] ตั้งค่าให้เล่นตลอดเวลาโดยไม่ pause
            action.paused = false;
            return { main: action };
        }
        return { main: null };
    }, [chopstickAnims, chopstickMixer]);

    const lastMouthState = useRef("Close");

    // [ใหม่] สร้าง Ref สำหรับเก็บค่าการปรับขนาด
    const initialFaceWidth = useRef(null);
    const currentScale = useRef(1);

    useEffect(() => { propModel.visible = false; }, [propModel]);

    useFrame((state, delta) => {
        if (!isVisible) return;

        const landmarks = landmarksRef.current;
        if (!groupRef.current || !chopstickGroupRef.current) return;

        // ถ้าไม่เจอใบหน้า ให้ซ่อนโมเดลและรีเซ็ตค่าการปรับขนาด
        if (!landmarks) {
            groupRef.current.visible = false;
            chopstickGroupRef.current.visible = false;
            initialFaceWidth.current = null; // รีเซ็ตเพื่อให้คำนวณใหม่เมื่อเจอหน้าอีกครั้ง
            return;
        }

        groupRef.current.visible = true;
        chopstickGroupRef.current.visible = true;

        const anchorPoint = landmarks[152];
        if (anchorPoint) {
            const target = new THREE.Vector3();
            const screenX = (-anchorPoint.x + 0.5) * 2;
            const screenY = -(anchorPoint.y - 0.5) * 2;
            state.raycaster.setFromCamera({ x: screenX, y: screenY }, camera);
            state.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), target);
            groupRef.current.position.lerp(target, 0.5);
        }

        const forehead = new THREE.Vector3(landmarks[10].x, landmarks[10].y, landmarks[10].z);
        const chin = new THREE.Vector3(landmarks[152].x, landmarks[152].y, landmarks[152].z);
        const leftCheek = new THREE.Vector3(landmarks[234].x, landmarks[234].y, landmarks[234].z);
        const rightCheek = new THREE.Vector3(landmarks[454].x, landmarks[454].y, landmarks[454].z);
        const yAxis = new THREE.Vector3().subVectors(forehead, chin).normalize();
        const xAxis = new THREE.Vector3().subVectors(rightCheek, leftCheek).normalize();
        const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
        const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
        const faceQuaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

        groupRef.current.quaternion.slerp(faceQuaternion, 0.5);

        // --- [ใหม่] ส่วนที่ 2: จัดการการปรับขนาดตามระยะห่างของใบหน้า ---
        const p1 = new THREE.Vector2(leftCheek.x, leftCheek.y);
        const p2 = new THREE.Vector2(rightCheek.x, rightCheek.y);
        const faceWidth = p1.distanceTo(p2);

        if (initialFaceWidth.current === null) {
            initialFaceWidth.current = faceWidth; // ตั้งค่าเริ่มต้นเมื่อเจอหน้าครั้งแรก
        }
        const targetScale = faceWidth / initialFaceWidth.current;
        // ใช้ lerp เพื่อให้การปรับขนาดนุ่มนวล ไม่กระตุก
        currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
        // ปรับขนาด Group ที่ตามใบหน้า (bowl และ prop)
        groupRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);

        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        if (upperLip && lowerLip) {
            const mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
            const MOUTH_OPEN_THRESHOLD = 15;
            const currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";
            if (currentMouthState !== lastMouthState.current) {
                lastMouthState.current = currentMouthState;
                const isMouthOpen = currentMouthState === "Open";
                if (propActions.main) { propModel.visible = isMouthOpen; propActions.main.paused = !isMouthOpen; }

                // [ลบออก] ไม่ต้องควบคุมการ pause ของตะเกียบตามการอ้าปาก
                // if (chopstickActions.main) { ... }
            }
        }

        // อัปเดต Mixer ทั้งสองตัวเสมอ
        if (propMixer) propMixer.update(delta);
        if (chopstickMixer) chopstickMixer.update(delta); // mixer ของตะเกียบจะทำงานตลอดเวลา
    });

    return (
        <>
            {/* Group นี้จะถูกควบคุม scale แบบ real-time */}
            <group ref={groupRef} visible={false}>
                <primitive object={bowlModel.clone()} position={bowlAdjust.position} rotation={bowlAdjust.rotation} scale={bowlAdjust.scale} />
                <primitive object={propModel} position={propAdjust.position} rotation={propAdjust.rotation} scale={propAdjust.scale} />
            </group>

            {/* Group นี้มี scale คงที่จากไฟล์ data */}
            <group ref={chopstickGroupRef} position={chopstickAdjust.position} rotation={chopstickAdjust.rotation} scale={chopstickAdjust.scale} visible={false}>
                <primitive object={chopstickModel} />
            </group>
        </>
    );
}


// ====================================================================
// Component หลักที่รวมทุกอย่างเข้าด้วยกัน (Cleaned Up)
// ====================================================================
const ARSuperDebug = forwardRef(({ selectedFlavor, allFlavors = [], cameraFacingMode }, ref) => {
    const videoRef = useRef(null);
    const canvas2DRef = useRef(null);
    const landmarksRef = useRef(null);
    const glRef = useRef(null);
    const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);

    // [ลบออก] โค้ดส่วนนี้ไม่จำเป็นแล้ว เพราะเราใช้ allFlavors.map() และการจัดการทั้งหมดอยู่ที่ FaceAnchor
    // const modelUrls = useMemo(() => ...);
    // if (!modelUrls.bowl) return null;

    useImperativeHandle(ref, () => ({
        get arCanvas() { return glRef.current?.domElement; },
        get cameraCanvas() { return canvas2DRef.current; }
    }), []);

    useEffect(() => {
        mediaPipeService.initialize().then(() => {
            setIsMediaPipeReady(true);
        });
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !isMediaPipeReady) return;
        const faceMesh = mediaPipeService.getInstance();
        if (!faceMesh) { return; }
        let camera = null;
        faceMesh.onResults((results) => {
            const canvasElement = canvas2DRef.current;
            if (!canvasElement || !videoElement || videoElement.videoWidth === 0) return;
            const canvasCtx = canvasElement.getContext("2d");
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            landmarksRef.current = results.multiFaceLandmarks?.[0] || null;
            canvasCtx.restore();
        });
        camera = new Camera(videoElement, {
            onFrame: async () => { await faceMesh.send({ image: videoElement }); },
            width: 1280, height: 720, facingMode: cameraFacingMode
        });
        camera.start();
        return () => {
            camera?.stop();
            if (mediaPipeService.getInstance()) {
                mediaPipeService.getInstance().onResults(() => { });
            }
        };
    }, [cameraFacingMode, isMediaPipeReady]);

    return (
        <div className="super-debug-container">
            <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
            {isMediaPipeReady && (
                <>
                    <canvas ref={canvas2DRef} className="output_canvas_debug" />
                    <Canvas className="ar-canvas-3d-debug" onCreated={(state) => { glRef.current = state.gl; }} gl={{ preserveDrawingBuffer: true }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[0, 5, 5]} intensity={1.8} />
                        <Suspense fallback={null}>
                            {allFlavors.map(flavor => {
                                const isVisible = selectedFlavor?.id === flavor.id;
                                return (
                                    <group key={flavor.id} visible={isVisible}>
                                        <FaceAnchor landmarksRef={landmarksRef} flavor={flavor} isVisible={isVisible} />
                                        <HeadsUpDisplay selectedFlavor={flavor} isVisible={isVisible} />
                                    </group>
                                );
                            })}
                            <Preload all />
                        </Suspense>
                    </Canvas>
                </>
            )}
        </div>
    );
});

export default ARSuperDebug;