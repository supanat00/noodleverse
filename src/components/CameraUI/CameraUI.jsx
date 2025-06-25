import React, { useState, useRef, useCallback, useEffect } from 'react';
import './CameraUI.css';

import PreviewModal from '../PreviewModal/PreviewModal';

// --- Assets & Icons ---
import iconSwitchCamera from '/assets/icons/switch-camera.webp';

const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3c-.92.87-2.44.87-5.5.87h-7c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const CameraUI = ({ arSystemRef, cameraFacingMode, onSwitchCamera }) => {
    const [mode, setMode] = useState('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState(null);

    const animationFrameIdRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const audioTrackRef = useRef(null);
    const recordTimerRef = useRef(null);

    // ตรวจสอบว่า Browser รองรับการอัดวิดีโอหรือไม่
    const isVideoRecordingSupported = 'MediaRecorder' in window && typeof MediaRecorder.isTypeSupported === 'function';

    const handleTakePhoto = useCallback(() => {
        console.log("ACTION: Take Photo (Fit Height, Center Horizontally)");
        const arCanvas = arSystemRef.current?.arCanvas;
        const cameraCanvas = arSystemRef.current?.cameraCanvas;

        if (!arCanvas || !cameraCanvas) {
            alert("เกิดข้อผิดพลาด: ไม่สามารถถ่ายภาพได้");
            return;
        }

        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');

        const outputWidth = 1080;
        const outputHeight = 1920;
        finalCanvas.width = outputWidth;
        finalCanvas.height = outputHeight;

        requestAnimationFrame(() => {
            // --- 1. วาด BG (ภาพจากกล้อง) ให้เต็มพื้นที่ 9:16 ก่อน (เหมือนเดิม) ---
            const cameraAspectRatio = cameraCanvas.width / cameraCanvas.height;
            let bgWidth = outputWidth;
            let bgHeight = bgWidth / cameraAspectRatio;
            if (bgHeight < outputHeight) {
                bgHeight = outputHeight;
                bgWidth = bgHeight * cameraAspectRatio;
            }
            const bgX = (outputWidth - bgWidth) / 2;
            const bgY = (outputHeight - bgHeight) / 2;
            ctx.save();
            ctx.translate(finalCanvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(cameraCanvas, bgX, bgY, bgWidth, bgHeight);
            ctx.restore();

            // --- ✨ 2. [FIX] วาด AR Scene โดยยึด "ความสูง" เป็นหลัก ✨ ---
            const arAspectRatio = arCanvas.width / arCanvas.height;

            // คำนวณขนาดใหม่ของ arCanvas ที่จะวาดลงไป โดยยึด "ความสูง" เป็นหลัก
            const drawHeight = outputHeight; // กำหนดให้ความสูงเต็ม 1920px
            const drawWidth = drawHeight * arAspectRatio; // คำนวณความกว้างตามสัดส่วนเดิม

            // คำนวณตำแหน่งในแนวนอน เพื่อให้ภาพอยู่กึ่งกลาง
            const drawX = (outputWidth - drawWidth) / 2;

            // วาด arCanvas ลงไปตรงกลาง โดยมีขนาดที่ถูกต้อง ไม่ล้นในแนวตั้ง
            ctx.drawImage(arCanvas, drawX, 0, drawWidth, drawHeight);

            // --- 3. สร้าง Data URL ---
            const dataURL = finalCanvas.toDataURL('image/png', 0.9);
            setPreview({ type: 'image', src: dataURL });
        });
    }, [arSystemRef]);

    // --- ฟังก์ชัน startRecording ---
    const startRecording = useCallback(async () => {
        if (!isVideoRecordingSupported) {
            alert("ขออภัย อุปกรณ์ของคุณไม่รองรับการอัดวิดีโอ");
            return false;
        }
        try {
            const arCanvas = arSystemRef.current?.arCanvas;
            const cameraCanvas = arSystemRef.current?.cameraCanvas;
            if (!arCanvas || !cameraCanvas) {
                alert("เกิดข้อผิดพลาด: ไม่สามารถเริ่มอัดวิดีโอได้");
                return false;
            }
            const videoWidth = 720;
            const videoHeight = 1280;
            const recordingCanvas = document.createElement('canvas');
            recordingCanvas.width = videoWidth;
            recordingCanvas.height = videoHeight;
            const ctx = recordingCanvas.getContext('2d');
            const videoStream = recordingCanvas.captureStream(30);
            let audioStream = null;
            let audioTrack = null;
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                audioTrack = audioStream.getAudioTracks()[0];
                audioTrackRef.current = audioTrack;
            } catch (audioError) {
                console.warn("Audio permission denied or not available, recording without audio:", audioError);
            }
            const streamTracks = [...videoStream.getVideoTracks()];
            if (audioTrack) streamTracks.push(audioTrack);
            const combinedStream = new MediaStream(streamTracks);
            const mimeTypes = [
                'video/mp4',
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm',
                'video/ogg;codecs=theora,vorbis'
            ];
            let selectedMimeType = null;
            for (const mimeType of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mimeType)) {
                    selectedMimeType = mimeType;
                    break;
                }
            }
            const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
            mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
            recordedChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onerror = () => {
                alert("เกิดข้อผิดพลาดในการอัดวิดีโอ กรุณาลองใหม่อีกครั้ง");
                if (audioTrackRef.current) {
                    audioTrackRef.current.stop();
                    audioTrackRef.current = null;
                }
                setIsRecording(false);
                setIsProcessing(false);
            };
            // --- onstop: แสดงข้อความประมวลผล, ปิดปุ่ม, แสดง preview ---
            mediaRecorderRef.current.onstop = () => {
                console.log("MediaRecorder onstop called");
                setIsProcessing(true);
                try {
                    const mimeType = mediaRecorderRef.current?.mimeType || selectedMimeType || 'video/mp4';
                    const videoBlob = new Blob(recordedChunksRef.current, { type: mimeType });
                    console.log('videoBlob size:', videoBlob.size);
                    if (videoBlob.size === 0) {
                        alert("Recorded video is empty");
                        return;
                    }
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setPreview({ type: 'video', src: videoUrl, mimeType: mimeType });
                    console.log('setPreview called', { type: 'video', src: videoUrl, mimeType: mimeType });
                } catch { /* ignore */ } finally {
                    recordedChunksRef.current = [];
                    mediaRecorderRef.current = null;
                    if (audioTrackRef.current) {
                        audioTrackRef.current.stop();
                        audioTrackRef.current = null;
                    }
                    setIsProcessing(false);
                }
            };
            mediaRecorderRef.current.start();
            const processFrame = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
                try {
                    const cameraAspectRatio = cameraCanvas.width / cameraCanvas.height;
                    let bgWidth = videoWidth;
                    let bgHeight = bgWidth / cameraAspectRatio;
                    if (bgHeight < videoHeight) {
                        bgHeight = videoHeight;
                        bgWidth = bgHeight * cameraAspectRatio;
                    }
                    const bgX = (videoWidth - bgWidth) / 2;
                    const bgY = (videoHeight - bgHeight) / 2;
                    ctx.save();
                    if (cameraFacingMode === 'user') {
                        ctx.translate(videoWidth, 0);
                        ctx.scale(-1, 1);
                    }
                    ctx.drawImage(cameraCanvas, bgX, bgY, bgWidth, bgHeight);
                    ctx.restore();
                    const arAspectRatio = arCanvas.width / arCanvas.height;
                    const drawHeight = videoHeight;
                    const drawWidth = drawHeight * arAspectRatio;
                    const drawX = (videoWidth - drawWidth) / 2;
                    ctx.drawImage(arCanvas, drawX, 0, drawWidth, drawHeight);
                } catch { /* ignore */ }
                animationFrameIdRef.current = requestAnimationFrame(processFrame);
            };
            requestAnimationFrame(processFrame);
            return true;
        } catch { /* ignore */ }
    }, [arSystemRef, cameraFacingMode, isVideoRecordingSupported]);

    // --- stopRecording ---
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        clearTimeout(recordTimerRef.current);
        cancelAnimationFrame(animationFrameIdRef.current);
    }, []);

    // --- handleToggleRecording ---
    const handleToggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
        } else {
            startRecording().then(success => {
                if (success) {
                    setIsRecording(true);
                    recordTimerRef.current = setTimeout(() => {
                        stopRecording();
                        setIsRecording(false);
                    }, 30000);
                }
            });
        }
    }, [isRecording, startRecording, stopRecording]);

    // --- Utility Functions ---
    const handleSwitchCamera = useCallback(() => onSwitchCamera(cameraFacingMode === 'user' ? 'environment' : 'user'), [cameraFacingMode, onSwitchCamera]);
    const handleModeChange = useCallback((e) => setMode(e.target.checked ? 'video' : 'photo'), []);
    const handleRetry = useCallback(() => setPreview(null), []);
    const handleDownload = useCallback(() => {
        if (!preview?.src) return;
        const a = document.createElement('a');
        a.href = preview.src;
        const extension = (preview.mimeType?.includes('mp4')) ? 'mp4' : 'webm';
        a.download = preview.type === 'video' ? `mama-noodleverse.${extension}` : 'mama-noodleverse.png';
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
                alert(`การแชร์ล้มเหลว: ${error.message}`);
            }
        }
    }, [preview]);
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
        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (audioTrackRef.current) {
                audioTrackRef.current.stop();
            }
        };
    }, []);

    // --- UI ---
    return (
        <div className="ui-overlay">
            {/* แสดง overlay ขณะประมวลผล */}
            {isProcessing && (
                <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>กำลังประมวลผล...</p>
                </div>
            )}
            <div className={`camera-controls ${(preview || isRecording || isProcessing) ? 'hidden' : ''}`}>
                <button className="action-button side-button-left" onClick={handleSwitchCamera} aria-label="Switch Camera" disabled={isRecording || isProcessing}>
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
                        <input type="checkbox" className="input" onChange={handleModeChange} checked={mode === 'video'} disabled={isRecording || isProcessing} />
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