import React, { useState, useMemo, useRef, useEffect } from 'react';
import './AROverlay.css';

// STEP 1: IMPORT เครื่องมือและ Components ที่จำเป็น
// ===============================================

// Components จาก Cloudinary React SDK
import { AdvancedVideo, AdvancedImage } from '@cloudinary/react';

// Hook เปิดกล้องของเรา
import { useUserCamera } from '../../hooks/useUserCamera';

// "ฐานข้อมูล" รสชาติ
import { FLAVORS } from '../../data/flavors';

// Instance ของ Cloudinary ที่เราตั้งค่าไว้
import { cld } from '../../utils/cloudinary';

// ตัวช่วยสร้าง Transformation จาก SDK
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";

// ** ลบ FlavorSelector ชั่วคราวออกไป แล้ว import ตัวจริงเข้ามา **
import FlavorSelector from '../FlavorSelector/FlavorSelector';


/**
 * AROverlay Component
 * 
 * หน้าจอหลักที่แสดงผลวิดีโอพรีเซนเตอร์ (จาก Cloudinary)
 * ซ้อนทับอยู่บนภาพจากกล้องของผู้ใช้
 */
const AROverlay = () => {
    // --- STATE MANAGEMENT ---
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [isCameraReady, setIsCameraReady] = useState(false);

    // --- REFS ---
    const userCameraCanvasRef = useRef(null);
    // presenterVideoRef ไม่จำเป็นต้องใช้แล้ว เพราะ AdvancedVideo จัดการ ref ภายในเอง

    // --- HOOKS ---
    const userCameraVideo = useUserCamera();

    useEffect(() => {
        // โค้ดวาดภาพลง Canvas ยังคงเหมือนเดิม
        if (userCameraVideo && userCameraCanvasRef.current) {
            const canvas = userCameraCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const video = userCameraVideo;
            let animationFrameId;

            const drawToCanvas = () => {
                if (!isCameraReady) setIsCameraReady(true);

                if (canvas.width !== video.videoWidth) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();
                animationFrameId = requestAnimationFrame(drawToCanvas);
            };
            drawToCanvas();
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [userCameraVideo, isCameraReady]);

    // --- DATA & LOGIC ---
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // สร้าง Cloudinary video object โดยใช้ useMemo
    const cldVideo = useMemo(() => {
        if (!selectedFlavor?.videoPublicId) return null;
        return cld.video(selectedFlavor.videoPublicId)
            .delivery(quality('auto'))
            .transcode(videoCodec(auto()));
    }, [selectedFlavor]);

    // สร้าง Cloudinary image object สำหรับโลโก้
    const cldLogo = cld.image('TKO/MAMAOK/images/mama-logo.webp')
        .delivery(quality('auto'));


    // --- RENDER ---
    return (
        <div className="ar-overlay">
            <canvas ref={userCameraCanvasRef} className="user-camera-feed" />

            <div className={`presenter-video-container ${isCameraReady ? 'visible' : ''}`}>

                {/* ใช้ <AdvancedImage> เพื่อแสดงโลโก้ */}
                <AdvancedImage cldImg={cldLogo} alt="Client Logo" className="client-logo" />

                {/* ใช้ <AdvancedVideo> เพื่อแสดงวิดีโอ */}
                {cldVideo && (
                    <AdvancedVideo
                        key={selectedFlavor.id} // key ยังคงสำคัญมาก!
                        cldVid={cldVideo}
                        className="presenter-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                )}
            </div>

            {/* 
              ** เรียกใช้งาน FlavorSelector Component จริงๆ ที่นี่ **
              - ส่ง state และ function ที่จำเป็นลงไปเป็น props
            */}
            {isCameraReady && (
                <FlavorSelector
                    selectedFlavorId={selectedFlavorId}
                    onSelectFlavor={setSelectedFlavorId}
                />
            )}
        </div>
    );
};

export default AROverlay;