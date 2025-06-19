import React, { useState, useEffect, useRef } from 'react';
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';

// Import UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import LoadingScreen from '../LoadingScreen/LoadingScreen'; // Import หน้าโหลด
import CameraUI from '../CameraUI/CameraUI';

// Import Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';

const LOADING_DURATION = 8000; // 3 วินาที

const AROverlay = () => {
    // --- STATE MANAGEMENT ---
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [appState, setAppState] = useState('loading');

    // **[แก้ไข 1]** สร้าง ref ตัวเดียวเพื่อรับ handles จาก ARSuperDebug
    const arSystemRef = useRef(null);
    const presenterContainerRef = useRef(null);

    // **[แก้ไข 3 - เพิ่ม]** จัดการ State ของกล้องที่นี่ (Lifting State Up)
    const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' หรือ 'environment'

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppState('ready');
        }, LOADING_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // --- DATA & LOGIC ---
    // ข้อมูลรสชาติจาก ID ที่เราเลือก
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    return (
        <div className="ar-overlay">
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                cameraFacingMode={cameraFacingMode}
            />

            <div className="ui-layer visible">
                <FlavorSelector
                    selectedFlavorId={selectedFlavorId}
                    onSelectFlavor={setSelectedFlavorId}
                />
                <CameraUI
                    arSystemRef={arSystemRef}
                    presenterContainer={presenterContainerRef.current} // <-- ส่ง Element, ไม่ใช่ Ref Object
                    cameraFacingMode={cameraFacingMode}
                    onSwitchCamera={setCameraFacingMode}
                />
            </div>

            {appState === 'loading' && <LoadingScreen />}

        </div>
    );
};

export default AROverlay;