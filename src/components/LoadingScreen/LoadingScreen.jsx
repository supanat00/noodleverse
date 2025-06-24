import React, { useState } from 'react';
import './LoadingScreen.css';

// ใช้ AdvancedImage จาก Cloudinary เพื่อโหลดและแสดงภาพ
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary'; // ตัว cld ที่ตั้งค่าไว้แล้ว
import { quality } from '@cloudinary/url-gen/actions/delivery';

// สร้าง Cloudinary image objects ไว้นอก component เพื่อไม่ให้สร้างซ้ำเวลา re-render
const backgroundCldImage = cld.image('TKO/MAMAOK/images/ink.webp')
    .delivery(quality('auto')); // ปรับคุณภาพภาพให้อัตโนมัติ

const logoCldImage = cld.image('TKO/MAMAOK/images/mama-logo.webp')
    .delivery(quality('auto'));

/**
 * หน้าโหลดหลักของแอป
 * - แสดงภาพพื้นหลังและโลโก้
 * - ควบคุมการแสดงผลเนื้อหาหลังภาพพื้นหลังโหลดเสร็จ
 * - รับ prop progress เพื่อแสดงความคืบหน้าการโหลด
 * - รับ prop isFadingOut เพื่อใช้จัดการอนิเมชันตอนปิดหน้าโหลด
 */
const LoadingScreen = ({ isFadingOut, progress = 0 }) => {
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    // สร้างชื่อคลาสแบบไดนามิก เพื่อเพิ่มคลาส fading-out ตอนกำลังจะซ่อน
    const containerClassName = `loading-screen-container ${isFadingOut ? 'fading-out' : ''}`;

    // แปลง progress เป็นข้อความที่เข้าใจง่าย
    const getProgressText = () => {
        if (progress < 10) return "กำลังเริ่มต้น...";
        if (progress < 30) return "กำลังโหลด MediaPipe...";
        if (progress < 70) return "กำลังโหลดโมเดล 3D...";
        if (progress < 90) return "กำลังโหลดวิดีโอ...";
        return "เกือบเสร็จแล้ว...";
    };

    return (
        <div className={containerClassName}>

            {/* แสดงภาพพื้นหลัง */}
            <AdvancedImage
                cldImg={backgroundCldImage}
                alt="Background"
                className="loading-background-image"
                plugins={[
                    (img) => {
                        // รอจนภาพพื้นหลังโหลดเสร็จ แล้วตั้งสถานะ
                        img.addEventListener('load', () => {
                            setIsBgLoaded(true);
                        });
                        return () => {
                            img.removeEventListener('load');
                        };
                    }
                ]}
            />

            {/* เนื้อหาโลโก้และข้อความ จะโชว์เมื่อภาพพื้นหลังโหลดเสร็จ */}
            <div className={`loading-content ${isBgLoaded ? 'visible' : ''}`}>
                <AdvancedImage
                    cldImg={logoCldImage}
                    alt="Mama Logo"
                    className="loading-logo"
                />

                <div className="loading-text-container">
                    <p className="loading-text-main">กำลังเชื่อมต่อกับ</p>
                    <div className="loading-progress-container">
                        <div className="loading-progress-bar">
                            <div
                                className="loading-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="loading-progress-text">{getProgressText()}</p>
                    </div>
                    <p className="loading-text-sub">Ink Waruntorn</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
