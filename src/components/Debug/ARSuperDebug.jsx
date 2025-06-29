import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle, useState, useCallback } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, useVideoTexture, useTexture } from '@react-three/drei';
import mediaPipeService from "../../services/mediaPipeService";
import { Camera } from "@mediapipe/camera_utils";

import './ARSuperDebug.css';

// ✨ Error Boundary Component for 3D Scene ✨
class ThreeJSErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ThreeJS Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="threejs-error-fallback">
                    <p>เกิดข้อผิดพลาดในการแสดงผล 3D กรุณาลองใหม่อีกครั้ง</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })}>
                        ลองใหม่
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// ✨ Robust GLTF Loader with Error Handling ✨
function useRobustGLTF(url) {
    const [gltf, setGltf] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const loadModel = async () => {
            try {
                // Use the existing preloadGLTF function with timeout
                const result = await Promise.race([
                    import('../../utils/preloadGLTF').then(m => m.preloadGLTF(url)),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Model loading timeout')), 15000)
                    )
                ]);

                if (isMounted) {
                    setGltf(result);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(`Failed to load model: ${url}`, err);
                if (isMounted) {
                    setError(err);
                    setIsLoading(false);
                }
            }
        };

        loadModel();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { gltf, error, isLoading };
}

// ✨ Robust Texture Loader with Error Handling ✨
function useRobustTexture(url) {
    const [texture, setTexture] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const loadTexture = async () => {
            try {
                const loader = new THREE.TextureLoader();
                const result = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Texture loading timeout')), 10000);

                    loader.load(
                        url,
                        (tex) => {
                            clearTimeout(timeout);
                            resolve(tex);
                        },
                        undefined,
                        (err) => {
                            clearTimeout(timeout);
                            reject(err);
                        }
                    );
                });

                if (isMounted) {
                    setTexture(result);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(`Failed to load texture: ${url}`, err);
                if (isMounted) {
                    setError(err);
                    setIsLoading(false);
                }
            }
        };

        loadTexture();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { texture, error, isLoading };
}

// HeadsUpDisplay component with improved error handling
function HeadsUpDisplay({ selectedFlavor, isVisible }) {
    const { viewport, size } = useThree();

    const logoUrl = '/assets/images/mama-logo.webp';
    const videoUrl = selectedFlavor?.videoPublicId || '';

    // ใช้ useTexture ปกติสำหรับ logo เพื่อให้แสดงผลได้
    const logoTexture = useTexture(logoUrl);

    // Improved video texture handling
    const videoTexture = useVideoTexture(videoUrl, {
        muted: true,
        loop: true,
        start: false,
        crossOrigin: "anonymous",
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

    // Move all calculations before the early return
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
    const logoAspectRatio = (logoTexture?.image?.naturalWidth / logoTexture?.image?.naturalHeight) || 1;
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
    const { texture, error: textureError } = useRobustTexture(url);

    useEffect(() => {
        if (model && texture && !textureError) {
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
                        child.material.map.needsUpdate = true;
                        child.material.metalness = 0;
                        child.material.roughness = 0.2;
                        child.material.needsUpdate = true;
                    }
                }
            });

            onTextureApplied();
        }
    }, [model, texture, textureError, onTextureApplied]);

    return null;
}

