import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './CameraUI.css';

import PreviewModal from '../PreviewModal/PreviewModal';
import { getVideoMimeTypes, detectBrowserAndPlatform } from '../../utils/deviceUtils';
import { testVideoBlob } from '../../utils/browserTest';
import { createCorrectBlob, testVideoPlayability, convertVideoForDownload } from '../../utils/videoUtils';

// --- Assets & Icons ---
// import iconSwitchCamera from '/assets/icons/switch-camera.webp';

const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;


const CameraUI = ({ arSystemRef, cameraFacingMode }) => {

    const [mode, setMode] = useState('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState(null);

    // ✨ --- Refs ที่เปลี่ยนไปสำหรับ MediaRecorder --- ✨
    const animationFrameIdRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const audioTrackRef = useRef(null); // Ref สำหรับเก็บ Audio Track เพื่อใช้ในการ stop
    const recordTimerRef = useRef(null);

    // --- ตรวจสอบว่า Browser รองรับการอัดวิดีโอหรือไม่ ---
    const isVideoRecordingSupported = useMemo(() => 'MediaRecorder' in window && typeof MediaRecorder.isTypeSupported === 'function', []);

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

    // ✨ --- ฟังก์ชัน startRecording ที่เขียนขึ้นใหม่ทั้งหมด --- ✨

    const startRecording = useCallback(async () => {
        console.log("ACTION: Start Recording with MediaRecorder");

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

            // 1. สร้าง Canvas สำหรับอัดวิดีโอ (เหมือนเดิม)
            const videoWidth = 720;
            const videoHeight = 1280;
            const recordingCanvas = document.createElement('canvas');
            recordingCanvas.width = videoWidth;
            recordingCanvas.height = videoHeight;
            const ctx = recordingCanvas.getContext('2d');

            // 2. ขอ Stream จาก Canvas และขอ Stream เสียงจากผู้ใช้
            const videoStream = recordingCanvas.captureStream(30); // 30 FPS

            // Enhanced audio stream handling with iOS compatibility
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
                // Continue without audio - this is common on iOS
            }

            // 3. รวม Video Track และ Audio Track เข้าด้วยกัน
            const streamTracks = [...videoStream.getVideoTracks()];
            if (audioTrack) {
                streamTracks.push(audioTrack);
            }
            const combinedStream = new MediaStream(streamTracks);

            // 4. Enhanced MIME type detection for better cross-browser compatibility
            const mimeTypes = getVideoMimeTypes();
            const { isIOS, isSafari, isChrome } = detectBrowserAndPlatform();

            console.log(`Browser detection: iOS=${isIOS}, Safari=${isSafari}, Chrome=${isChrome}`);
            console.log(`Available MIME types:`, mimeTypes);

            let selectedMimeType = null;

            // ทดสอบ MIME types ที่รองรับ
            for (const mimeType of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mimeType)) {
                    selectedMimeType = mimeType;
                    console.log(`✅ Supported MIME type: ${mimeType}`);
                    break;
                } else {
                    console.log(`❌ Not supported: ${mimeType}`);
                }
            }

            if (!selectedMimeType) {
                console.warn("No supported MIME type found, using browser default");
                // ใช้ fallback MIME type ตาม browser
                if (isIOS || isSafari) {
                    selectedMimeType = 'video/mp4';
                } else if (isChrome) {
                    selectedMimeType = 'video/mp4';
                } else {
                    selectedMimeType = 'video/mp4';
                }
                console.log(`Using fallback MIME type: ${selectedMimeType}`);
            }

            const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
            console.log(`MediaRecorder options:`, options);

            // 5. สร้าง Instance ของ MediaRecorder
            mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
            recordedChunksRef.current = [];

            // 6. Enhanced Event Listeners with better error handling
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onerror = (event) => {
                console.error("MediaRecorder error:", event.error);
                alert("เกิดข้อผิดพลาดในการอัดวิดีโอ กรุณาลองใหม่อีกครั้ง");
                // Cleanup on error
                if (audioTrackRef.current) {
                    audioTrackRef.current.stop();
                    audioTrackRef.current = null;
                }
                setIsRecording(false);
                setIsProcessing(false);
            };

            mediaRecorderRef.current.onstop = async () => {
                console.log("Processing video file...");
                setIsProcessing(true);

                try {
                    // ใช้ MIME type ที่ MediaRecorder จริงๆ ใช้
                    const actualMimeType = mediaRecorderRef.current?.mimeType;
                    console.log("Actual MediaRecorder MIME type:", actualMimeType);

                    // ตรวจสอบและแก้ไข MIME type ให้ถูกต้อง
                    let finalMimeType = actualMimeType;

                    // หาก MIME type ไม่ถูกต้อง ให้ใช้ fallback
                    if (!finalMimeType || finalMimeType === 'video/webm') {
                        const { isIOS, isSafari, isChrome } = detectBrowserAndPlatform();
                        if (isIOS || isSafari) {
                            finalMimeType = 'video/mp4';
                        } else if (isChrome) {
                            finalMimeType = 'video/mp4';
                        } else {
                            finalMimeType = 'video/mp4';
                        }
                        console.log("Using fallback MIME type:", finalMimeType);
                    }

                    // สร้าง Blob ด้วย MIME type ที่ถูกต้อง
                    const videoBlob = createCorrectBlob(recordedChunksRef.current, finalMimeType);

                    if (videoBlob.size === 0) {
                        throw new Error("Recorded video is empty");
                    }

                    console.log(`Video blob size: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);
                    console.log(`Video blob type: ${videoBlob.type}`);

                    // ทดสอบ Blob ก่อนสร้าง URL
                    const blobTestResult = testVideoBlob(videoBlob, finalMimeType);
                    if (!blobTestResult) {
                        console.warn("⚠️ Blob test failed, but continuing...");
                    }

                    // ทดสอบการเล่นวิดีโอ
                    const playabilityTest = await testVideoPlayability(videoBlob);
                    if (!playabilityTest) {
                        console.warn("⚠️ Video playability test failed, but continuing...");
                    }

                    const videoUrl = URL.createObjectURL(videoBlob);
                    setPreview({ type: 'video', src: videoUrl, mimeType: finalMimeType });

                    console.log(`Video recorded successfully: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);
                } catch (processingError) {
                    console.error("Error processing video:", processingError);
                    alert("เกิดข้อผิดพลาดในการประมวลผลวิดีโอ กรุณาลองใหม่อีกครั้ง");
                } finally {
                    // Cleanup
                    recordedChunksRef.current = [];
                    mediaRecorderRef.current = null;
                    if (audioTrackRef.current) {
                        audioTrackRef.current.stop();
                        audioTrackRef.current = null;
                    }
                    setIsProcessing(false);
                }
            };

            // 7. เริ่มการอัด
            mediaRecorderRef.current.start();
            console.log("Recording started with state:", mediaRecorderRef.current.state);

            // 8. เริ่ม Loop การวาดภาพลง Canvas (เหมือนเดิม)
            const processFrame = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
                    return;
                }

                try {
                    // วาดภาพ BG จากกล้อง
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
                    if (cameraFacingMode === 'user') { // พลิกภาพเฉพาะกล้องหน้า
                        ctx.translate(videoWidth, 0);
                        ctx.scale(-1, 1);
                    }
                    ctx.drawImage(cameraCanvas, bgX, bgY, bgWidth, bgHeight);
                    ctx.restore();

                    // วาด AR Scene
                    const arAspectRatio = arCanvas.width / arCanvas.height;
                    const drawHeight = videoHeight;
                    const drawWidth = drawHeight * arAspectRatio;
                    const drawX = (videoWidth - drawWidth) / 2;
                    ctx.drawImage(arCanvas, drawX, 0, drawWidth, drawHeight);
                } catch (frameError) {
                    console.error("Error processing frame:", frameError);
                }

                animationFrameIdRef.current = requestAnimationFrame(processFrame);
            };
            requestAnimationFrame(processFrame);
            return true;

        } catch (err) {
            console.error("Failed to start recording:", err);

            // More specific error messages
            let errorMessage = "ไม่สามารถเริ่มอัดวิดีโอได้";
            if (err.name === 'NotAllowedError') {
                errorMessage = "กรุณาอนุญาตให้เข้าถึงไมโครโฟนเพื่ออัดวิดีโอ";
            } else if (err.name === 'NotSupportedError') {
                errorMessage = "เบราว์เซอร์ของคุณไม่รองรับการอัดวิดีโอ";
            } else if (err.name === 'NotFoundError') {
                errorMessage = "ไม่พบไมโครโฟนในอุปกรณ์";
            }

            alert(`${errorMessage}: ${err.message}`);

            // Cleanup เผื่อกรณีเกิด error ระหว่างทาง
            if (audioTrackRef.current) {
                audioTrackRef.current.stop();
                audioTrackRef.current = null;
            }
            return false;
        }
    }, [arSystemRef, cameraFacingMode, isVideoRecordingSupported]);

    // ✨ --- ฟังก์ชัน stopRecording ที่ง่ายขึ้น --- ✨
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            console.log("ACTION: Stop Recording...");
            mediaRecorderRef.current.stop(); // การประมวลผลจะเกิดขึ้นใน onstop event
        }
        clearTimeout(recordTimerRef.current);
        cancelAnimationFrame(animationFrameIdRef.current);
    }, []);

    // ✨ --- ฟังก์ชัน Toggle ที่ปรับปรุงเล็กน้อย --- ✨
    const handleToggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
        } else {
            startRecording().then(success => {
                if (success) {
                    setIsRecording(true);
                    // ตั้งเวลาหยุดอัดอัตโนมัติที่ 30 วินาที
                    recordTimerRef.current = setTimeout(() => {
                        stopRecording();
                        setIsRecording(false);
                    }, 30000);
                }
            });
        }
    }, [isRecording, startRecording, stopRecording]);

    // --- Utility Functions ---

    // --- Preview Action Handlers ---
    const handleRetry = useCallback(() => setPreview(null), []);

    const handleDownload = useCallback(async () => {
        if (!preview?.src) return;

        try {
            // สำหรับวิดีโอ ให้แปลงเป็นรูปแบบที่เหมาะสมก่อนดาวน์โหลด
            let downloadUrl = preview.src;
            let filename = 'mama-noodleverse.png';

            if (preview.type === 'video') {
                const response = await fetch(preview.src);
                const originalBlob = await response.blob();
                const convertedBlob = await convertVideoForDownload(originalBlob, preview.mimeType);

                downloadUrl = URL.createObjectURL(convertedBlob);

                // กำหนดนามสกุลไฟล์ตาม MIME type
                let extension = 'mp4';
                if (convertedBlob.type.includes('webm')) {
                    extension = 'webm';
                } else if (convertedBlob.type.includes('ogg')) {
                    extension = 'ogv';
                }
                filename = `mama-noodleverse.${extension}`;

                console.log(`Downloading converted video: ${filename} with MIME type: ${convertedBlob.type}`);
            }

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;

            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Cleanup URL ที่สร้างใหม่
            if (preview.type === 'video' && downloadUrl !== preview.src) {
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            }
        } catch (error) {
            console.error("Download error:", error);
            alert("เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง");
        }
    }, [preview]);

    // --- แชร์: ปรับปรุงการจัดการ MIME type ---
    const handleShare = useCallback(async () => {
        if (!preview?.src) return;
        try {
            const response = await fetch(preview.src);
            const blob = await response.blob();

            // กำหนด MIME type และนามสกุลไฟล์ที่ถูกต้อง
            let fileType = 'image/png';
            let extension = 'png';

            if (preview.type === 'video') {
                // ตรวจสอบ browser เพื่อกำหนด MIME type ที่เหมาะสม
                const { isAndroid, isChrome } = detectBrowserAndPlatform();

                if (isAndroid || isChrome) {
                    // สำหรับ Android/Chrome ใช้ WebM
                    fileType = 'video/webm';
                    extension = 'webm';
                } else if (preview.mimeType?.includes('mp4')) {
                    fileType = 'video/mp4';
                    extension = 'mp4';
                } else if (preview.mimeType?.includes('webm')) {
                    fileType = 'video/webm';
                    extension = 'webm';
                } else if (preview.mimeType?.includes('ogg')) {
                    fileType = 'video/ogg';
                    extension = 'ogv';
                } else {
                    // fallback ใช้ mp4
                    fileType = 'video/mp4';
                    extension = 'mp4';
                }
            }

            const filename = `mama-noodleverse.${extension}`;
            const file = new File([blob], filename, { type: fileType });

            console.log(`Sharing file: ${filename} with MIME type: ${fileType}`);

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
                <div className="camera-bar-col left">
                    {/* <button className="action-button side-button-left" onClick={handleSwitchCamera} aria-label="Switch Camera" disabled={isRecording || isProcessing}>
                        <img src={iconSwitchCamera} alt="Switch Camera" className={`action-icon ${cameraFacingMode !== 'user' ? 'flipping' : ''}`} />
                    </button> */}
                </div>
                <div className="camera-bar-col center">
                    {mode === 'photo' ? (
                        <div className="photo-button" onClick={handleTakePhoto} aria-label="Take Photo">
                            <div className="circle"></div>
                        </div>
                    ) : (
                        <div className={`record-button ${isRecording ? 'recording' : ''}`} onClick={handleToggleRecording} aria-label="Toggle Recording">
                            <div className="ring" key={String(isRecording)}>
                                <svg viewBox="0 0 64 64">
                                    <circle className="progress-ring" r="28" cx="32" cy="32" fill="transparent" transform="rotate(-90 32 32)" stroke="#FFFFFF" />
                                </svg>
                            </div>
                            <div className="inner-shape"></div>
                        </div>
                    )}
                </div>
                <div className="camera-bar-col right">
                    <div className="mode-toggle-group">
                        <button
                            className={`mode-toggle-btn${mode === 'photo' ? ' active' : ''}`}
                            onClick={() => setMode('photo')}
                            disabled={isRecording || isProcessing}
                            aria-label="โหมดถ่ายภาพ"
                            type="button"
                        >
                            <CameraIcon />
                        </button>
                        <div className="mode-toggle-divider" />
                        <button
                            className={`mode-toggle-btn${mode === 'video' ? ' active' : ''}`}
                            onClick={() => setMode('video')}
                            disabled={isRecording || isProcessing}
                            aria-label="โหมดวิดีโอ"
                            type="button"
                        >
                            <VideoIcon />
                        </button>
                    </div>
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