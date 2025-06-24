import React, { useRef, useEffect, useState } from 'react';
import './PreviewModal.css';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { isIOS, isSafari } from '../../utils/deviceUtils';

// --- Cloudinary Assets (Pre-defined) ---
const backgroundCldImage = cld.image('TKO/MAMAOK/images/preview-bg.webp').delivery(quality('auto'));
const logoCldImage = cld.image('TKO/MAMAOK/images/mama-logo.webp').delivery(quality('auto'));

// --- Helper Component: Preloader ---
// Component นี้จะโหลดรูปภาพในเบื้องหลังและเรียก callback เมื่อเสร็จสิ้น
// แต่จะไม่แสดงผลอะไรออกมาเลย (null)
const ImagePreloader = ({ imageUrl, onLoaded }) => {
    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = onLoaded;
    }, [imageUrl, onLoaded]);
    return null;
};


/**
 * PreviewModal
 * 
 * Component ที่แสดงผลลัพธ์ (ภาพนิ่งหรือวิดีโอ) และจัดการ action ของผู้ใช้
 * - ปรับปรุง Layout ปุ่มใหม่เป็น 3 ปุ่ม
 * - แก้ปัญหา Asset โหลดช้าโดยใช้ Preloader และจัดการ State
 */
const PreviewModal = ({ preview, onRetry, onSave, onShare }) => {
    const videoRef = useRef(null);
    const [areAssetsReady, setAreAssetsReady] = useState(false);

    // --- Platform detection ---
    let isIOS_Safari = false;
    try {
        // เฉพาะ iOS (iPhone/iPad/iPod) หรือ Safari บน iOS เท่านั้น
        isIOS_Safari = isIOS() || (isSafari() && /iP(hone|od|ad)/.test(navigator.userAgent));
    } catch {
        isIOS_Safari = false; // fallback: แสดงปุ่มบันทึกเสมอ
    }

    // Effect จัดการการเล่นวิดีโอ (เหมือนเดิม)
    useEffect(() => {
        if (preview.type === 'video' && videoRef.current) {
            // บังคับให้เล่นอีกครั้งเมื่อ component แสดงผล
            videoRef.current.play().catch(error => {
                console.warn("Video autoplay was prevented on preview:", error);
            });
        }
    }, [preview.type, preview.src]);

    // Callback ที่จะถูกเรียกเมื่อภาพพื้นหลังโหลดเสร็จ
    const handleBackgroundLoaded = () => {
        // เมื่อพื้นหลังพร้อม เราก็พร้อมที่จะแสดง Modal ทั้งหมด
        setAreAssetsReady(true);
    };

    return (
        // เราจะใช้ "Preloader" เพื่อโหลดภาพพื้นหลังก่อน
        // และใช้ State `areAssetsReady` ควบคุมการแสดงผลของ Modal จริง
        <>
            <ImagePreloader
                imageUrl={backgroundCldImage.toURL()}
                onLoaded={handleBackgroundLoaded}
            />

            {/* Modal ทั้งหมดจะถูกซ่อนไว้ด้วย CSS จนกว่า areAssetsReady จะเป็น true */}
            <div
                className={`preview-modal ${areAssetsReady ? 'visible' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-heading"
            >
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
                    {/* เราจะใส่กรอบ (border) ให้กับ content โดยตรง แทนที่จะหวังพึ่ง frame */}
                    {preview.type === 'image' && (
                        <img
                            src={preview.src}
                            alt="Capture preview"
                            className="preview-content with-border"
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
                            className="preview-content with-border"
                        />
                    )}
                </div>

                {/* --- Layout ปุ่มแบบใหม่ --- */}
                <div className="preview-actions-container">
                    {isIOS_Safari ? (
                        // iOS/Safari: ปุ่มเดียว (แชร์)
                        <button className="preview-button secondary full-width" onClick={onShare}>
                            แชร์
                        </button>
                    ) : (
                        // ทุก platform อื่น: แยกปุ่มบันทึก/แชร์
                        <div className="preview-actions-top-row">
                            <button className="preview-button secondary" onClick={onSave}>
                                บันทึก
                            </button>
                            <button className="preview-button secondary" onClick={onShare}>
                                แชร์
                            </button>
                        </div>
                    )}
                    <button className="preview-button primary full-width" onClick={onRetry}>
                        เล่นอีกครั้ง
                    </button>
                </div>
            </div>
        </>
    );
};

export default React.memo(PreviewModal);