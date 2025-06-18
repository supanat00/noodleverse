import React, { useState, useRef } from 'react';
import './CameraUI.css';
import iconSwitchCamera from '/assets/icons/switch-camera.webp';


// ไอคอน SVG สำหรับปุ่มต่างๆ (เพื่อความสะอาด)
// ไอคอน SVG สำหรับปุ่มสลับโหมด
const CameraIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" strokeWidth="1.5" /><path d="M8.5 4.5h7c3.06 0 4.58 0 5.5.87a3.83 3.83 0 011.22 1.29c.88 1 .88 2.5.88 5.56s0 4.59-.88 5.69a3.83 3.83 0 01-1.22 1.3c-.92.87-2.44.87-5.5.87h-7c-3.06 0-4.58 0-5.5-.87a3.83 3.83 0 01-1.22-1.3C2 17.56 2 16.03 2 13s0-4.59.88-5.69A3.83 3.83 0 014 6.01C4.92 5.14 6.44 5.14 9.5 5.14h0" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 10h-1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const VideoIcon = () => <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10l2.58-1.55a2 2 0 013.42 1.55v4a2 2 0 01-3.42 1.55L16 14M6.2 18h6.6c1.12 0 1.68 0 2.1-.22a2 2 0 001.1-1.1c.22-.42.22-1 .22-2.1V9.2c0-1.12 0-1.68-.22-2.1a2 2 0 00-1.1-1.1c-.42-.22-1-.22-2.1-.22H6.2c-1.12 0-1.68 0-2.1.22a2 2 0 00-1.1 1.1c-.22.42-.22 1-.22 2.1v3.6c0 1.12 0 1.68.22 2.1a2 2 0 001.1 1.1c.42.22 1 .22 2.1.22z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CloseIcon = () => <svg width="32px" height="32px" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg"><path d="M9 9l6 6m0-6l-6 6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" /></svg>;


const CameraUI = () => {
    const [mode, setMode] = useState('photo'); // 'photo' or 'video'
    const [isRecording, setIsRecording] = useState(false);
    const [preview, setPreview] = useState({ type: null, src: null });
    const [cameraFacingMode, setCameraFacingMode] = useState('user');

    // --- ฟังก์ชัน: ถ่ายภาพ ---
    const handleTakePhoto = () => {
        console.log("ACTION: Take Photo");
    };

    // --- ฟังก์ชัน: เริ่ม/หยุดถ่ายวิดีโอ ---
    const handleToggleRecording = () => {
        setIsRecording(prevState => !prevState);
    };

    const handleModeChange = (e) => {
        setMode(e.target.checked ? 'video' : 'photo');
        setIsRecording(false); // หยุดอัดเสมอเมื่อเปลี่ยนโหมด
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
                    {mode === 'photo' ? (
                        // 1. ปุ่มสำหรับโหมดถ่ายภาพ
                        <div
                            className="photo-button"
                            onClick={handleTakePhoto}
                            aria-label="Take Photo"
                        >
                            <div className="circle"></div>
                        </div>
                    ) : (
                        // 2. ปุ่มสำหรับโหมดวิดีโอ
                        <div
                            className={`record-button ${isRecording ? 'recording' : ''}`}
                            onClick={handleToggleRecording}
                            aria-label="Toggle Recording"
                        >
                            {/* 
                              ใช้ key={String(isRecording)} เพื่อบังคับให้ React
                              สร้าง .ring element ใหม่ทุกครั้งที่ isRecording เปลี่ยน
                              ซึ่งจะทำให้ animation เริ่มต้นใหม่จาก 0 เสมอ
                            */}
                            <div className="ring" key={String(isRecording)}>
                                <svg viewBox="0 0 32 32">
                                    <circle className="progress-ring" r="15" cx="16" cy="16" fill="transparent" transform="rotate(-90 16 16)" stroke="#FFFFFF" />
                                </svg>
                            </div>
                            <div className="inner-shape"></div>
                        </div>
                    )}

                    {/* ปุ่มสลับโหมด (ใช้โครงสร้างจากโค้ดเก่า) */}
                    <div id="switchButton" className="switch-button">
                        <label>
                            <span className="camera"><CameraIcon /></span>
                            <span className="video"><VideoIcon /></span>
                            <input
                                type="checkbox"
                                className="input"
                                id="toggleInput"
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