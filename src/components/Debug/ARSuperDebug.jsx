import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle, useState, useCallback } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, useVideoTexture, useTexture } from '@react-three/drei';
import mediaPipeService from "../../services/mediaPipeService";
import { Camera } from "@mediapipe/camera_utils";
import adaptiveFaceService from "../../services/adaptiveFaceService";
import tensorflowService from "../../services/tensorflowService";

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

// HeadsUpDisplay component with large presenter video and consistent margin/size
function HeadsUpDisplay({ selectedFlavor, isVisible }) {
    const { viewport } = useThree();

    // presenter video ขยายขึ้นอีกนิด (75% ของจอ)
    const maxWidth = viewport.width * 0.75;   // 75% ของจอ
    const maxHeight = viewport.height * 0.28; // 28% ของจอ (margin บน)

    let containerWidth = maxWidth;
    let containerHeight = containerWidth * 9 / 16;
    if (containerHeight > maxHeight) {
        containerHeight = maxHeight;
        containerWidth = containerHeight * 16 / 9;
    }

    const topMargin = 0.08;
    const containerX = 0;
    const containerY = (viewport.height / 2) - (containerHeight / 2) - topMargin;

    // Logo
    const logoUrl = '/assets/images/mama-logo.webp';
    const logoTexture = useTexture(logoUrl);
    // คำนวณอัตราส่วนโลโก้จริง
    const logoAspectRatio = (logoTexture?.image?.naturalWidth && logoTexture?.image?.naturalHeight)
        ? logoTexture.image.naturalWidth / logoTexture.image.naturalHeight
        : 1.8; // fallback เผื่อโหลดไม่ทัน
    const logoWidth = containerWidth * 0.13;
    const logoHeight = logoWidth / logoAspectRatio;
    const logoMargin = containerWidth * 0.04;
    const logoX = -containerWidth / 2 + logoMargin + (logoWidth / 2);
    const logoY = containerHeight / 2 - logoMargin - (logoHeight / 2);

    const videoUrl = selectedFlavor?.videoPublicId || '';
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

    const cornerRadius = 0.05;
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
function FaceAnchor({ landmarksRef, flavor, isVisible }) {
    const groupRef = useRef();
    const chopstickGroupRef = useRef();
    const { camera } = useThree();
    const hasBeenPlaced = useRef(false);

    useEffect(() => {
        if (!isVisible) {
            hasBeenPlaced.current = false;
        }
    }, [isVisible]);

    const bowlAdjust = flavor.adjustments?.bowl
    const propAdjust = flavor.adjustments?.prop
    const chopstickAdjust = flavor.adjustments?.chopstick

    const { gltf: bowlGltf, error: bowlError } = useRobustGLTF(flavor.models.bowl);
    const { gltf: propGltf, error: propError } = useRobustGLTF(flavor.models.prop);
    const { gltf: chopstickGltf, error: chopstickError } = useRobustGLTF(flavor.models.chopstick);

    const bowlModel = useMemo(() => bowlGltf?.scene?.clone(), [bowlGltf]);
    const propModel = useMemo(() => propGltf?.scene?.clone(), [propGltf]);
    const chopstickModel = useMemo(() => chopstickGltf?.scene?.clone(), [chopstickGltf]);

    const customTextureUrl = bowlAdjust.customTexture;
    const [isReadyToRender, setIsReadyToRender] = useState(!customTextureUrl);
    const handleTextureApplied = useCallback(() => {
        setIsReadyToRender(true);
    }, []);

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
    useEffect(() => {
        if (chopstickGltf?.animations?.length > 0 && chopstickMixer) {
            const action = chopstickMixer.clipAction(chopstickGltf.animations[0]);
            action.play();
            action.paused = false; // เล่นตลอดเวลา
        }
    }, [chopstickGltf?.animations, chopstickMixer]);
    const lastMouthState = useRef("Close");
    useEffect(() => {
        if (propModel) propModel.visible = false;
    }, [propModel]);

    useFrame((state, delta) => {
        const group = groupRef.current;
        const chopstickGroup = chopstickGroupRef.current;
        const landmarks = landmarksRef.current;
        if (bowlError || propError || chopstickError) return;
        if (!bowlModel || !propModel || !chopstickModel) return;
        if (!group || !chopstickGroup || !isVisible) return;

        // --- ตะเกียบแสดงผลตลอดเวลา ---
        chopstickGroup.visible = true;

        // ถ้าหาใบหน้าไม่เจอ
        if (!landmarks) {
            group.visible = false;
            // chopstickGroup.visible = true; // ตะเกียบแสดงผลตลอด
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

        if (!hasBeenPlaced.current) {
            group.position.copy(target);
            group.quaternion.copy(faceQuaternion);
            hasBeenPlaced.current = true;
            group.visible = true;
        } else {
            group.position.lerp(target, 0.5);
            group.quaternion.slerp(faceQuaternion, 0.5);
        }

        // --- Logic การอ้าปาก/ปิดปาก: เล่น/หยุด/รีเซ็ตอนิเมชัน prop ---
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        if (upperLip && lowerLip) {
            const mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
            const MOUTH_OPEN_THRESHOLD = 15;
            const currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";
            if (currentMouthState !== lastMouthState.current) {
                lastMouthState.current = currentMouthState;
                const isMouthOpen = currentMouthState === "Open";
                if (propActions.main) {
                    if (isMouthOpen) {
                        propActions.main.reset();
                        propActions.main.paused = false;
                        propModel.visible = true;
                    } else {
                        propActions.main.reset();
                        propActions.main.paused = true;
                        propModel.visible = false;
                    }
                }
            }
        }
        if (propMixer) propMixer.update(delta);
        if (chopstickMixer) chopstickMixer.update(delta);
    });

    if (bowlError || propError || chopstickError) {
        console.error("Model loading errors:", { bowlError, propError, chopstickError });
        return null;
    }
    if (!bowlModel || !propModel || !chopstickModel) {
        return null;
    }
    return (
        <>
            {customTextureUrl && (
                <TextureInjector url={customTextureUrl} model={bowlModel} onTextureApplied={handleTextureApplied} />
            )}
            {isReadyToRender && (
                <>
                    <group ref={groupRef} visible={false}>
                        <primitive object={bowlModel} position={bowlAdjust.position} rotation={bowlAdjust.rotation} scale={bowlAdjust.scale} />
                        <primitive object={propModel} position={propAdjust.position} rotation={propAdjust.rotation} scale={propAdjust.scale} />
                    </group>
                    <group ref={chopstickGroupRef} position={chopstickAdjust.position} rotation={chopstickAdjust.rotation} scale={chopstickAdjust.scale} visible={true}>
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
    const [isReady, setIsReady] = useState(false);
    const cameraInstanceRef = useRef(null);
    const [serviceType, setServiceType] = useState(() => adaptiveFaceService.getServiceInfo().service);
    const tfLoopRef = useRef(null);

    useImperativeHandle(ref, () => ({
        get arCanvas() { return glRef.current?.domElement; },
        get cameraCanvas() { return canvas2DRef.current; }
    }), []);

    useEffect(() => {
        const interval = setInterval(() => {
            const info = adaptiveFaceService.getServiceInfo();
            if (info.service !== serviceType) setServiceType(info.service);
        }, 500);
        return () => clearInterval(interval);
    }, [serviceType]);

    useEffect(() => {
        return () => {
            if (cameraInstanceRef.current) {
                cameraInstanceRef.current.stop();
                cameraInstanceRef.current = null;
            }
            if (tfLoopRef.current) {
                tfLoopRef.current.cancelled = true;
                tfLoopRef.current = null;
            }
            const videoElement = videoRef.current;
            if (videoElement && videoElement.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
            setIsReady(false);
        };
    }, [serviceType, cameraFacingMode]);

    useEffect(() => {
        if (serviceType === "none") {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } })
                .then(stream => {
                    videoElement.srcObject = stream;
                    videoElement.play();
                })
                .catch(err => {
                    console.error("Cannot access camera for preview:", err);
                });
            landmarksRef.current = null;
            setIsReady(true);
            return () => {
                setIsReady(false);
            };
        }
    }, [serviceType, cameraFacingMode]);

    useEffect(() => {
        if (serviceType !== "mediapipe") return;
        mediaPipeService.initialize().then(() => {
            setIsReady(true);
        });
    }, [serviceType]);

    useEffect(() => {
        if (serviceType !== "mediapipe") return;
        const videoElement = videoRef.current;
        if (!videoElement || !isReady) return;
        let camera = null;
        const startNewCamera = () => {
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
            camera = new Camera(videoElement, {
                onFrame: async () => { await faceMesh.send({ image: videoElement }); },
                width: 1280,
                height: 720,
                facingMode: cameraFacingMode
            });
            camera.start();
            cameraInstanceRef.current = camera;
        };
        if (cameraInstanceRef.current) {
            cameraInstanceRef.current.stop().then(() => {
                startNewCamera();
            });
        } else {
            startNewCamera();
        }
        return () => {
            if (cameraInstanceRef.current) {
                cameraInstanceRef.current.stop();
                cameraInstanceRef.current = null;
            }
        };
    }, [cameraFacingMode, isReady, serviceType]);

    useEffect(() => {
        if (serviceType !== "tensorflow") return;
        let isMounted = true;
        let loopObj = { cancelled: false };
        tfLoopRef.current = loopObj;
        const videoElement = videoRef.current;
        const canvasElement = canvas2DRef.current;
        const runTFLoop = async () => {
            await tensorflowService.initialize();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } });
                videoElement.srcObject = stream;
                await videoElement.play();
            } catch (err) {
                console.error("Cannot access camera for TFJS:", err);
                setIsReady(false);
                return;
            }
            setIsReady(true);
            const detectLoop = async () => {
                if (!isMounted || loopObj.cancelled) return;
                if (videoElement.readyState < 2) {
                    requestAnimationFrame(detectLoop);
                    return;
                }
                if (canvasElement) {
                    canvasElement.width = videoElement.videoWidth;
                    canvasElement.height = videoElement.videoHeight;
                    const ctx = canvasElement.getContext("2d");
                    ctx.save();
                    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                    ctx.restore();
                }
                try {
                    console.log('[TFJS] video readyState:', videoElement.readyState, 'srcObject:', videoElement.srcObject);
                    const faces = await tensorflowService.detectFaces(videoElement, true);
                    console.log('[TFJS] faces:', faces, 'video size:', videoElement.videoWidth, videoElement.videoHeight);
                    if (faces && faces.length > 0 && faces[0].keypoints && faces[0].keypoints.length >= 1) {
                        const width = videoElement.videoWidth;
                        const height = videoElement.videoHeight;
                        console.log('[TFJS] keypoints:', faces[0].keypoints);
                        faces[0].keypoints.forEach((pt, i) => {
                            console.log(`[TFJS] keypoint[${i}]: x=${pt.x}, y=${pt.y}, name=${pt.name}`);
                        });
                        if (faces[0].keypoints.every(pt => pt.x === 0 && pt.y === 0)) {
                            console.warn('[TFJS] All keypoints are (0,0) - model or input problem');
                        }
                        // Map 6 จุดไปยัง index mediapipe (mock 468 จุด)
                        const tfLandmarks = faces[0].keypoints.map(pt => ({ x: 1 - (pt.x / width), y: pt.y / height, z: 0 }));
                        const mpLandmarks = Array(468).fill(null);
                        if (tfLandmarks[0]) mpLandmarks[0] = tfLandmarks[0];
                        if (tfLandmarks[1]) mpLandmarks[13] = tfLandmarks[1];
                        if (tfLandmarks[2]) mpLandmarks[14] = tfLandmarks[2];
                        if (tfLandmarks[3]) mpLandmarks[10] = tfLandmarks[3];
                        if (tfLandmarks[4]) mpLandmarks[152] = tfLandmarks[4];
                        if (tfLandmarks[5]) mpLandmarks[234] = tfLandmarks[5];
                        if (tfLandmarks[5]) mpLandmarks[454] = tfLandmarks[5];
                        landmarksRef.current = mpLandmarks;
                        // วาด overlay จุดที่ detect ได้
                        if (canvasElement) {
                            console.log('[TFJS] draw overlay on canvas', canvasElement.width, canvasElement.height);
                            const ctx = canvasElement.getContext("2d");
                            ctx.save();
                            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                            ctx.fillStyle = '#ff0000';
                            faces[0].keypoints.forEach(pt => {
                                ctx.beginPath();
                                ctx.arc(canvasElement.width - pt.x, pt.y, 4, 0, 2 * Math.PI);
                                ctx.fill();
                            });
                            ctx.restore();
                        }
                    } else {
                        console.warn('[TFJS] No face detected or not enough keypoints', faces);
                        landmarksRef.current = null;
                    }
                } catch {
                    landmarksRef.current = null;
                }
                requestAnimationFrame(detectLoop);
            };
            detectLoop();
        };
        runTFLoop();
        return () => {
            isMounted = false;
            loopObj.cancelled = true;
            if (videoElement && videoElement.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
            setIsReady(false);
        };
    }, [serviceType, cameraFacingMode]);

    return (
        <div className="super-debug-container">
            <video
                ref={videoRef}
                className="input_video"
                autoPlay
                playsInline
                style={{ display: serviceType !== 'mediapipe' ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1, transform: 'scaleX(-1)' }}
            />
            {isReady && (
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
                                            <FaceAnchor landmarksRef={landmarksRef} flavor={flavor} isVisible={isVisible} />
                                            <HeadsUpDisplay selectedFlavor={flavor} isVisible={isVisible} />
                                        </group>
                                    );
                                })}
                                <Preload all />
                            </Suspense>
                        </Canvas>
                    </ThreeJSErrorBoundary>
                    {serviceType === "none" && (
                        <div style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginTop: 24 }}>
                            👁️ Face detection is OFF (3D overlay is static)
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

export default ARSuperDebug;