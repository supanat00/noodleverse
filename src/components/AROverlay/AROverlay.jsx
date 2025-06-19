import React, { useState, useMemo, useEffect, useRef } from 'react';
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';

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
    const presenterContainerRef = useRef(null);

    // **[หัวใจของการแก้ไข]** State เพื่อรอให้ Ref พร้อม
    const [uiReady, setUiReady] = useState(false);

    // **[แก้ไข 3 - เพิ่ม]** จัดการ State ของกล้องที่นี่ (Lifting State Up)
    const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' หรือ 'environment'

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppState('ready');
        }, LOADING_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // Effect นี้จะทำงานหลังจากที่ Component ถูก Mount และ div ถูกผูกกับ Ref แล้ว
    useEffect(() => {
        if (presenterContainerRef.current) {
            // เมื่อ Ref พร้อม, ให้ตั้ง State เพื่อบังคับให้ re-render
            setUiReady(true);
        }
    }, []); // dependency ว่างเปล่า = ทำงานครั้งเดียวหลัง Mount

    // --- DATA & LOGIC ---
    // ข้อมูลรสชาติจาก ID ที่เราเลือก
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // สร้าง Cloudinary video object โดยใช้ useMemo
    const videoUrl = useMemo(() => {
        if (!selectedFlavor?.id) return null;
        // สร้าง path ไปยังไฟล์วิดีโอในโฟลเดอร์ public
        // **สำคัญ:** แก้ไขนามสกุลไฟล์ (.webp) ถ้าจำเป็น
        return `${selectedFlavor.videoPublicId}`;
    }, [selectedFlavor]);

    // const cldVideo = useMemo(() => {
    //     if (!selectedFlavor?.videoPublicId) return null;
    //     return cld.video(selectedFlavor.videoPublicId)
    //         .delivery(quality('auto'))
    //         .transcode(videoCodec(auto()));
    // }, [selectedFlavor]);

    // สร้าง Cloudinary image object สำหรับโลโก้
    const logoUrl = '/assets/images/mama-logo.webp';

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
                <div ref={presenterContainerRef} className="presenter-video-container">
                    <img
                        src={logoUrl}
                        alt="Client Logo"
                        className="client-logo"
                        // **สำคัญมาก:** ยังคงต้องใส่ crossOrigin เพื่อให้ html2canvas ทำงานได้
                        crossOrigin="anonymous"
                    />
                    {videoUrl && (
                        <video
                            key={selectedFlavor.id} // key ยังคงสำคัญเพื่อให้ React สร้าง element ใหม่เมื่อรสชาติเปลี่ยน
                            src={videoUrl}
                            className="presenter-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            // **สำคัญมาก:** ยังคงต้องใส่ crossOrigin เพื่อให้ html2canvas ทำงานได้
                            crossOrigin="anonymous"
                        />
                    )}
                </div>

                <FlavorSelector
                    selectedFlavorId={selectedFlavorId}
                    onSelectFlavor={setSelectedFlavorId}
                />
                {uiReady && (
                    <CameraUI
                        arSystemRef={arSystemRef}
                        presenterContainer={presenterContainerRef.current} // <-- ส่ง Element, ไม่ใช่ Ref Object
                        cameraFacingMode={cameraFacingMode}
                        onSwitchCamera={setCameraFacingMode}
                    />
                )}
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