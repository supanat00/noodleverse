import React, { useState, useRef, useCallback, useEffect } from 'react';
import './CameraUI.css';

import PreviewModal from '../PreviewModal/PreviewModal';

// --- Assets & Icons ---
import iconSwitchCamera from '/assets/icons/switch-camera.webp';

const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3c-.92.87-2.44.87-5.5.87h-7c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/**
 * CameraUI
 * 
 * จัดการส่วนควบคุมกล้อง (สลับโหมด, ถ่าย/อัด, สลับกล้อง)
 * และเป็นตัวกลางในการเรียกใช้ฟังก์ชันจาก arSystem (ผ่าน ref)
 * รวมถึงแสดง PreviewModal เมื่อมี content ที่ถูกสร้างขึ้น
 */
const CameraUI = ({ arSystemRef, cameraFacingMode, onSwitchCamera }) => {

    // --- State Management ---
    const [mode, setMode] = useState('photo'); // 'photo' | 'video'
    const [isRecording, setIsRecording] = useState(false);

    const [preview, setPreview] = useState(null); // null | { type: 'image'|'video', src: '...' }

    // --- Refs for Recording Logic ---
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const animationFrameIdRef = useRef(null);

    // --- ฟังก์ชันถ่ายภาพ (แปลจาก captureAFrameCombined) ---
    const handleTakePhoto = useCallback(() => {
        console.log("ACTION: Take Photo");

        // **[แก้ไข 1]** ดึง canvas จาก arSystemRef.current
        const arCanvas = arSystemRef.current?.arCanvas;
        const cameraCanvas = arSystemRef.current?.cameraCanvas;

        if (!arCanvas || !cameraCanvas) {
            console.error("Canvas refs for capture are not available. Check arSystemRef.", { arSystemRef: arSystemRef.current });
            alert("ไม่สามารถถ่ายภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
            return;
        }

        // สร้าง canvas สำหรับรวมภาพ
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d', { willReadFrequently: true });

        // กำหนดขนาดตามการหมุนหน้าจอ (ตามโค้ดเก่า)
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
            finalCanvas.width = 1280;
            finalCanvas.height = 720;
        } else {
            finalCanvas.width = 720;
            finalCanvas.height = 1280;
        }

        requestAnimationFrame(() => {
            // วาดภาพกล้อง (พื้นหลัง) - ตามโค้ดเก่าที่มีการกลับด้าน
            if (cameraCanvas) {
                ctx.save();
                ctx.translate(finalCanvas.width, 0);
                ctx.scale(-1, 1); // กลับด้านเฉพาะการวาด camera

                // คำนวณอัตราส่วนให้ถูกต้อง
                const sourceWidth = cameraCanvas.width;
                const sourceHeight = cameraCanvas.height;
                const sourceRatio = sourceWidth / sourceHeight;
                const targetRatio = finalCanvas.width / finalCanvas.height;

                let drawWidth, drawHeight;
                if (sourceRatio > targetRatio) {
                    drawHeight = finalCanvas.height;
                    drawWidth = drawHeight * sourceRatio;
                } else {
                    drawWidth = finalCanvas.width;
                    drawHeight = drawWidth / sourceRatio;
                }

                const offsetX = (finalCanvas.width - drawWidth) / 2;
                const offsetY = (finalCanvas.height - drawHeight) / 2;

                ctx.drawImage(cameraCanvas, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
            }

            // วาด AR/3D Scene ทับ (ไม่กลับด้าน)
            ctx.drawImage(arCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

            const dataURL = finalCanvas.toDataURL('image/png');
            setPreview({ type: 'image', src: dataURL });
        });
    }, [arSystemRef]);

    // --- ฟังก์ชันอัดวิดีโอ (นำ Logic จากโค้ดเก่ามาใส่) ---
    const handleToggleRecording = useCallback(() => {
        const newIsRecording = !isRecording;
        setIsRecording(newIsRecording);

        if (newIsRecording) {
            // ================== ส่วนของการ "เริ่มอัด" (เทียบเท่า startVideoRecording) ==================
            console.log("ACTION: Start Recording");
            const arCanvas = arSystemRef.current?.arCanvas;
            const cameraCanvas = arSystemRef.current?.cameraCanvas;

            if (!arCanvas || !cameraCanvas) {
                console.error("Canvas refs for recording are not available.");
                alert("ไม่สามารถอัดวิดีโอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
                setIsRecording(false);
                return;
            }

            // 1. สร้าง Canvas เสมือนสำหรับอัด (เหมือนโค้ดเก่า)
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');
            const isLandscape = window.innerWidth > window.innerHeight;
            recordingCanvas.width = isLandscape ? 1280 : 720;
            recordingCanvas.height = isLandscape ? 720 : 1280;

            // สร้าง MediaRecorder
            const stream = recordingCanvas.captureStream(30);
            const recorder = new MediaRecorder(stream, {
                // mimeType: "video/webm;codecs=h264",
                mimeType: "video/mp4; codecs=avc1.42E01E,mp4a.40.2"
            });
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];

            // 3. ตั้งค่า ondataavailable เพื่อเก็บข้อมูลวิดีโอ
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            // 4. ตั้งค่า onstop เพื่อสร้างไฟล์และแสดง Preview
            recorder.onstop = () => {
                console.log("Recording stopped, creating blob.");
                const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                setPreview({ type: 'video', src: videoUrl }); // <-- ตั้ง state
                recordedChunksRef.current = [];
            };

            recorder.start();
            console.log("Recorder started.");

            // 6. สร้าง Loop การวาดลง Canvas ที่จะอัด (เทียบเท่า drawVideo)
            const drawFrameForRecording = () => {
                // ตรวจสอบว่ายังต้องอัดอยู่หรือไม่ ถ้าไม่ ให้หยุด Loop
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
                    console.log("Stopping draw loop.");
                    if (animationFrameIdRef.current) {
                        cancelAnimationFrame(animationFrameIdRef.current);
                        animationFrameIdRef.current = null;
                    }
                    return;
                }

                // วาด cameraCanvas (กลับด้าน)
                if (cameraCanvas) {
                    ctx.save();
                    ctx.translate(recordingCanvas.width, 0);
                    ctx.scale(-1, 1);
                    const sourceRatio = cameraCanvas.width / cameraCanvas.height;
                    const targetRatio = recordingCanvas.width / recordingCanvas.height;
                    let drawWidth, drawHeight, offsetX, offsetY;
                    if (sourceRatio > targetRatio) {
                        drawHeight = recordingCanvas.height;
                        drawWidth = drawHeight * sourceRatio;
                    } else {
                        drawWidth = recordingCanvas.width;
                        drawHeight = drawWidth / sourceRatio;
                    }
                    offsetX = (recordingCanvas.width - drawWidth) / 2;
                    offsetY = (recordingCanvas.height - drawHeight) / 2;
                    ctx.drawImage(cameraCanvas, offsetX, offsetY, drawWidth, drawHeight);
                    ctx.restore();
                }

                // วาด AR canvas ทับ
                ctx.drawImage(arCanvas, 0, 0, recordingCanvas.width, recordingCanvas.height);

                // ขอเฟรมต่อไป
                animationFrameIdRef.current = requestAnimationFrame(drawFrameForRecording);
            };

            // เริ่ม Loop การวาด
            drawFrameForRecording();

        } else {
            // ================== ส่วนของการ "หยุดอัด" (เทียบเท่า stopVideoRecording) ==================
            console.log("ACTION: Stop Recording");
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            // Loop การวาดจะหยุดเองเมื่อ state ของ recorder เปลี่ยน
        }
    }, [isRecording, arSystemRef]);

    // ฟังก์ชันสำหรับปุ่มสลับกล้องหน้า - หลัง
    const handleSwitchCamera = useCallback(() => {
        console.log("ACTION: Switch Camera");
        // **[แก้ไข 3]** เรียกใช้ฟังก์ชันจาก parent เพื่อเปลี่ยน state
        const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
        onSwitchCamera(newMode);
    }, [cameraFacingMode, onSwitchCamera]);

    // --- ฟังก์ชัน: เปลี่ยนโหมดถ่ายภาพ/วิดีโอ ---
    const handleModeChange = useCallback((e) => {
        setMode(e.target.checked ? 'video' : 'photo');
        if (isRecording) {
            // หยุดการอัดถ้าเปลี่ยนโหมดระหว่างการอัด
            setIsRecording(false);
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                }
            }
        }
    }, [isRecording]);

    // ** ฟังก์ชันสำหรับปุ่ม "เล่นอีกครั้ง" **
    const handleRetry = useCallback(() => {
        console.log("ACTION: Retry");

        // *** เปลี่ยนแค่ตรงนี้ ***
        if (preview && preview.type === 'video' && preview.src) {
            URL.revokeObjectURL(preview.src);
        }
        setPreview(null);
    }, [preview]);

    // ** ฟังก์ชันสำหรับปุ่ม "บันทึก" (Download) **
    const handleDownload = useCallback(async () => {
        console.log("ACTION: Download");
        if (!preview?.src) {
            console.warn("No active preview found to download.");
            return;
        }

        try {
            const response = await fetch(preview.src);
            if (!response.ok) throw new Error(`Failed to fetch ${preview.type} blob`);
            const blob = await response.blob();

            const filename = preview.type === 'video' ? 'mama-noodleverse.mp4' : 'mama-noodleverse.png';

            // Logic การดาวน์โหลดโดยตรง
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("File downloaded successfully.");

        } catch (error) {
            console.error("Error downloading content:", error);
            alert(`การดาวน์โหลดล้มเหลว: ${error.message}`);
        }
    }, [preview]);

    // ** ฟังก์ชันสำหรับปุ่ม "แชร์" (Share) **
    const handleShare = useCallback(async () => {
        console.log("ACTION: Share");
        if (!preview?.src) {
            console.warn("No active preview found to share.");
            return;
        }

        try {
            const response = await fetch(preview.src);
            if (!response.ok) throw new Error(`Failed to fetch ${preview.type} blob`);
            const blob = await response.blob();

            const filename = preview.type === 'video' ? 'video.mp4' : 'image.png';
            const fileType = preview.type === 'video' ? 'video/mp4' : 'image/png';
            const file = new File([blob], filename, { type: fileType });
            const shareData = {
                files: [file],
                title: 'MAMA Noodle Verse',
                text: 'มาเล่น AR สนุกๆ กับ MAMA กัน!',
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log("Share successful");
            } else {
                alert("ฟังก์ชันแชร์ไม่สามารถใช้งานได้บนเบราว์เซอร์นี้");
                console.error("Sharing not supported.");
            }
        } catch (error) {
            // ไม่ต้องแสดง alert ถ้าผู้ใช้กดยกเลิกการแชร์เอง
            if (error.name !== 'AbortError') {
                console.error("Error sharing content:", error);
                alert(`การแชร์ล้มเหลว: ${error.message}`);
            } else {
                console.log("Share action was cancelled by the user.");
            }
        }
    }, [preview]);

    // Effect ที่ 1: จัดการการ cleanup เมื่อ "preview" เปลี่ยนแปลง
    useEffect(() => {
        // Effect นี้จะทำงานเมื่อ `preview` มีค่าใหม่
        // และจะ return cleanup function สำหรับ "preview เก่า"

        // เก็บค่า src ของ preview ปัจจุบันไว้ในตัวแปร
        const currentPreviewSrc = preview?.src;
        const isVideo = preview?.type === 'video';

        return () => {
            // Cleanup function นี้จะทำงาน "ก่อน" ที่ effect ครั้งต่อไปจะรัน
            // หรือเมื่อ component unmount
            // มันจะทำการ cleanup "preview ตัวเก่า"
            if (isVideo && currentPreviewSrc) {
                console.log("Revoking old video URL:", currentPreviewSrc);
                URL.revokeObjectURL(currentPreviewSrc);
            }
        };
    }, [preview]); // ทำงานใหม่ทุกครั้งที่ object `preview` เปลี่ยน

    // Effect ที่ 2: จัดการการ cleanup เมื่อ "Component ถูกทำลาย"
    useEffect(() => {
        // Effect นี้จะทำงานครั้งเดียวตอน mount
        // และ cleanup จะทำงานครั้งเดียวตอน unmount
        return () => {
            console.log("CameraUI is unmounting. Cleaning up animation frames.");
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            // เราอาจจะหยุด MediaRecorder ที่อาจจะค้างอยู่ด้วย
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        };
    }, []); // Dependency array ว่างเปล่า = unmount cleanup

    return (
        <div className="ui-overlay">
            {/* ส่วนควบคุมหลัก */}
            <div className={`camera-controls ${preview ? 'hidden' : ''}`}>
                {/* ปุ่มสลับกล้องหน้า/หลัง */}
                <button
                    className="action-button side-button-left"
                    onClick={handleSwitchCamera}
                    aria-label="Switch Camera"
                >
                    <img
                        src={iconSwitchCamera}
                        alt="Switch Camera Icon"
                        className={`action-icon ${cameraFacingMode !== 'user' ? 'flipping' : ''}`}
                    />
                </button>

                {/* ปุ่มถ่ายภาพ - วิดีโอ */}
                {mode === 'photo' ? (
                    <div
                        className="photo-button"
                        onClick={handleTakePhoto}
                        aria-label="Take Photo"
                    >
                        <div className="circle"></div>
                    </div>
                ) : (
                    <div
                        className={`record-button ${isRecording ? 'recording' : ''}`}
                        onClick={handleToggleRecording}
                        aria-label="Toggle Recording"
                    >
                        <div className="ring" key={String(isRecording)}>
                            <svg viewBox="0 0 32 32">
                                <circle
                                    className="progress-ring"
                                    r="15"
                                    cx="16"
                                    cy="16"
                                    fill="transparent"
                                    transform="rotate(-90 16 16)"
                                    stroke="#FFFFFF"
                                />
                            </svg>
                        </div>
                        <div className="inner-shape"></div>
                    </div>
                )}

                {/* ปุ่มสลับโหมด */}
                <div id="switchButton" className="switch-button">
                    <label>
                        <span className="camera"><CameraIcon /></span>
                        <span className="video"><VideoIcon /></span>
                        <input
                            type="checkbox"
                            className="input"
                            id="toggleInput"
                            onChange={handleModeChange}
                            checked={mode === 'video'}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* หน้า Preview */}
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

export default CameraUI;