// ====================================================================
// FaceAnchor Component (Production-Ready with Error Handling)
// ====================================================================
function FaceAnchor({ landmarksRef, flavor, isVisible, isTrackingEnabled }) {
    const groupRef = useRef();
    const chopstickGroupRef = useRef();
    const { camera } = useThree();

    const hasBeenPlaced = useRef(false);

    // [ใหม่] State และ Ref สำหรับระบบตรวจจับการสั่น (Jitter Detection)
    const [isTrackingStable, setIsTrackingStable] = useState(true);
    const lastLandmarkPos = useRef(null);
    const jitterCounter = useRef(0);

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

    // [ใหม่] ดึงค่า fallback adjustments ออกมา
    const fallbackAdjust = flavor.fallbackAdjustments;

    // Use robust GLTF loading for all models
    const { gltf: bowlGltf, error: bowlError } = useRobustGLTF(flavor.models.bowl);
    const { gltf: propGltf, error: propError } = useRobustGLTF(flavor.models.prop);
    const { gltf: chopstickGltf, error: chopstickError } = useRobustGLTF(flavor.models.chopstick);

    // Create model clones only when GLTF is loaded successfully
    const bowlModel = useMemo(() => bowlGltf?.scene?.clone(), [bowlGltf]);
    const propModel = useMemo(() => propGltf?.scene?.clone(), [propGltf]);
    const chopstickModel = useMemo(() => chopstickGltf?.scene?.clone(), [chopstickGltf]);

    const customTextureUrl = bowlAdjust.customTexture;
    const [isReadyToRender, setIsReadyToRender] = useState(!customTextureUrl);

    // ใช้ callback ที่ memoized เพื่อป้องกันการ re-render ของ TextureInjector
    const handleTextureApplied = useCallback(() => {
        setIsReadyToRender(true);
    }, []);

    // Only create mixers and actions if models are loaded
    const propMixer = useMemo(() =>
        propModel ? new THREE.AnimationMixer(propModel) : null,
        [propModel]
    );

    const propActions = useMemo(() => {
        if (propGltf?.animations?.length > 0 && propMixer) {
            const action = propMixer.clipAction(propGltf.animations[0]);
            action.play();
            action.paused = true;
            return { main: action };
        }
        return { main: null };
    }, [propGltf?.animations, propMixer]);

    const chopstickMixer = useMemo(() =>
        chopstickModel ? new THREE.AnimationMixer(chopstickModel) : null,
        [chopstickModel]
    );

    // เพิ่ม chopstick animation ที่เล่นตลอดเวลา
    useEffect(() => {
        if (chopstickGltf?.animations?.length > 0 && chopstickMixer) {
            const action = chopstickMixer.clipAction(chopstickGltf.animations[0]);
            action.play();
            action.paused = false; // เล่นตลอดเวลา
        }
    }, [chopstickGltf?.animations, chopstickMixer]);

    useEffect(() => {
        if (propModel) propModel.visible = false;
    }, [propModel]);

    // All hooks must be called before any conditional returns
    useFrame((state, delta) => {
        const group = groupRef.current;
        const chopstickGroup = chopstickGroupRef.current;
        let landmarks = isTrackingEnabled ? landmarksRef.current : null;

        // --- [ใหม่] Jitter Detection Logic ---
        if (landmarks) {
            const JITTER_THRESHOLD = 0.05; // ค่าความเปลี่ยนแปลงสูงสุดที่ยอมรับได้
            const MAX_JITTER_COUNT = 10;   // จำนวนเฟรมที่สั่นติดต่อกันก่อนจะปิด tracking
            const currentPos = landmarks[152]; // ใช้ปลายคางเป็นจุดอ้างอิง

            if (lastLandmarkPos.current && currentPos) {
                const distance = new THREE.Vector2(currentPos.x, currentPos.y).distanceTo(lastLandmarkPos.current);
                if (distance > JITTER_THRESHOLD) {
                    jitterCounter.current++;
                } else {
                    jitterCounter.current = 0; // รีเซ็ตถ้ากลับมานิ่ง
                }
            }

            if (currentPos) {
                lastLandmarkPos.current = new THREE.Vector2(currentPos.x, currentPos.y);
            }

            if (jitterCounter.current > MAX_JITTER_COUNT) {
                if (isTrackingStable) {
                    console.warn("Jitter detected! Tracking is unstable. Forcing fallback mode.");
                    setIsTrackingStable(false);
                }
            }
        } else {
            // ถ้ารไม่เจอหน้าเลย ก็ถือว่า tracking "เสถียร" (รอเจอหน้าใหม่)
            if (!isTrackingStable) setIsTrackingStable(true);
            jitterCounter.current = 0;
            lastLandmarkPos.current = null;
        }

        // ถ้า tracking ไม่เสถียร ให้บังคับใช้ fallback mode
        if (!isTrackingStable) {
            landmarks = null;
        }
        // ------------------------------------

        // Don't render if any critical model failed to load
        if (bowlError || propError || chopstickError) {
            return;
        }

        // Don't render if models aren't ready
        if (!bowlModel || !propModel || !chopstickModel) {
            return;
        }

        // ถ้า group ยังไม่พร้อม หรือรสชาตินี้ไม่ถูกเลือกอยู่ ให้หยุดทำงาน
        if (!group || !chopstickGroup || !isVisible) {
            return;
        }

        // ถ้าหาใบหน้าไม่เจอ
        if (!landmarks) {
            // [แก้ไข] แสดงโมเดล Fallback ทันทีถ้าไม่เจอหน้า
            // เพื่อให้แน่ใจว่าผู้ใช้เห็นผลลัพธ์เสมอ แม้ระบบ face-tracking ไม่ทำงาน
            if (fallbackAdjust && bowlAdjust) {
                group.visible = true;
                chopstickGroup.visible = true;

                // [แก้ไข] คำนวณ scale factor ที่ถูกต้องเพื่อไม่ให้ค่าคูณกัน
                const groupScaleFactor = fallbackAdjust.bowl.scale / bowlAdjust.scale;
                group.position.fromArray(fallbackAdjust.bowl.position);
                group.rotation.fromArray(fallbackAdjust.bowl.rotation);
                group.scale.setScalar(groupScaleFactor);

                // ปรับตำแหน่งตะเกียบ/ส้อม แยก
                chopstickGroup.position.fromArray(fallbackAdjust.chopstick.position);
                chopstickGroup.rotation.fromArray(fallbackAdjust.chopstick.rotation);
                chopstickGroup.scale.setScalar(fallbackAdjust.chopstick.scale);

                // เล่นอนิเมชันอ้าปาก (prop)
                if (propModel) {
                    propModel.visible = true;
                    // prop ใช้ scale และ rotation เดียวกับ bowl ใน group หลัก
                }
                if (propActions.main) propActions.main.paused = false;

                // อัพเดท mixer ของอนิเมชัน
                if (propMixer) propMixer.update(delta);
                if (chopstickMixer) chopstickMixer.update(delta);

            } else {
                // กรณีไม่มี fallbackAdjustments ให้ซ่อนโมเดลไปก่อน
                group.visible = false;
                chopstickGroup.visible = false;
            }

            // รีเซ็ตสถานะ "เคยวางแล้ว" เมื่อไม่เจอหน้า
            // เพื่อให้ครั้งหน้าที่เจอหน้า โมเดลจะ snap ไปทันที ไม่ลอยมา
            hasBeenPlaced.current = false;

            return; // ออกจากการทำงานของ useFrame
        }

        // --- คำนวณตำแหน่งและทิศทางการหมุน (กลับไปใช้แบบดั้งเดิม) ---
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
            // ครั้งแรกที่เจอหน้า: วาร์ปไปที่ตำแหน่งและทิศทางนั้นทันที (ตอนที่ model ยัง invisible)
            group.position.copy(target);
            group.quaternion.copy(faceQuaternion);
            hasBeenPlaced.current = true; // ตั้งธงว่าวางแล้ว

            // จากนั้นค่อยสั่งให้ "แสดงผล" โมเดลจะโผล่มาในตำแหน่งที่ถูกต้องเลย
            group.visible = true;
            chopstickGroup.visible = true;
        } else {
            // ตั้งแต่ครั้งที่สองเป็นต้นไป: ใช้ lerp เพื่อความนุ่มนวล
            group.position.lerp(target, 0.5);
            group.quaternion.slerp(faceQuaternion, 0.5);
        }

        // [แก้ไข] รีเซ็ตสเกลของ group และ transform ของ chopstick
        // เพื่อป้องกันค่าจากโหมด fallback รั่วไหลมา
        group.scale.set(1, 1, 1);
        if (chopstickAdjust) {
            chopstickGroup.position.fromArray(chopstickAdjust.position);
            chopstickGroup.rotation.fromArray(chopstickAdjust.rotation);
            chopstickGroup.scale.setScalar(chopstickAdjust.scale);
        }

        // --- Logic การอ้าปากและ Animation (เหมือนเดิม) ---
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        let mouthOpening = null;
        if (upperLip && lowerLip) {
            mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
        }
        const MOUTH_OPEN_THRESHOLD = 15;
        let currentMouthState = 'Close';
        if (mouthOpening !== null) {
            currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? 'Open' : 'Close';
        } else {
            // fallback: ถ้า detect ไม่ได้ ให้ถือว่าปิดปาก
            currentMouthState = 'Close';
            // TODO: Debug log (Cannot detect mouth opening, fallback to Close.)
        }

        // [แก้ไข] อัปเดตสถานะอนิเมชันทุกเฟรม แทนการเช็คการเปลี่ยนแปลง
        const isMouthOpen = currentMouthState === 'Open';
        if (propActions.main) {
            propModel.visible = isMouthOpen;
            propActions.main.paused = !isMouthOpen;
        } else {
            // TODO: Debug log (propActions.main is null, cannot animate propModel.)
        }

        if (propMixer) propMixer.update(delta);
        if (chopstickMixer) chopstickMixer.update(delta);
    });

    // Don't render if any critical model failed to load
    if (bowlError || propError || chopstickError) {
        console.error("Model loading errors:", { bowlError, propError, chopstickError });
        return null;
    }

    // Don't render if models aren't ready
    if (!bowlModel || !propModel || !chopstickModel) {
        return null;
    }

    // --- ส่วน JSX ที่ return เหมือนเดิม ---
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
    // [ใหม่] State สำหรับเปิด/ปิดการติดตามใบหน้า
    const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

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
            {/* [DEBUG] ปุ่มสำหรับเปิด/ปิด Face Tracking ถูกคอมเมนต์ไว้ชั่วคราว
            <button
                onClick={() => setIsTrackingEnabled(p => !p)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1001,
                    padding: '12px 20px',
                    fontSize: '14px',
                    backgroundColor: `rgba(0, 0, 0, ${isTrackingEnabled ? '0.5' : '0.8'})`,
                    color: 'white',
                    border: `1px solid ${isTrackingEnabled ? 'lightgreen' : 'orange'}`,
                    borderRadius: '25px',
                    cursor: 'pointer',
                    minWidth: '220px',
                    textAlign: 'center'
                }}
            >
                Face Tracking: {isTrackingEnabled ? 'ON' : 'OFF (Fallback Mode)'}
            </button>
            */}
            {isMediaPipeReady && (
                <>
                    <canvas ref={canvas2DRef} className="output_canvas_debug" />
                    <ThreeJSErrorBoundary>
                        <Canvas className="ar-canvas-3d-debug" onCreated={(state) => { glRef.current = state.gl; }} gl={{ preserveDrawingBuffer: true }}>
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[0, 5, 5]} intensity={1} />
                            <Suspense fallback={null}>
                                {allFlavors.map(flavor => {
                                    const isVisible = selectedFlavor?.id === flavor.id;
                                    return (
                                        <group key={flavor.id} visible={isVisible}>
                                            <FaceAnchor
                                                landmarksRef={landmarksRef}
                                                flavor={flavor}
                                                isVisible={isVisible}
                                                isTrackingEnabled={isTrackingEnabled}
                                            />
                                            <HeadsUpDisplay selectedFlavor={flavor} isVisible={isVisible} />
                                        </group>
                                    );
                                })}
                                <Preload all />
                            </Suspense>
                        </Canvas>
                    </ThreeJSErrorBoundary>
                </>
            )}
        </div>
    );
});

export default ARSuperDebug;