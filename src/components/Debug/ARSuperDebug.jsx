import React, { useRef, useEffect, Suspense, useMemo, forwardRef, useImperativeHandle, useState } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload, useVideoTexture, useTexture } from '@react-three/drei';
import mediaPipeService from "../../services/mediaPipeService";
import { Camera } from "@mediapipe/camera_utils";

import './ARSuperDebug.css';

// ไม่ต้องใช้คอมโพเนนต์ RoundedPlane แล้ว ลบทิ้งได้เลย

/**
 * HeadsUpDisplay (HUD) Component (เวอร์ชันแก้ไข 최종)
 * สร้าง UI วิดีโอขอบมน โดยใช้ Shader เพื่อประสิทธิภาพและความยืดหยุ่นสูงสุด
 */
function HeadsUpDisplay({ selectedFlavor }) {
    const { viewport, size } = useThree();

    // --- 1. โหลด Textures ---
    const logoUrl = '/assets/images/mama-logo.webp';
    const videoUrl = selectedFlavor?.videoPublicId || '';

    const logoTexture = useTexture(logoUrl);
    const videoTexture = useVideoTexture(videoUrl, {
        muted: true, loop: true, start: true, crossOrigin: "anonymous",
    });

    // --- 2. คำนวณขนาดและตำแหน่ง ---
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

    const videoAspectRatio =
        videoTexture.image && videoTexture.image.videoHeight > 0
            ? videoTexture.image.videoWidth / videoTexture.image.videoHeight
            : 16 / 9;
    const containerHeight = containerWidth / videoAspectRatio;

    const containerX = 0;
    const topMarginInWorld = (topMarginInRem * remToPx) * pxToWorldRatio;
    const containerY = (viewport.height / 2) - topMarginInWorld - (containerHeight / 2);

    // --- [Shader] คำนวณรัศมีความโค้ง ---
    // รัศมีในหน่วย UV (0 ถึง 1) จะให้ผลลัพธ์ที่คงที่กว่า
    // 0.05 คือ 5% ของด้านที่สั้นที่สุด จะทำให้มุมโค้งสวยงาม
    const cornerRadius = 0.05;

    const logoWidth = logoWidthInPx * pxToWorldRatio;
    // [แก้ไข] คำนวณ Aspect Ratio ที่แท้จริงของโลโก้
    // โดยอ่านจาก naturalWidth/naturalHeight ของ image ที่โหลดมาแล้ว
    const logoAspectRatio =
        logoTexture.image && logoTexture.image.naturalHeight > 0
            ? logoTexture.image.naturalWidth / logoTexture.image.naturalHeight
            : 1; // ถ้ายังโหลดไม่เสร็จ ให้ใช้ 1:1 ไปก่อนชั่วคราว

    // [แก้ไข] คำนวณความสูงจาก Aspect Ratio ที่ถูกต้อง แทนที่จะสมมติว่าเป็นสี่เหลี่ยมจัตุรัส
    const logoHeight = logoWidth / logoAspectRatio;

    const logoMargin = logoMarginInPx * pxToWorldRatio;
    const logoX = -containerWidth / 2 + logoMargin + (logoWidth / 2);
    const logoY = containerHeight / 2 - logoMargin - (logoHeight / 2);

    // --- [หัวใจหลัก] สร้าง Shader Material ---
    const roundedVideoMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                // ส่งค่าต่างๆ ที่จำเป็นเข้าไปใน shader
                uMap: { value: videoTexture },
                uRadius: { value: cornerRadius },
                uAspect: { value: containerWidth / containerHeight },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uMap;
                uniform float uRadius;
                uniform float uAspect;
                varying vec2 vUv;

                // ฟังก์ชันคำนวณ Signed Distance Function (SDF) ของสี่เหลี่ยมขอบมน
                float sdRoundedBox(vec2 p, vec2 b, float r) {
                    vec2 q = abs(p) - b + r;
                    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
                }

                void main() {
                    // ปรับ UV ให้อยู่กึ่งกลางที่ (0,0) และปรับตาม aspect ratio
                    vec2 centeredUv = (vUv - 0.5) * vec2(uAspect, 1.0);
                    vec2 boxSize = vec2(uAspect, 1.0) * 0.5; // ขนาดครึ่งนึงของกล่อง

                    // คำนวณระยะห่าง
                    float d = sdRoundedBox(centeredUv, boxSize, uRadius);

                    // ดึงสีจากวิดีโอ
                    vec4 texColor = texture2D(uMap, vUv);

                    // ใช้ smoothstep เพื่อให้ขอบเรียบเนียน ไม่เป็นรอยหยัก
                    // ถ้า d > 0 (อยู่นอก) alpha จะเป็น 0 (โปร่งใส)
                    // ถ้า d < 0 (อยู่ข้างใน) alpha จะเป็น 1 (ทึบแสง)
                    float alpha = 1.0 - smoothstep(0.0, 0.005, d);

                    // สีสุดท้ายคือสีจากวิดีโอ แต่ใช้ alpha ที่เราคำนวณได้
                    // และคูณกับ alpha เดิมของ texture เผื่อวิดีโอมีส่วนโปร่งใส
                    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
                }
            `,
            transparent: true, // เปิดใช้งานความโปร่งใส
        });
    }, [videoTexture, cornerRadius, containerWidth, containerHeight]);

    return (
        <group position={[containerX, containerY, -0.1]}>
            {/* [แก้ไข] กลับมาใช้ PlaneGeometry แต่ใส่ material ที่เป็น shader ของเราแทน */}
            <mesh>
                <planeGeometry args={[containerWidth, containerHeight]} />
                <primitive object={roundedVideoMaterial} />
            </mesh>

            {/* โลโก้ยังคงเหมือนเดิม เพราะเป็นสี่เหลี่ยมธรรมดาและต้องการสีสด */}
            <mesh position={[logoX, logoY, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
            </mesh>
        </group>
    );
}
// Component 3D สำหรับโมเดลทั้งหมด (เวอร์ชันรวมและปรับพฤติกรรม)
// ====================================================================
function FaceAnchor({ landmarksRef, modelUrls }) {
    // [แก้ไข] สร้าง Ref สำหรับแต่ละ Group เพื่อควบคุมแยกกัน
    const groupRef = useRef(); // Group สำหรับชามและ prop ที่เคลื่อนที่ตามคาง
    const chopstickGroupRef = useRef(); // Group สำหรับตะเกียบที่ตำแหน่งคงที่

    const { camera, viewport } = useThree();

    // --- 1. โหลดโมเดลทั้งหมด ---
    const { scene: bowlModel } = useGLTF(modelUrls.bowl);
    const { scene: propModel, animations: propAnims } = useGLTF(modelUrls.prop);
    // [แก้ไข] โหลดตะเกียบและอนิเมชันของมันที่นี่
    const { scene: chopstickModel, animations: chopstickAnims } = useGLTF(modelUrls.chopstick);

    // --- 2. ตั้งค่า Animation Mixer แยกกันสำหรับแต่ละโมเดลที่มีอนิเมชัน ---
    const propMixer = useMemo(() => new THREE.AnimationMixer(propModel), [propModel]);
    const propActions = useMemo(() => {
        if (propAnims && propAnims.length > 0) {
            const action = propMixer.clipAction(propAnims[0]);
            action.play();
            action.paused = true;
            return { main: action };
        }
        return { main: null };
    }, [propAnims, propMixer]);

    const chopstickMixer = useMemo(() => new THREE.AnimationMixer(chopstickModel), [chopstickModel]);
    const chopstickActions = useMemo(() => {
        if (chopstickAnims && chopstickAnims.length > 0) {
            const action = chopstickMixer.clipAction(chopstickAnims[0]);
            action.play();
            action.paused = true;
            return { main: action };
        }
        return { main: null };
    }, [chopstickAnims, chopstickMixer]);

    const lastMouthState = useRef("Close");

    // 3. ตั้งค่าเริ่มต้นให้ propModel มองไม่เห็น
    useEffect(() => {
        propModel.visible = false;
    }, [propModel]);


    useFrame((state, delta) => {
        const landmarks = landmarksRef.current;
        if (!landmarks || !groupRef.current || !chopstickGroupRef.current) {
            if (groupRef.current) groupRef.current.visible = false;
            if (chopstickGroupRef.current) chopstickGroupRef.current.visible = false;
            return;
        }

        // เมื่อเจอใบหน้า ให้แสดงผลทั้งสอง Group
        groupRef.current.visible = true;
        chopstickGroupRef.current.visible = true;

        // --- ส่วนที่ 1: ควบคุม Group ที่ตามคาง (ชาม, prop) ---
        const anchorPoint = landmarks[152];
        if (anchorPoint) {
            const target = new THREE.Vector3();
            const screenX = (-anchorPoint.x + 0.5) * 2;
            const screenY = -(anchorPoint.y - 0.5) * 2;
            state.raycaster.setFromCamera({ x: screenX, y: screenY }, camera);
            state.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), target);
            groupRef.current.position.lerp(target, 0.5);
        }

        // --- ส่วนที่ 2: คำนวณการหมุนของใบหน้า (ใช้ร่วมกัน) ---
        const forehead = new THREE.Vector3(landmarks[10].x, landmarks[10].y, landmarks[10].z);
        const chin = new THREE.Vector3(landmarks[152].x, landmarks[152].y, landmarks[152].z);
        const leftCheek = new THREE.Vector3(landmarks[234].x, landmarks[234].y, landmarks[234].z);
        const rightCheek = new THREE.Vector3(landmarks[454].x, landmarks[454].y, landmarks[454].z);
        const yAxis = new THREE.Vector3().subVectors(forehead, chin).normalize();
        const xAxis = new THREE.Vector3().subVectors(rightCheek, leftCheek).normalize();
        const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
        const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
        const faceQuaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

        // หมุน Group ที่ตามคางแบบ 100%
        groupRef.current.quaternion.slerp(faceQuaternion, 0.5);

        // --- ส่วนที่ 3: ตรวจจับการอ้าปากและควบคุมอนิเมชันแยกกัน ---
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        if (upperLip && lowerLip) {
            const mouthOpening = Math.abs(lowerLip.y - upperLip.y) * 1000;
            const MOUTH_OPEN_THRESHOLD = 15;
            const currentMouthState = mouthOpening > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";

            if (currentMouthState !== lastMouthState.current) {
                lastMouthState.current = currentMouthState;
                const isMouthOpen = currentMouthState === "Open";

                // ควบคุม prop ที่ปาก (ทั้งการมองเห็นและอนิเมชัน)
                if (propActions.main) {
                    propModel.visible = isMouthOpen;
                    propActions.main.paused = !isMouthOpen;
                }
                // ควบคุมตะเกียบ (เฉพาะอนิเมชัน)
                if (chopstickActions.main) {
                    chopstickActions.main.paused = !isMouthOpen;
                }
            }
        }

        // อัปเดต Mixer ทั้งสองตัว
        if (propMixer) propMixer.update(delta);
        if (chopstickMixer) chopstickMixer.update(delta);
    });

    // คำนวณตำแหน่งและขนาดคงที่ของตะเกียบ
    const chopstickScale = 1;

    // [แก้ไข] JSX return สอง Group ที่อยู่เคียงกันโดยใช้ Fragment (<>)
    return (
        <>
            {/* Group ที่ 1: สำหรับชามและ prop ที่เคลื่อนที่และหมุนตามคาง */}
            <group ref={groupRef} visible={false}>
                <primitive object={bowlModel.clone()} rotation={[Math.PI / 1, 0, 0]} scale={1.35} position={[0, 2.2, 0]} />
                <primitive object={propModel} rotation={[Math.PI / 1, 0, 0]} scale={1.35} position={[0, 2.2, 0]} />
            </group>

            {/* Group ที่ 2: สำหรับตะเกียบที่มีตำแหน่งคงที่ แต่หมุนเล็กน้อย */}
            <group ref={chopstickGroupRef} position={[0, -2.5, 0]} scale={chopstickScale} visible={false}>
                <primitive object={chopstickModel} />
            </group>
        </>
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

    // *** เพิ่ม State สำหรับจัดการสถานะ MediaPipe ***
    const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);

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

    // **[แก้ไข 3]** ทำให้ useEffect ทำงานใหม่เมื่อ cameraFacingMode เปลี่ยน
    useEffect(() => {
        const videoElement = videoRef.current;
        // *** Guard Clause: รอให้ MediaPipe พร้อมก่อน ***
        if (!videoElement || !isMediaPipeReady) return;

        // 1. ดึง FaceMesh instance ที่ initialize ไว้แล้วจาก service
        const faceMesh = mediaPipeService.getInstance();
        if (!faceMesh) {
            console.error("ARSuperDebug: Attempted to run without a ready FaceMesh instance.");
            return;
        }

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
            console.log("Cleaning up camera and FaceMesh listener for ARSuperDebug.");
            camera?.stop();
            // **สำคัญ:** เราไม่เรียก faceMesh.close() ที่นี่แล้ว
            // เพราะ instance จะถูกใช้ซ้ำ เราแค่ "ยกเลิกการฟัง" onResults ก็พอ
            // โดยการตั้งค่าเป็น callback ว่างๆ
            if (faceMesh) {
                faceMesh.onResults(() => { });
            }
        };

    }, [cameraFacingMode, isMediaPipeReady]); // <-- เพิ่ม cameraFacingMode ใน dependency array

    // *** Effect ใหม่: สำหรับเช็คว่า MediaPipe พร้อมหรือยัง ***
    useEffect(() => {
        // ลองดึง instance ดู ถ้าได้แสดงว่าพร้อมแล้ว
        const instance = mediaPipeService.getInstance();
        if (instance) {
            setIsMediaPipeReady(true);
        } else {
            // กรณีฉุกเฉิน: ถ้าเข้ามาหน้านี้แล้วยังไม่พร้อม ให้ลอง initialize อีกที
            mediaPipeService.initialize().then(() => {
                setIsMediaPipeReady(true);
            });
        }
    }, []);

    return (
        <div className="super-debug-container">
            <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: 'none' }} />
            {isMediaPipeReady && (
                <>
                    <canvas ref={canvas2DRef} className="output_canvas_debug" />

                    <Canvas className="ar-canvas-3d-debug"
                        onCreated={(state) => { glRef.current = state.gl; }}
                        gl={{ preserveDrawingBuffer: true }}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[0, 5, 5]} intensity={1.8} />
                        <Suspense fallback={null}>
                            {/* [แก้ไข] เรียกใช้แค่ FaceAnchor ตัวเดียว */}
                            <FaceAnchor
                                landmarksRef={landmarksRef} modelUrls={modelUrls}
                            />
                            <HeadsUpDisplay selectedFlavor={selectedFlavor} />
                            <Preload all />
                        </Suspense>
                    </Canvas>
                </>
            )}
        </div>
    );
});

export default ARSuperDebug;