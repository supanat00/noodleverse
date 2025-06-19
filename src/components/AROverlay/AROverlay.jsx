import React, { useState, useMemo, useEffect, useRef } from 'react';
import './AROverlay.css';
import { AdvancedVideo, AdvancedImage } from '@cloudinary/react';
import { FLAVORS } from '../../data/flavors';
import { cld } from '../../utils/cloudinary';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";

// Import UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import LoadingScreen from '../LoadingScreen/LoadingScreen'; // Import หน้าโหลด
import CameraUI from '../CameraUI/CameraUI';

// Import Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';

const LOADING_DURATION = 8000; // 3 วินาที

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
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [appState, setAppState] = useState('loading');

    // **[แก้ไข 1]** สร้าง ref ตัวเดียวเพื่อรับ handles จาก ARSuperDebug
    const arSystemRef = useRef(null);

    // **[แก้ไข 3 - เพิ่ม]** จัดการ State ของกล้องที่นี่ (Lifting State Up)
    const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' หรือ 'environment'

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppState('ready');
        }, LOADING_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // --- DATA & LOGIC ---
    // ข้อมูลรสชาติจาก ID ที่เราเลือก
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
              - ส่ง `selectedFlavor` ทั้ง object ลงไป
              - และส่ง callback `onCameraReady` ไปด้วย
            */}
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                cameraFacingMode={cameraFacingMode}
            />

            {/* 
              Layer 2: UI 2D (วิดีโอ, ปุ่ม)
              - แสดงผลทันที แต่จะถูก LoadingScreen บังไว้ก่อน
            */}
            <div className="ui-layer visible"> {/* ใส่ class 'visible' ไปเลย */}
                <div className="presenter-video-container">
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
                <CameraUI
                    arSystemRef={arSystemRef}
                    cameraFacingMode={cameraFacingMode}
                    onSwitchCamera={setCameraFacingMode}
                />
            </div>

            {/* 
              Layer 3: Loading Screen (อยู่บนสุด)
              - จะแสดงผลก็ต่อเมื่อ appState ยังเป็น 'loading'
            */}
            {appState === 'loading' && <LoadingScreen />}
        </div>
    );
};

export default AROverlay;