import React, { useState, useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import './MouthDebug.css'; // เราจะใช้ CSS เดิม

let faceLandmarker = null;
let lastVideoTime = -1;
let animationFrameId = null;

const VisionTaskDebug = () => {
    const videoRef = useRef(null);
    const [mouthOpenScore, setMouthOpenScore] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // useEffect สำหรับโหลดโมเดลและเปิดกล้อง
    useEffect(() => {
        let stream = null;
        let videoElement = null;

        const setup = async () => {
            try {
                // 1. โหลดโมเดล
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true, // ** ร้องขอ Blendshapes อย่างชัดเจน **
                    runningMode: 'VIDEO',
                    numFaces: 1
                });
                console.log("Vision Tasks Model Loaded.");

                // 2. เปิดกล้อง
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                videoElement = videoRef.current;
                videoElement.srcObject = stream;

                // 3. รอให้วิดีโอพร้อม แล้วเริ่ม Loop
                videoElement.addEventListener("loadeddata", predictWebcam);

            } catch (error) {
                console.error("Setup failed:", error);
            }
        };

        const predictWebcam = () => {
            const startTimeMs = performance.now();
            if (videoElement.currentTime !== lastVideoTime) {
                lastVideoTime = videoElement.currentTime;
                // ประมวลผลและรับผลลัพธ์
                const results = faceLandmarker.detectForVideo(videoElement, startTimeMs);

                // ดึงค่า Blendshapes
                const blendshapes = results.faceBlendshapes?.[0]?.categories;
                if (blendshapes) {
                    const mouthOpen = blendshapes.find(shape => shape.categoryName === 'mouthOpen');
                    if (mouthOpen) {
                        setMouthOpenScore(mouthOpen.score);
                    }
                }
            }
            animationFrameId = window.requestAnimationFrame(predictWebcam);
        };

        setup();

        // Cleanup
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
            if (videoElement) {
                videoElement.removeEventListener("loadeddata", predictWebcam);
            }
        };
    }, []);

    // Logic การแสดงผลเหมือนเดิม
    const MOUTH_OPEN_THRESHOLD = 0.4;
    const mouthState = mouthOpenScore > MOUTH_OPEN_THRESHOLD ? "Open" : "Close";

    return (
        <div className="mouth-debug-container">
            <video
                ref={videoRef}
                className="debug-video-feed"
                autoPlay
                playsInline
                onCanPlay={() => setIsReady(true)} // เมื่อวิดีโอพร้อมเล่น ให้แสดง UI
            />
            {isReady && (
                <div className="debug-overlay">
                    <div className="debug-value-box">
                        <span className="debug-label">Mouth Open Score:</span>
                        <span className="debug-score">{mouthOpenScore.toFixed(3)}</span>
                    </div>
                    <div className="debug-state-box" style={{ backgroundColor: mouthState === 'Open' ? '#4CAF50' : '#F44336' }}>
                        {mouthState}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisionTaskDebug;