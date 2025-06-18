import React, { useState, useMemo } from 'react';
import './AROverlay.css';
import { AdvancedVideo, AdvancedImage } from '@cloudinary/react';
import { FLAVORS } from '../../data/flavors';
import { cld } from '../../utils/cloudinary';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import ARSuperDebug from '../Debug/ARSuperDebug';

/**
 AROverlay Component
 * ทำหน้าที่จัดการ UI ทั้งหมด
 * - จัดการ State การเลือกรสชาติ
 * - แสดงผลวิดีโอพรีเซนเตอร์
 * - แสดงผลปุ่มเลือกรสชาติ
 * - ส่งข้อมูลรสชาติที่เลือกไปยัง ARScene
 */
const AROverlay = () => {
    // --- STATE MANAGEMENT ---
    // State สำหรับเก็บ ID ของรสชาติที่ถูกเลือก
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);

    // --- DATA & LOGIC ---
    // หากข้อมูลรสชาติจาก ID ที่เราเลือก
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // สร้าง Cloudinary video object โดยใช้ useMemo
    const cldVideo = useMemo(() => {
        if (!selectedFlavor?.videoPublicId) return null;
        return cld.video(selectedFlavor.videoPublicId)
            .delivery(quality('auto'))
            .transcode(videoCodec(auto()));
    }, [selectedFlavor]);

    // สร้าง Cloudinary image object สำหรับโลโก้
    const cldLogo = useMemo(() => {
        return cld.image('TKO/MAMAOK/images/mama-logo.webp').delivery(quality('auto'));
    }, []);

    return (
        <div className="ar-overlay">
            {/* 
              Layer 1 & 2: AR Scene จัดการเองทั้งหมด
              - เราส่ง `selectedFlavor` ทั้ง object ลงไป
              - และส่ง callback `onCameraReady` ไปด้วย
            */}
            <ARSuperDebug
                selectedFlavor={selectedFlavor}
            />

            {/* 
              Layer 3: UI 2D ทั้งหมด
              - จะแสดงก็ต่อเมื่อกล้องพร้อมแล้ว (isCameraReady === true)
            */}
            <div className={`presenter-video-container`}>
                <AdvancedImage cldImg={cldLogo} alt="Client Logo" className="client-logo" />
                {cldVideo && (
                    <AdvancedVideo
                        key={selectedFlavor.id}
                        cldVid={cldVideo}
                        className="presenter-video"
                        autoPlay muted loop playsInline
                    />
                )}
            </div>

            <FlavorSelector
                selectedFlavorId={selectedFlavorId}
                onSelectFlavor={setSelectedFlavorId}
            />
        </div>
    );
};

export default AROverlay;