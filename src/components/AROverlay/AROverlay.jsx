// src/components/AROverlay/AROverlay.jsx (Final Simplified Version)

import React, { useState, useRef, useCallback, useEffect } from 'react';
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';

// UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import CameraUI from '../CameraUI/CameraUI';
// Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';
import CompatibilityChecker from '../Debug/CompatibilityChecker';

const AROverlay = () => {
    // --- State ทั้งหมดกลับมาเป็นแบบดั้งเดิม ---
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');
    const [showCompatibilityChecker, setShowCompatibilityChecker] = useState(false);
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

    // Preload all presenter videos (hidden)
    useEffect(() => {
        FLAVORS.forEach(flavor => {
            const id = `preload-video-${flavor.id}`;
            if (!document.getElementById(id)) {
                const vid = document.createElement('video');
                vid.id = id;
                vid.src = flavor.videoUrl || flavor.videoPublicId || '';
                vid.preload = 'auto';
                vid.style.display = 'none';
                document.body.appendChild(vid);
            }
        });
        return () => {
            FLAVORS.forEach(flavor => {
                const vid = document.getElementById(`preload-video-${flavor.id}`);
                if (vid) vid.remove();
            });
        };
    }, []);

    return (
        <div className="ar-overlay">
            {/* Compatibility Checker Toggle Button */}
            <button
                className="compatibility-toggle-btn-main"
                onClick={() => setShowCompatibilityChecker(!showCompatibilityChecker)}
                title="ตรวจสอบความเข้ากันได้ของอุปกรณ์"
            >
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="#000" strokeWidth="2" />
                    <line x1="17" y1="17" x2="21" y2="21" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {/* Compatibility Checker Modal */}
            {showCompatibilityChecker && (
                <div className="compatibility-modal-overlay">
                    <div className="compatibility-modal">
                        <CompatibilityChecker />
                    </div>
                </div>
            )}

            {/* AR Scene */}
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                allFlavors={FLAVORS}
                cameraFacingMode={cameraFacingMode}
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