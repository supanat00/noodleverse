// src/components/PreviewModal/PreviewModal.jsx

import React, { useRef, useEffect, useCallback } from 'react';
import './PreviewModal.css'; // เราจะสร้างไฟล์ CSS นี้ด้วย
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary';
import { quality } from '@cloudinary/url-gen/actions/delivery';

// --- Cloudinary Assets ---
// การประกาศ asset นอก component เป็น practice ที่ดี เพราะมันไม่ต้องสร้างใหม่ทุกครั้งที่ render
const backgroundCldImage = cld.image('TKO/MAMAOK/images/preview-bg.webp').delivery(quality('auto'));
const logoCldImage = cld.image('TKO/MAMAOK/images/mama-logo.webp').delivery(quality('auto'));

/**
 * PreviewModal
 * 
 * Component ที่รับผิดชอบการแสดงผลลัพธ์ (ภาพนิ่งหรือวิดีโอ)
 * และจัดการ action ของผู้ใช้ (ลองใหม่, บันทึก/แชร์)
 */
const PreviewModal = ({ preview, onRetry, onSave }) => {
    // Ref สำหรับเข้าถึง video element โดยตรง (ถ้ามี)
    const videoRef = useRef(null);

    // Effect สำหรับจัดการการเล่นวิดีโออัตโนมัติเมื่อ element พร้อม
    useEffect(() => {
        if (preview.type === 'video' && videoRef.current) {
            videoRef.current.play().catch(error => {
                // จัดการกรณีที่ browser block autoplay (เช่น ไม่ได้ muted)
                console.warn("Autoplay was prevented:", error);
            });
        }
    }, [preview.type, preview.src]); // ทำงานใหม่เมื่อ src ของวิดีโอเปลี่ยน

    return (
        // ใช้ <div role="dialog"> และ aria-modal="true" เพื่อ accessibility ที่ดีขึ้น
        <div className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-heading">
            <AdvancedImage
                cldImg={backgroundCldImage}
                alt="" // decorative image
                className="preview-background-image"
            />

            <h2 id="preview-heading" className="visually-hidden">Content Preview</h2>

            <AdvancedImage
                cldImg={logoCldImage}
                alt="Brand Logo"
                className="preview-brand-logo"
            />

            <div className="preview-content-frame">
                {preview.type === 'image' && (
                    <img
                        src={preview.src}
                        alt="Capture preview"
                        className="preview-content"
                    />
                )}
                {preview.type === 'video' && (
                    <video
                        ref={videoRef}
                        src={preview.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="preview-content"
                    />
                )}
            </div>

            <div className="preview-actions">
                <button className="preview-button retry" onClick={onRetry}>
                    เล่นอีกครั้ง
                </button>
                <button className="preview-button save" onClick={onSave}>
                    บันทึก
                </button>
            </div>
        </div>
    );
};

// ใช้ React.memo เพราะ Modal นี้ไม่ควร re-render นอกจาก props จะเปลี่ยนจริงๆ
export default React.memo(PreviewModal);