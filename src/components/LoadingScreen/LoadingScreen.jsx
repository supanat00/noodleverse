import React, { useState } from 'react';
import './LoadingScreen.css';

// 1. Import เครื่องมือที่จำเป็นจาก Cloudinary
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary'; // Import instance ที่เราตั้งค่าไว้
import { quality } from '@cloudinary/url-gen/actions/delivery';

// 2. สร้าง Cloudinary Image Objects
//    เราจะสร้าง object นอก component เพื่อไม่ให้มันถูกสร้างใหม่ทุกครั้งที่ re-render
const backgroundCldImage = cld.image('TKO/MAMAOK/images/ink.webp')
    .delivery(quality('auto')); // เพิ่ม transformation เพื่อ optimize

const logoCldImage = cld.image('TKO/MAMAOK/images/mama-logo.webp')
    .delivery(quality('auto'));


/**
 * LoadingScreen Component
 * - ใช้ <AdvancedImage> เพื่อแสดงผลภาพจาก Cloudinary
 * - จัดการสถานะการโหลดของภาพพื้นหลังอย่างถูกต้อง
 */
const LoadingScreen = ({ isFadingOut }) => { // อย่าลืมรับ prop isFadingOut ที่ส่งมาจาก App.jsx
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    // สร้าง className แบบไดนามิกสำหรับ fade out
    const containerClassName = `loading-screen-container ${isFadingOut ? 'fading-out' : ''}`;

    return (
        // ใช้ className ที่สร้างขึ้น
        <div className={containerClassName}>

            {/* 3. ใช้ <AdvancedImage> และส่ง object ผ่าน prop 'cldImg' */}
            <AdvancedImage
                cldImg={backgroundCldImage} // <<-- ใช้ cldImg
                alt="Background"
                className="loading-background-image"
                // 4. เพิ่ม plugin 'responsive' และ 'placeholder' เพื่อประสบการณ์ที่ดีขึ้น
                plugins={[
                    (img) => {
                        // นี่คือวิธีที่ถูกต้องในการใช้ onLoad กับ AdvancedImage
                        img.addEventListener('load', () => {
                            setIsBgLoaded(true);
                        });
                        return () => { // cleanup function
                            img.removeEventListener('load');
                        };
                    }
                ]}
            />

            <div className={`loading-content ${isBgLoaded ? 'visible' : ''}`}>
                <AdvancedImage
                    cldImg={logoCldImage} // <<-- ใช้ cldImg
                    alt="Mama Logo"
                    className="loading-logo"
                />

                <div className="loading-text-container">
                    <p className="loading-text-main">กำลังเชื่อมต่อกับ</p>
                    <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                    <p className="loading-text-sub">Ink Waruntorn</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;