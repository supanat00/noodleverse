import React, { useState, useRef, useCallback } from 'react';
import './CameraUI.css';
import iconSwitchCamera from '../../assets/icons/switch-camera.webp';

// ไอคอน SVG สำหรับปุ่มต่างๆ (เพื่อความสะอาด)
const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="3" stroke="#FFFFFF" strokeWidth="1.5" /><path d="M2 13.36C2 10.3 2 8.77 2.75 7.67c.37-.53.8-1 1.22-1.2C4.9 6 6.44 6 9.5 6h5c3.05 0 4.58 0 5.5.87.42.38.8.76 1.22 1.29.75 1.1.75 2.63.75 5.69s0 4.59-.75 5.69a3.83 3.83 0 01-1.22 1.29c-.92.87-2.45.87-5.5.87h-5c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3c-.2-.45-.3-.93-.32-1.77" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" /><path d="M19 10h-1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CloseIcon = () => <svg width="32px" height="32px" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg"><path d="M9 9l6 6m0-6l-6 6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" /></svg>;


/**
 * CameraUI Component
 * จัดการ UI และ Logic การถ่ายภาพ/อัดวิดีโอทั้งหมด
 * @param {React.RefObject<HTMLCanvasElement>} arCanvasRef - Ref ไปยัง Canvas ของ 3D Scene
 * @param {React.RefObject<HTMLCanvasElement>} cameraCanvasRef - Ref ไปยัง Canvas ของภาพกล้อง
 */
const CameraUI = () => {
    const [mode, setMode] = useState('photo'); // 'photo' or 'video'
    const [isRecording, setIsRecording] = useState(false);
    const [preview, setPreview] = useState({ type: null, src: null });
    const [cameraFacingMode, setCameraFacingMode] = useState('user');

    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const animationFrameIdRef = useRef(null);

    // --- ฟังก์ชัน: ถ่ายภาพ ---
    const handleTakePhoto = () => {
        console.log("ACTION: Take Photo");
    };

    // --- ฟังก์ชัน: เริ่ม/หยุดถ่ายวิดีโอ ---
    const handleToggleRecording = () => {
        const newRecordingState = !isRecording;
        setIsRecording(newRecordingState);
        console.log("ACTION: Toggle Recording to", newRecordingState);
        // ถ้าเป็นการ "หยุด" อัด, ให้แสดงหน้า Preview
        if (!newRecordingState) {
            setShowPreview(true);
        }
    };

    // ฟังก์ชันสำหรับปุ่มชัตเตอร์หลัก
    const handleShutterClick = () => {
        if (mode === 'photo') {
            handleTakePhoto();
        } else {
            handleToggleRecording();
        }
    };


    // --- ฟังก์ชัน UI อื่นๆ ---
    const handleClosePreview = () => {
        if (preview.type === 'video' && preview.src) {
            URL.revokeObjectURL(preview.src);
        }
        setPreview({ type: null, src: null });
    };

    const handleShare = async () => {
        if (!preview.src) return;
        try {
            const response = await fetch(preview.src);
            const blob = await response.blob();
            const filename = preview.type === 'image' ? 'capture.png' : 'capture.mp4';
            const file = new File([blob], filename, { type: blob.type });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            } else {
                // Fallback สำหรับดาวน์โหลด
                const link = document.createElement('a');
                link.href = preview.src;
                link.download = filename;
                link.click();
            }
        } catch (error) {
            console.error("Error sharing/downloading:", error);
        }
    };

    // ฟังก์ชันสำหรับปุ่มสลับกล้องหน้า - หลัง
    const handleSwitchCamera = () => {
        console.log("ACTION: Switch Camera");
        // สลับค่า State ระหว่าง 'user' และ 'environment'
        const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
        setCameraFacingMode(newMode);
    };


    return (
        <div className="ui-overlay">
            {/* ส่วนควบคุมหลัก */}
            <div className={`bottom-overlay ${preview.src ? 'hidden' : ''}`}>
                <div className="camera-controls">
                    {/* ปุ่มสลับกล้องหน้า/หลัง (ยังไม่ทำ Logic) */}
                    <button
                        className="action-button side-button-left"
                        onClick={handleSwitchCamera}
                        aria-label="Switch Camera"
                    >
                        {/* 
                          - ใส่ <img> เข้าไป
                          - เพิ่ม class `flipping` เมื่อ cameraFacingMode ไม่ใช่ 'user' (กล้องหลัง)
                            เพื่อให้ CSS สามารถทำอนิเมชันได้
                        */}
                        <img
                            src={iconSwitchCamera}
                            alt="Switch Camera Icon"
                            className={`action-icon ${cameraFacingMode !== 'user' ? 'flipping' : ''}`}
                        />
                    </button>

                    {/* ปุ่มถ่ายภาพ - วิดีโอ */}
                    <div
                        className={`shutter-button ${isRecording ? 'recording' : ''}`}
                        onClick={mode === 'photo' ? handleTakePhoto : handleToggleRecording}
                        aria-label={mode === 'photo' ? 'Take Photo' : 'Toggle Recording'}
                    >
                        <div className="circle"></div>
                        <div className="ring"></div>
                    </div>

                    {/* ปุ่มสลับโหมดถ่ายภาพ - วิดีโอ */}
                    <div className="switch-button">
                        <label>
                            <span className="camera-icon"><CameraIcon /></span>
                            <span className="video-icon"><VideoIcon /></span>
                            <input
                                type="checkbox"
                                className="input"
                                onChange={handleModeChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* หน้า Preview */}
            {preview.src && (
                <div className="preview-modal">
                    <div className="preview-content-wrapper">
                        <button className="close-preview-button" onClick={handleClosePreview} aria-label="Close Preview">
                            <CloseIcon />
                        </button>

                        {preview.type === 'image' && <img src={preview.src} alt="Preview" />}
                        {preview.type === 'video' && <video src={preview.src} autoPlay loop muted playsInline />}
                    </div>
                    <div className="share-button-container">
                        <button className="share-button" onClick={handleShare}>บันทึก</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraUI;