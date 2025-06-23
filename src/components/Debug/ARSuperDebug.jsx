import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle, useState, useCallback } from "react";
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
    const containerMaxWidthInPx = 375;
    const containerWidthPercent = 1;
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

// [ใหม่] คอมโพเนนต์สำหรับจัดการการใส่ Texture โดยเฉพาะ
function TextureInjector({ url, model, onTextureApplied }) {
    const texture = useTexture(url);

    useEffect(() => {
        if (model && texture) {
            texture.colorSpace = THREE.SRGBColorSpace;

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            texture.repeat.set(1, 1);

            texture.flipY = false;

            // ✨ แก้ไข Logic การ Traverse ✨
            model.traverse((child) => {
                if (child.isMesh && child.name.includes('mama_cup')) {
                    if (child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.map = texture;
                        // เราตั้งค่า flipY ที่ texture object โดยตรงแล้ว ไม่ต้องตั้งที่นี่ซ้ำ
                        // child.material.map.flipY = false;

                        // สำคัญ: ต้องสั่ง needsUpdate ที่ตัว texture ด้วย
                        child.material.map.needsUpdate = true;

                        child.material.metalness = 0;
                        child.material.roughness = 0.2;
                        child.material.needsUpdate = true;
                    }
                }
            });

            onTextureApplied();
        }
    }, [model, texture, onTextureApplied]);

    return null;
}

// ====================================================================
// FaceAnchor Component (The Final, Corrected Version)
// ====================================================================
function FaceAnchor({ landmarksRef, flavor, isVisible }) {
    const groupRef = useRef();
    const chopstickGroupRef = useRef();
    const { camera } = useThree();

    // [ใหม่] Ref สำหรับจำว่าโมเดลเคยถูกวางบนใบหน้าแล้วหรือยัง
    const hasBeenPlaced = useRef(false);

    // [ใหม่] เมื่อ isVisible เปลี่ยนเป็น false (ผู้ใช้เลือกรสอื่น)
    // เราต้องรีเซ็ตสถานะ `hasBeenPlaced` ด้วย
    useEffect(() => {
        if (!isVisible) {
            hasBeenPlaced.current = false;
        }
    }, [isVisible]);

    // --- ส่วนของการโหลดโมเดลและ setup อื่นๆ เหมือนเดิมทั้งหมด ---
    const bowlAdjust = flavor.adjustments?.bowl
    const propAdjust = flavor.adjustments?.prop
    const chopstickAdjust = flavor.adjustments?.chopstick
    const { scene: originalBowl } = useGLTF(flavor.models.bowl);
    const { scene: originalProp, animations: propAnims } = useGLTF(flavor.models.prop);
    const { scene: originalChopstick, animations: chopstickAnims } = useGLTF(flavor.models.chopstick);
    const bowlModel = useMemo(() => originalBowl.clone(), [originalBowl]);
    const propModel = useMemo(() => originalProp.clone(), [originalProp]);
    const chopstickModel = useMemo(() => originalChopstick.clone(), [originalChopstick]);

    const customTextureUrl = bowlAdjust.customTexture;
    const [isReadyToRender, setIsReadyToRender] = useState(!customTextureUrl);

    // ใช้ callback ที่ memoized เพื่อป้องกันการ re-render ของ TextureInjector
    const handleTextureApplied = useCallback(() => {
        setIsReadyToRender(true);
    }, []);

    const propMixer = useMemo(() => new THREE.AnimationMixer(propModel), [propModel]);
    const propActions = useMemo(() => {
        if (propAnims && propAnims.length > 0) { const action = propMixer.clipAction(propAnims[0]); action.play(); action.paused = true; return { main: action }; }
        return { main: null };
    }, [propAnims, propMixer]);
    const chopstickMixer = useMemo(() => new THREE.AnimationMixer(chopstickModel), [chopstickModel]);
    const chopstickActions = useMemo(() => {
        if (chopstickAnims && chopstickAnims.length > 0) { const action = chopstickMixer.clipAction(chopstickAnims[0]); action.play(); action.paused = false; return { main: action }; }
        return { main: null };
    }, [chopstickAnims, chopstickMixer]);
    const lastMouthState = useRef("Close");
    useEffect(() => { propModel.visible = false; }, [propModel]);

    useFrame((state, delta) => {
        const group = groupRef.current;
        const chopstickGroup = chopstickGroupRef.current;
        const landmarks = landmarksRef.current;

        // ถ้า group ยังไม่พร้อม หรือรสชาตินี้ไม่ถูกเลือกอยู่ ให้หยุดทำงาน
        if (!group || !chopstickGroup || !isVisible) {
            return;
        }

        // ถ้าหาใบหน้าไม่เจอ
        if (!landmarks) {
            // ซ่อนโมเดลไว้
            group.visible = false;
            chopstickGroup.visible = false;
            // รีเซ็ตสถานะ "เคยวางแล้ว" เพื่อให้ครั้งหน้าที่เจอหน้า จะได้วาร์ปไปใหม่
            hasBeenPlaced.current = false;
            return;
        }

        // --- คำนวณตำแหน่งและทิศทางการหมุน (เหมือนเดิม) ---
        const anchorPoint = landmarks[152];
        const target = new THREE.Vector3();
        if (anchorPoint) {
            const screenX = (-anchorPoint.x + 0.5) * 2;
            const screenY = -(anchorPoint.y - 0.5) * 2;
            state.raycaster.setFromCamera({ x: screenX, y: screenY }, camera);
            state.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), target);
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

        // --- ✨ Logic การวางและแสดงผลที่สมบูรณ์แบบ ✨ ---
        if (!hasBeenPlaced.current) {
            // ครั้งแรกที่เจอหน้า: วาร์ปไปที่ตำแหน่งและทิศทางนั้นทันที
            group.position.copy(target);
            group.quaternion.copy(faceQuaternion);
            hasBeenPlaced.current = true; // ตั้งธงว่าวางแล้ว

            // จากนั้นค่อยสั่งให้ "แสดงผล"
            group.visible = true;
            chopstickGroup.visible = true;
        } else {
            // ตั้งแต่ครั้งที่สองเป็นต้นไป: ใช้ lerp เพื่อความนุ่มนวล
            group.position.lerp(target, 0.5);
            group.quaternion.slerp(faceQuaternion, 0.5);
        }

        // --- Logic การอ้าปากและ Animation (เหมือนเดิม) ---
        // ... (ส่วนนี้ไม่มีการเปลี่ยนแปลง) ...
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
            }
        }
        if (propMixer) propMixer.update(delta);
        if (chopstickMixer) chopstickMixer.update(delta);
    });

    // --- ส่วน JSX ที่ return เหมือนเดิม ---
    // สังเกตว่า group ยังคงเริ่มต้นด้วย visible={false} ซึ่งถูกต้องแล้ว!
    // เพราะเราจะควบคุมการแสดงผลจากใน useFrame
    return (
        <>
            {/* ส่ง callback ที่ memoized เข้าไป */}
            {customTextureUrl && (
                <TextureInjector url={customTextureUrl} model={bowlModel} onTextureApplied={handleTextureApplied} />
            )}
            {/* เปลี่ยนเงื่อนไขมาใช้ state เดียว */}
            {isReadyToRender && (
                <>
                    <group ref={groupRef} visible={false}>
                        <primitive object={bowlModel} position={bowlAdjust.position} rotation={bowlAdjust.rotation} scale={bowlAdjust.scale} />
                        <primitive object={propModel} position={propAdjust.position} rotation={propAdjust.rotation} scale={propAdjust.scale} />
                    </group>
                    <group ref={chopstickGroupRef} position={chopstickAdjust.position} rotation={chopstickAdjust.rotation} scale={chopstickAdjust.scale} visible={false}>
                        <primitive object={chopstickModel} />
                    </group>
                </>
            )}
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
    const cameraInstanceRef = useRef(null);

    useImperativeHandle(ref, () => ({
        get arCanvas() { return glRef.current?.domElement; },
        get cameraCanvas() { return canvas2DRef.current; }
    }), []);

    useEffect(() => {
        mediaPipeService.initialize().then(() => {
            setIsMediaPipeReady(true);
        });
    }, []);

    // ✨ ย้อนกลับ useEffect นี้ไปเป็นเวอร์ชันที่ทำงานทันที ✨
    useEffect(() => {
        const videoElement = videoRef.current;
        // เงื่อนไขการหยุดยังคงเดิม
        if (!videoElement || !isMediaPipeReady) return;

        let camera = null;

        const startNewCamera = () => {
            console.log(`(ARSuperDebug) Initializing camera with mode: ${cameraFacingMode}`);
            const faceMesh = mediaPipeService.getInstance();
            if (!faceMesh) return;

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

            // สร้างและเริ่มกล้องทันที
            camera = new Camera(videoElement, {
                onFrame: async () => { await faceMesh.send({ image: videoElement }); },
                width: 1280,
                height: 720,
                facingMode: cameraFacingMode
            });

            camera.start();
            cameraInstanceRef.current = camera;
        };

        // หยุดกล้องเก่าก่อนเริ่มกล้องใหม่
        if (cameraInstanceRef.current) {
            cameraInstanceRef.current.stop().then(() => {
                startNewCamera();
            });
        } else {
            startNewCamera();
        }

        // Cleanup function
        return () => {
            console.log("(ARSuperDebug) Cleaning up camera.");
            if (cameraInstanceRef.current) {
                cameraInstanceRef.current.stop();
                cameraInstanceRef.current = null;
            }
        };
        // Dependency array กลับมาเป็นแบบเดิม
    }, [cameraFacingMode, isMediaPipeReady]);

    return (
        <div className="super-debug-container">
            <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
            {isMediaPipeReady && (
                <>
                    <canvas ref={canvas2DRef} className="output_canvas_debug" />
                    <Canvas className="ar-canvas-3d-debug" onCreated={(state) => { glRef.current = state.gl; }} gl={{ preserveDrawingBuffer: true }}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[0, 5, 5]} intensity={1} />
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