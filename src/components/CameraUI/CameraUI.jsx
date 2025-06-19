import React, { useState, useRef, useCallback } from 'react';
import './CameraUI.css';
import iconSwitchCamera from '/assets/icons/switch-camera.webp';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary';
import { quality } from '@cloudinary/url-gen/actions/delivery';

const backgroundCldImage = cld.image('TKO/MAMAOK/images/preview-bg.webp')
    .delivery(quality('auto'));

const logoCldImage = cld.image('TKO/MAMAOK/images/mama-logo.webp')
    .delivery(quality('auto'));

// ไอคอน SVG สำหรับปุ่มต่างๆ
const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3c-.92.87-2.44.87-5.5.87h-7c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const CameraUI = ({ arCanvasRef, cameraCanvasRef }) => {
    const [mode, setMode] = useState('photo'); // 'photo' or 'video'
    const [isRecording, setIsRecording] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');
    const [preview, setPreview] = useState({ type: '', src: '' }); // เพิ่ม state นี้ที่หายไป

    // ใช้ Ref เก็บ MediaRecorder และข้อมูลวิดีโอ
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const videoPreviewRef = useRef(null);
    const animationFrameIdRef = useRef(null); // เพิ่ม ref สำหรับ animation frame

    // --- ฟังก์ชันถ่ายภาพ (แปลจาก captureAFrameCombined) ---
    const handleTakePhoto = useCallback(() => {
        console.log("ACTION: Take Photo");

        const arCanvas = arCanvasRef.current;
        const cameraCanvas = cameraCanvasRef.current;

        if (!arCanvas || !cameraCanvas) {
            console.error("Canvas refs for capture are not available.");
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
            setShowPreview(true);
        });
    }, [arCanvasRef, cameraCanvasRef]);

    // --- ฟังก์ชันอัดวิดีโอ (แปลจาก start/stopVideoRecording) ---
    const handleToggleRecording = useCallback(() => {
        const newIsRecording = !isRecording;
        setIsRecording(newIsRecording);

        if (newIsRecording) { // --- เริ่มอัด ---
            console.log("ACTION: Start Recording");
            const arCanvas = arCanvasRef.current;
            const cameraCanvas = cameraCanvasRef.current;
            if (!arCanvas || !cameraCanvas) return;

            // สร้าง Canvas เสมือนสำหรับอัด (ตามโค้ดเก่า)
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');

            const isLandscape = window.innerWidth > window.innerHeight;
            recordingCanvas.width = isLandscape ? 1280 : 720;
            recordingCanvas.height = isLandscape ? 720 : 1280;

            // สร้าง MediaRecorder
            const stream = recordingCanvas.captureStream(30);
            const recorder = new MediaRecorder(stream, {
                mimeType: "video/mp4; codecs=avc1.42E01E,mp4a.40.2"
            });
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(videoBlob);
                setPreview({ type: 'video', src: videoUrl });
                setShowPreview(true);
                recordedChunksRef.current = [];
            };

            recorder.start();

            // สร้าง Loop การวาดลง Canvas ที่จะอัด (ตามโค้ดเก่า)
            const drawFrameForRecording = () => {
                if (cameraCanvas) {
                    ctx.save();
                    ctx.translate(recordingCanvas.width, 0);
                    ctx.scale(-1, 1); // กลับด้านเฉพาะการวาด camera

                    const sourceWidth = cameraCanvas.width;
                    const sourceHeight = cameraCanvas.height;
                    const sourceRatio = sourceWidth / sourceHeight;
                    const targetRatio = recordingCanvas.width / recordingCanvas.height;

                    let drawWidth, drawHeight;
                    if (sourceRatio > targetRatio) {
                        drawHeight = recordingCanvas.height;
                        drawWidth = drawHeight * sourceRatio;
                    } else {
                        drawWidth = recordingCanvas.width;
                        drawHeight = drawWidth / sourceRatio;
                    }

                    const offsetX = (recordingCanvas.width - drawWidth) / 2;
                    const offsetY = (recordingCanvas.height - drawHeight) / 2;

                    ctx.drawImage(cameraCanvas, offsetX, offsetY, drawWidth, drawHeight);
                    ctx.restore();
                }

                // วาด AR canvas ทับ
                ctx.drawImage(arCanvas, 0, 0, recordingCanvas.width, recordingCanvas.height);

                if (isRecording) {
                    animationFrameIdRef.current = requestAnimationFrame(drawFrameForRecording);
                }
            };
            drawFrameForRecording();

        } else { // --- หยุดอัด ---
            console.log("ACTION: Stop Recording");
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                // หยุด Loop การวาด
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                }
            }
        }
    }, [isRecording, arCanvasRef, cameraCanvasRef]);

    // ฟังก์ชันสำหรับปุ่มสลับกล้องหน้า - หลัง
    const handleSwitchCamera = useCallback(() => {
        console.log("ACTION: Switch Camera");
        const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
        setCameraFacingMode(newMode);
    }, [cameraFacingMode]);

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
        setShowPreview(false);

        // ล้างข้อมูล preview และปล่อยทรัพยากร
        if (preview.type === 'video' && preview.src) {
            URL.revokeObjectURL(preview.src);
        }
        setPreview({ type: '', src: '' });
    }, [preview]);

    // ** ฟังก์ชันสำหรับปุ่ม "บันทึก" (ตามโค้ดเก่า) **
    const handleSave = useCallback(async () => {
        console.log("ACTION: Save/Share");

        try {
            let blob = null;
            let filename = "shared_content";
            let fileType = "application/octet-stream";

            if (preview.type === 'video' && preview.src) {
                filename = "video.mp4";
                fileType = "video/mp4";
                const response = await fetch(preview.src);
                if (!response.ok) throw new Error("Failed to fetch video blob");
                blob = await response.blob();
            } else if (preview.type === 'image' && preview.src) {
                filename = "image.png";
                fileType = "image/png";
                const response = await fetch(preview.src);
                if (!response.ok) throw new Error("Failed to fetch image blob");
                blob = await response.blob();
            } else {
                console.warn("No active preview found to share.");
                return;
            }

            if (!blob) {
                console.error("Could not get Blob data for sharing.");
                return;
            }

            const file = new File([blob], filename, { type: fileType });
            const shareData = { files: [file] };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log("Share successful");
            } else {
                // Fallback - สร้าง download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log("File downloaded");
            }
        } catch (error) {
            console.error("Error sharing/saving content:", error);
            alert(`การบันทึกล้มเหลว: ${error.message}`);
        }
    }, [preview]);

    // Cleanup เมื่อ component unmount
    React.useEffect(() => {
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (preview.type === 'video' && preview.src) {
                URL.revokeObjectURL(preview.src);
            }
        };
    }, [preview]);

    return (
        <div className="ui-overlay">
            {/* ส่วนควบคุมหลัก */}
            <div className={`camera-controls ${showPreview ? 'hidden' : ''}`}>
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
            {showPreview && (
                <div className="preview-modal">
                    <AdvancedImage
                        cldImg={backgroundCldImage}
                        alt="Preview Background"
                        className="preview-background-image"
                    />

                    <AdvancedImage
                        cldImg={logoCldImage}
                        alt="Brand Logo"
                        className="preview-brand-logo"
                    />

                    <div className="preview-content-frame">
                        <div className="preview-content-wrapper">
                            {preview.type === 'image' && (
                                <img
                                    src={preview.src}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        border: '3px solid white',
                                        borderRadius: '8px',
                                        display: 'block'
                                    }}
                                />
                            )}
                            {preview.type === 'video' && (
                                <video
                                    ref={videoPreviewRef}
                                    src={preview.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls={false}
                                    style={{
                                        maxWidth: '100%',
                                        border: '3px solid white',
                                        borderRadius: '8px',
                                        display: 'block'
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="preview-actions">
                        <button className="preview-button retry" onClick={handleRetry}>
                            เล่นอีกครั้ง
                        </button>
                        <button className="preview-button save" onClick={handleSave}>
                            บันทึก
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraUI;