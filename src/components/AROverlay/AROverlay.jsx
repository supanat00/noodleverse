// src/components/AROverlay/AROverlay.jsx (Final Simplified Version)

import React, { useState, useRef, useCallback } from 'react';
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';

// UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import CameraUI from '../CameraUI/CameraUI';
// Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';

const AROverlay = () => {
    // --- State ทั้งหมดกลับมาเป็นแบบดั้งเดิม ---
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');
    const arSystemRef = useRef(null);
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // --- ฟังก์ชัน Callback ไม่มีการเปลี่ยนแปลง ---
    const handleSelectFlavor = useCallback((id) => {
        setSelectedFlavorId(id);
    }, []);

    const handleSwitchCamera = useCallback((mode) => {
        setCameraFacingMode(mode);
    }, []);

    // --- ไม่ต้องมี State หรือ Function เกี่ยวกับ Permission ที่นี่แล้ว ---

    return (
        <div className="ar-overlay">
            {/* 
              เราสามารถ Render ARSuperDebug ได้เลย
              เพราะกว่าที่ AROverlay จะถูก Render, ผู้ใช้ก็ได้อนุญาตกล้องไปแล้ว
            */}
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                allFlavors={FLAVORS}
                cameraFacingMode={cameraFacingMode}
            // *** ไม่ต้องส่ง prop `shouldStartCamera` ลงไปแล้ว ***
            />
            <div className="ui-layer visible">
                <FlavorSelector
                    selectedFlavorId={selectedFlavorId}
                    onSelectFlavor={handleSelectFlavor}
                />
                <CameraUI
                    arSystemRef={arSystemRef}
                    cameraFacingMode={cameraFacingMode}
                    onSwitchCamera={handleSwitchCamera}
                />
            </div>
        </div>
    );
};

export default AROverlay;