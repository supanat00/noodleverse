import React, { useState, useRef, useCallback, useEffect } from 'react';
import './CameraUI.css';

import PreviewModal from '../PreviewModal/PreviewModal';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// --- Assets & Icons ---
import iconSwitchCamera from '/assets/icons/switch-camera.webp';

const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3c-.92.87-2.44.87-5.5.87h-7c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;


const CameraUI = ({ arSystemRef, cameraFacingMode, onSwitchCamera }) => {

    // --- State Management ---
    const [mode, setMode] = useState('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [preview, setPreview] = useState(null);

    // --- Refs ---
    const animationFrameIdRef = useRef(null);

    // Refs for mp4-muxer
    const muxerRef = useRef(null);
    const videoEncoderRef = useRef(null);
    const audioEncoderRef = useRef(null);
    const isRecordingRef = useRef(false); // ใช้ ref เพื่อเช็คสถานะใน rAF loop

    /**
     * ถ่ายภาพนิ่งโดยการรวมภาพจาก camera (background) และ AR (foreground)
     */
    const handleTakePhoto = useCallback(() => {
        console.log("ACTION: Take Photo");

        const arCanvas = arSystemRef.current?.arCanvas;
        const cameraCanvas = arSystemRef.current?.cameraCanvas;

        if (!arCanvas || !cameraCanvas) {
            console.error("Canvas refs not available for capture.");
            alert("เกิดข้อผิดพลาด: ไม่สามารถถ่ายภาพได้");
            return;
        }

        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        const isLandscape = window.innerWidth > window.innerHeight;
        finalCanvas.width = isLandscape ? 1280 : 720;
        finalCanvas.height = isLandscape ? 720 : 1280;

        requestAnimationFrame(() => {
            // วาด BG: Camera (กลับด้านเหมือนกระจก)
            if (cameraCanvas) {
                ctx.save();
                ctx.translate(finalCanvas.width, 0);
                ctx.scale(-1, 1);

                const sW = cameraCanvas.width;
                const sH = cameraCanvas.height;
                const sR = sW / sH;
                const tR = finalCanvas.width / finalCanvas.height;
                let dW, dH, oX, oY;
                if (sR > tR) {
                    dH = finalCanvas.height;
                    dW = dH * sR;
                } else {
                    dW = finalCanvas.width;
                    dH = dW / sR;
                }
                oX = (finalCanvas.width - dW) / 2;
                oY = (finalCanvas.height - dH) / 2;

                ctx.drawImage(cameraCanvas, oX, oY, dW, dH);
                ctx.restore();
            }

            // วาด FG: AR Scene
            ctx.drawImage(arCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

            // ใช้ Data URL สำหรับภาพนิ่ง มันง่ายและเร็วพอ
            const dataURL = finalCanvas.toDataURL('image/png', 0.9); // Quality 90%
            setPreview({ type: 'image', src: dataURL });
        });
    }, [arSystemRef]);

    // ✂️✂️✂️ เริ่มคัดลอกตั้งแต่ตรงนี้ ✂️✂️✂️

    // --- ฟังก์ชันอัดวิดีโอ (เขียนใหม่ทั้งหมดด้วย mp4-muxer) ---

    // ฟังก์ชันสำหรับ "เริ่ม" การอัดวิดีโอ
    const startRecording = useCallback(async () => {
        console.log("ACTION: Start Recording (mp4-muxer)");

        if (!('VideoEncoder' in window)) {
            alert("ขออภัย อุปกรณ์ของคุณไม่รองรับการอัดวิดีโอ (VideoEncoder API is not available)");
            setIsRecording(false);
            isRecordingRef.current = false;
            return;
        }

        const arCanvas = arSystemRef.current?.arCanvas;
        const cameraCanvas = arSystemRef.current?.cameraCanvas;
        if (!arCanvas || !cameraCanvas) {
            alert("เกิดข้อผิดพลาด: ไม่สามารถเริ่มอัดวิดีโอได้");
            setIsRecording(false);
            isRecordingRef.current = false;
            return;
        }

        const isLandscape = window.innerWidth > window.innerHeight;
        const videoWidth = isLandscape ? 1280 : 720;
        const videoHeight = isLandscape ? 720 : 1280;
        const frameRate = 30;

        // 1. Setup Muxer: ตัวประกอบร่างไฟล์ MP4
        muxerRef.current = new Muxer({
            target: new ArrayBufferTarget(),
            video: {
                codec: 'avc',
                width: videoWidth,
                height: videoHeight,
            },
            audio: {
                codec: 'aac',
                sampleRate: 44100,
                numberOfChannels: 1,
            },
            // [FIX] ใช้ 'in-memory' ซึ่งเป็นค่าที่ถูกต้องสำหรับ fastStart
            fastStart: 'in-memory',
        });

        // 2. Setup VideoEncoder
        videoEncoderRef.current = new VideoEncoder({
            output: (chunk, meta) => muxerRef.current.addVideoChunk(chunk, meta),
            error: (e) => console.error('VideoEncoder error:', e),
        });
        await videoEncoderRef.current.configure({
            codec: 'avc1.42001f',
            width: videoWidth,
            height: videoHeight,
            framerate: frameRate,
            bitrate: 3_000_000, // 3 Mbps
        });

        // 3. Setup AudioEncoder สำหรับ Silent Track
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioEncoderRef.current = new AudioEncoder({
            output: (chunk, meta) => muxerRef.current.addAudioChunk(chunk, meta),
            error: (e) => console.error('AudioEncoder error:', e),
        });
        await audioEncoderRef.current.configure({
            codec: 'mp4a.40.2',
            sampleRate: audioContext.sampleRate,
            numberOfChannels: 1,
            bitrate: 96000,
        });

        const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
        const audioData = new AudioData({
            timestamp: 0,
            data: audioBuffer.getChannelData(0),
            numberOfFrames: audioBuffer.length,
            numberOfChannels: 1,
            sampleRate: audioContext.sampleRate,
            format: 'f32-planar'
        });
        audioEncoderRef.current.encode(audioData);
        audioData.close();

        // 4. เริ่ม Loop การวาดและ Encode
        let frameCounter = 0;
        const recordingCanvas = document.createElement('canvas');
        recordingCanvas.width = videoWidth;
        recordingCanvas.height = videoHeight;
        const ctx = recordingCanvas.getContext('2d');

        const processFrame = () => {
            if (!isRecordingRef.current) return;

            // วาด BG (Camera) และ FG (AR)
            if (cameraCanvas) {
                ctx.save();
                ctx.translate(videoWidth, 0);
                ctx.scale(-1, 1);
                const sW = cameraCanvas.width, sH = cameraCanvas.height;
                const sR = sW / sH;
                const tR = videoWidth / videoHeight;
                let dW, dH;
                if (sR > tR) { dH = videoHeight; dW = dH * sR; }
                else { dW = videoWidth; dH = dW / sR; }
                const oX = (videoWidth - dW) / 2, oY = (videoHeight - dH) / 2;
                ctx.drawImage(cameraCanvas, oX, oY, dW, dH);
                ctx.restore();
            }
            ctx.drawImage(arCanvas, 0, 0, videoWidth, videoHeight);

            // ส่ง Frame ไป Encode
            if (videoEncoderRef.current?.state === 'configured') {
                const timestamp = (frameCounter * 1_000_000) / frameRate;
                const videoFrame = new VideoFrame(recordingCanvas, { timestamp });
                videoEncoderRef.current.encode(videoFrame, { keyFrame: frameCounter % frameRate === 0 });
                videoFrame.close();
                frameCounter++;
            }

            animationFrameIdRef.current = requestAnimationFrame(processFrame);
        };
        requestAnimationFrame(processFrame);
    }, [arSystemRef]);


    // ฟังก์ชันสำหรับ "หยุด" การอัดวิดีโอ
    const stopRecording = useCallback(async () => {
        console.log("ACTION: Stop Recording (mp4-muxer)");
        isRecordingRef.current = false; // สั่งให้ loop การวาดหยุด

        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }

        // รอให้ Encoder ทำงานที่ค้างอยู่ให้เสร็จ
        if (videoEncoderRef.current?.state === 'configured') {
            await videoEncoderRef.current.flush().catch(e => console.error("Video flush error", e));
        }
        if (audioEncoderRef.current?.state === 'configured') {
            await audioEncoderRef.current.flush().catch(e => console.error("Audio flush error", e));
        }

        // ปิด Muxer เพื่อเขียน Metadata (สำคัญที่สุด)
        if (muxerRef.current) {
            muxerRef.current.finalize();
            const { buffer } = muxerRef.current.target;
            const videoBlob = new Blob([buffer], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);
            setPreview({ type: 'video', src: videoUrl });
        }

        // Cleanup
        videoEncoderRef.current = null;
        audioEncoderRef.current = null;
        muxerRef.current = null;
    }, []);


    // ฟังก์ชันหลักที่ถูกเรียกโดยปุ่ม ซึ่งจะทำหน้าที่แค่สลับ State และเรียกฟังก์ชันที่ถูกต้อง
    const handleToggleRecording = useCallback(() => {
        // ใช้ Functional Update เพื่อความปลอดภัยในการอ่าน state ล่าสุด
        setIsRecording(prevIsRecording => {
            const nextIsRecording = !prevIsRecording;
            isRecordingRef.current = nextIsRecording; // อัปเดต ref ไปพร้อมกัน

            if (nextIsRecording) {
                startRecording();
            } else {
                stopRecording();
            }

            return nextIsRecording; // คืนค่า state ใหม่
        });
    }, [startRecording, stopRecording]);

    // ✂️✂️✂️ สิ้นสุดการคัดลอกตรงนี้ ✂️✂️✂️
    // --- Utility Functions ---
    const handleSwitchCamera = useCallback(() => onSwitchCamera(cameraFacingMode === 'user' ? 'environment' : 'user'), [cameraFacingMode, onSwitchCamera]);
    const handleModeChange = useCallback((e) => setMode(e.target.checked ? 'video' : 'photo'), []);

    // --- Preview Action Handlers ---
    const handleRetry = useCallback(() => setPreview(null), []);
    const handleDownload = useCallback(() => {
        if (!preview?.src) return;
        const a = document.createElement('a');
        a.href = preview.src;
        a.download = preview.type === 'video' ? 'mama-noodleverse.mp4' : 'mama-noodleverse.png';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [preview]);

    const handleShare = useCallback(async () => {
        if (!preview?.src) return;
        try {
            const response = await fetch(preview.src);
            const blob = await response.blob();
            const fileType = preview.type === 'video' ? 'video/mp4' : 'image/png';
            const file = new File([blob], `mama-noodleverse.${fileType.split('/')[1]}`, { type: fileType });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'MAMA Noodle Verse',
                    text: 'มาเล่น AR สนุกๆ กับ MAMA กัน!',
                });
            } else {
                alert("ฟังก์ชันแชร์ไม่สามารถใช้งานได้บนเบราว์เซอร์นี้");
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Share error:", error);
                alert(`การแชร์ล้มเหลว: ${error.message}`);
            }
        }
    }, [preview]);

    // --- Cleanup Effect ---
    useEffect(() => {
        const currentPreviewSrc = preview?.src;
        const isVideo = preview?.type === 'video';
        return () => {
            if (isVideo && currentPreviewSrc && currentPreviewSrc.startsWith('blob:')) {
                URL.revokeObjectURL(currentPreviewSrc);
            }
        };
    }, [preview]);

    useEffect(() => {
        // Cleanup ตอน unmount เผื่อกรณีกดปิดแอปไปเลย
        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            if (isRecordingRef.current) {
                videoEncoderRef.current?.close();
                audioEncoderRef.current?.close();
            }
        };
    }, []);

    return (
        <div className="ui-overlay">
            <div className={`camera-controls ${preview ? 'hidden' : ''}`}>
                <button className="action-button side-button-left" onClick={handleSwitchCamera} aria-label="Switch Camera">
                    <img src={iconSwitchCamera} alt="Switch Camera" className={`action-icon ${cameraFacingMode !== 'user' ? 'flipping' : ''}`} />
                </button>

                {mode === 'photo' ? (
                    <div className="photo-button" onClick={handleTakePhoto} aria-label="Take Photo">
                        <div className="circle"></div>
                    </div>
                ) : (
                    <div className={`record-button ${isRecording ? 'recording' : ''}`} onClick={handleToggleRecording} aria-label="Toggle Recording">
                        <div className="ring" key={String(isRecording)}>
                            <svg viewBox="0 0 32 32">
                                <circle className="progress-ring" r="15" cx="16" cy="16" fill="transparent" transform="rotate(-90 16 16)" stroke="#FFFFFF" />
                            </svg>
                        </div>
                        <div className="inner-shape"></div>
                    </div>
                )}

                <div className="switch-button">
                    <label>
                        <span className="camera"><CameraIcon /></span>
                        <span className="video"><VideoIcon /></span>
                        <input type="checkbox" className="input" onChange={handleModeChange} checked={mode === 'video'} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {preview && (
                <PreviewModal
                    preview={preview}
                    onRetry={handleRetry}
                    onSave={handleDownload}
                    onShare={handleShare}
                />
            )}
        </div>
    );
};

export default React.memo(CameraUI);