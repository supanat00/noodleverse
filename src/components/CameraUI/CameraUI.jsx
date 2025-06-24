import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
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

    // const startRecording = useCallback(async () => {
    //     console.log("ACTION: Start Recording with Real-time Timestamp");

    //     if (!('VideoEncoder' in window)) {
    //         alert("ขออภัย อุปกรณ์ของคุณไม่รองรับการอัดวิดีโอ");
    //         return false;
    //     }

    //     let videoWidth = 720;  // ลดความกว้างลงเป็น 720p
    //     let videoHeight = 1280; // ลดความสูงลงเป็น 720p (แนวตั้ง)

    //     const arCanvas = arSystemRef.current?.arCanvas;
    //     const cameraCanvas = arSystemRef.current?.cameraCanvas;
    //     if (!arCanvas || !cameraCanvas) {
    //         alert("เกิดข้อผิดพลาด: ไม่สามารถเริ่มอัดวิดีโอได้");
    //         return false;
    //     }

    //     // ตรวจสอบและบังคับให้เป็นเลขคู่ (ยังคงสำคัญ)
    //     if (videoWidth % 2 !== 0) videoWidth++;
    //     if (videoHeight % 2 !== 0) videoHeight++;

    //     muxerRef.current = new Muxer({
    //         target: new ArrayBufferTarget(),
    //         video: { codec: 'avc', width: videoWidth, height: videoHeight },
    //         audio: { codec: 'aac', sampleRate: 44100, numberOfChannels: 1 },
    //         fastStart: 'in-memory',
    //     });

    //     videoEncoderRef.current = new VideoEncoder({
    //         output: (chunk, meta) => muxerRef.current.addVideoChunk(chunk, meta),
    //         error: (e) => console.error('VideoEncoder error:', e),
    //     });
    //     await videoEncoderRef.current.configure({
    //         codec: 'avc1.42001f',
    //         width: videoWidth,
    //         height: videoHeight,
    //         bitrate: 3_000_000,
    //     });

    //     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //     audioEncoderRef.current = new AudioEncoder({
    //         output: (chunk, meta) => muxerRef.current.addAudioChunk(chunk, meta),
    //         error: (e) => console.error('AudioEncoder error:', e),
    //     });
    //     await audioEncoderRef.current.configure({
    //         codec: 'mp4a.40.2',
    //         sampleRate: audioContext.sampleRate,
    //         numberOfChannels: 1,
    //         bitrate: 96000,
    //     });

    //     const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 1, audioContext.sampleRate);
    //     const audioData = new AudioData({
    //         timestamp: 0,
    //         data: audioBuffer.getChannelData(0),
    //         numberOfFrames: audioBuffer.length,
    //         numberOfChannels: 1,
    //         sampleRate: audioContext.sampleRate,
    //         format: 'f32-planar'
    //     });
    //     audioEncoderRef.current.encode(audioData);
    //     audioData.close();

    //     let recordingStartTime = null;
    //     const recordingCanvas = document.createElement('canvas');
    //     recordingCanvas.width = videoWidth;
    //     recordingCanvas.height = videoHeight;
    //     const ctx = recordingCanvas.getContext('2d');

    //     const processFrame = (currentTime) => {
    //         if (!isRecordingRef.current) return;
    //         if (recordingStartTime === null) recordingStartTime = currentTime;

    //         // 1. วาด BG (ภาพจากกล้อง) ให้เต็มและอยู่กลาง (เหมือน handleTakePhoto)
    //         const cameraAspectRatio = cameraCanvas.width / cameraCanvas.height;
    //         let bgWidth = videoWidth;
    //         let bgHeight = bgWidth / cameraAspectRatio;
    //         if (bgHeight < videoHeight) {
    //             bgHeight = videoHeight;
    //             bgWidth = bgHeight * cameraAspectRatio;
    //         }
    //         const bgX = (videoWidth - bgWidth) / 2;
    //         const bgY = (videoHeight - bgHeight) / 2;
    //         ctx.save();
    //         ctx.translate(videoWidth, 0);
    //         ctx.scale(-1, 1);
    //         ctx.drawImage(cameraCanvas, bgX, bgY, bgWidth, bgHeight);
    //         ctx.restore();

    //         // 2. วาด AR Scene โดยยึด "ความสูง" เป็นหลัก (เหมือน handleTakePhoto)
    //         const arAspectRatio = arCanvas.width / arCanvas.height;
    //         const drawHeight = videoHeight;
    //         const drawWidth = drawHeight * arAspectRatio;
    //         const drawX = (videoWidth - drawWidth) / 2;
    //         ctx.drawImage(arCanvas, drawX, 0, drawWidth, drawHeight);

    //         // 3. ส่ง Frame ไป Encode (เหมือนเดิม)
    //         if (videoEncoderRef.current?.state === 'configured') {
    //             const elapsedTimeMs = currentTime - recordingStartTime;
    //             const timestamp = Math.round(elapsedTimeMs * 1000);
    //             const videoFrame = new VideoFrame(recordingCanvas, { timestamp });
    //             videoEncoderRef.current.encode(videoFrame);
    //             videoFrame.close();
    //         }

    //         animationFrameIdRef.current = requestAnimationFrame(processFrame);
    //     };
    //     requestAnimationFrame(processFrame);
    //     return true;
    // }, [arSystemRef]);

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
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioTrackRef.current = audioStream.getAudioTracks()[0]; // เก็บ Track เสียงไว้

            // 3. รวม Video Track และ Audio Track เข้าด้วยกัน
            const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);

            // 4. ตรวจสอบ Mime Type ที่รองรับ (สำคัญมากสำหรับ Safari)
            const options = { mimeType: 'video/mp4' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.warn(`${options.mimeType} is not supported. Falling back to default.`);
                delete options.mimeType; // ใช้ค่า default ของเบราว์เซอร์
            }

            // 5. สร้าง Instance ของ MediaRecorder
            mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
            recordedChunksRef.current = [];

            // 6. ตั้งค่า Event Listeners
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                console.log("Processing video file...");
                setIsProcessing(true); // แสดงสถานะกำลังประมวลผล

                const mimeType = mediaRecorderRef.current?.mimeType || 'video/mp4';
                const videoBlob = new Blob(recordedChunksRef.current, { type: mimeType });
                const videoUrl = URL.createObjectURL(videoBlob);

                setPreview({ type: 'video', src: videoUrl, mimeType: mimeType });

                // Cleanup
                recordedChunksRef.current = [];
                mediaRecorderRef.current = null;
                if (audioTrackRef.current) {
                    audioTrackRef.current.stop(); // หยุดการใช้ไมโครโฟน
                    audioTrackRef.current = null;
                }
                setIsProcessing(false); // ซ่อนสถานะกำลังประมวลผล
            };

            // 7. เริ่มการอัด
            mediaRecorderRef.current.start();
            console.log("Recording started with state:", mediaRecorderRef.current.state);

            // 8. เริ่ม Loop การวาดภาพลง Canvas (เหมือนเดิม)
            const processFrame = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
                    return;
                }
                // วาดภาพ BG จากกล้อง
                const cameraAspectRatio = cameraCanvas.width / cameraCanvas.height;
                let bgWidth = videoWidth;
                let bgHeight = bgWidth / cameraAspectRatio;
                if (bgHeight < videoHeight) { bgHeight = videoHeight; bgWidth = bgHeight * cameraAspectRatio; }
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

                animationFrameIdRef.current = requestAnimationFrame(processFrame);
            };
            requestAnimationFrame(processFrame);
            return true;

        } catch (err) {
            console.error("Failed to start recording:", err);
            alert(`ไม่สามารถเริ่มอัดวิดีโอได้: ${err.message}`);
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

    // const stopRecording = useCallback(async () => {
    //     if (!isRecordingRef.current) return;

    //     console.log("ACTION: Stop Recording & Queue Processing...");
    //     isRecordingRef.current = false;

    //     // 1. หยุด Timer และ Animation Frame ทันที
    //     clearTimeout(recordTimerRef.current);
    //     cancelAnimationFrame(animationFrameIdRef.current);

    //     // 2. ตั้ง State ให้แสดง UI "กำลังประมวลผล"
    //     setIsProcessing(true);

    //     // 3. ใช้ setTimeout(..., 0) หรือ requestAnimationFrame เพื่อ "หน่วง" งานหนักๆ
    //     //    เพื่อให้ React มีเวลา Render UI ใหม่ก่อน
    //     requestAnimationFrame(async () => {
    //         console.log("Processing video file...");

    //         if (videoEncoderRef.current?.state === 'configured') await videoEncoderRef.current.flush().catch(console.error);
    //         if (audioEncoderRef.current?.state === 'configured') await audioEncoderRef.current.flush().catch(console.error);

    //         if (muxerRef.current) {
    //             muxerRef.current.finalize();
    //             const { buffer } = muxerRef.current.target;
    //             const videoBlob = new Blob([buffer], { type: 'video/mp4' });
    //             const videoUrl = URL.createObjectURL(videoBlob);
    //             setPreview({ type: 'video', src: videoUrl });
    //         }

    //         // Cleanup refs
    //         videoEncoderRef.current = null;
    //         audioEncoderRef.current = null;
    //         muxerRef.current = null;

    //         // 4. เมื่อประมวลผลเสร็จ ให้ซ่อน UI
    //         setIsProcessing(false);
    //     });
    // }, []);

    // // --- ฟังก์ชัน Toggle (ปรับปรุงเล็กน้อย) ---
    // const handleToggleRecording = useCallback(() => {
    //     if (isRecording) {
    //         // ถ้ากำลังอัดอยู่ ให้เรียก stopRecording
    //         stopRecording();
    //         setIsRecording(false); // อัปเดต state ทันที
    //     } else {
    //         // ถ้าจะเริ่มอัด
    //         startRecording().then(success => {
    //             if (success) {
    //                 setIsRecording(true);
    //                 isRecordingRef.current = true;
    //                 recordTimerRef.current = setTimeout(stopRecording, 30000);
    //             }
    //         });
    //     }
    // }, [isRecording, startRecording, stopRecording]);

    // --- Utility Functions ---

    const handleSwitchCamera = useCallback(() => onSwitchCamera(cameraFacingMode === 'user' ? 'environment' : 'user'), [cameraFacingMode, onSwitchCamera]);
    const handleModeChange = useCallback((e) => setMode(e.target.checked ? 'video' : 'photo'), []);

    // --- Preview Action Handlers ---
    const handleRetry = useCallback(() => setPreview(null), []);

    const handleDownload = useCallback(() => {
        if (!preview?.src) return;
        const a = document.createElement('a');
        a.href = preview.src;
        // ใช้ mimeType ที่ได้มาในการตั้งชื่อไฟล์
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
            const fileType = preview.type === 'video' ? (preview.mimeType || 'video/mp4') : 'image/png';
            const extension = fileType.split('/')[1];
            const file = new File([blob], `mama-noodleverse.${extension}`, { type: fileType });

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
            {/* ✨ 1. เพิ่ม UI สำหรับแสดงสถานะ Processing ✨ */}
            {isProcessing && (
                <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>กำลังประมวลผล...</p>
                </div>
            )}

            <div className={`camera-controls ${preview || isRecording || isProcessing ? 'hidden' : ''}`}>
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