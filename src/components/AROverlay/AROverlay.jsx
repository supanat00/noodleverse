// src/components/AROverlay/AROverlay.jsx (Final Simplified Version)

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';
import { isAndroid, isChrome } from 'react-device-detect';

// UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import CameraUI from '../CameraUI/CameraUI';
// Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';

const AROverlay = () => {
    // --- State ทั้งหมดกลับมาเป็นแบบดั้งเดิม ---
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');
    const [fallbackAdjustments, setFallbackAdjustments] = useState(false);
    const arSystemRef = useRef(null);
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // ตรวจสอบว่าเป็น Chrome บน Android หรือไม่
    const forceDisableTracking = useMemo(() => isAndroid && isChrome, []);

    // --- ฟังก์ชัน Callback ไม่มีการเปลี่ยนแปลง ---
    const handleSelectFlavor = useCallback((id) => {
        setSelectedFlavorId(id);
    }, []);

    const handleSwitchCamera = useCallback((mode) => {
        setCameraFacingMode(mode);
    }, []);

    // --- จัดการ fallback เมื่อการสลับกล้องล้มเหลว ---
    useEffect(() => {
        const handleCameraSwitchFailed = (event) => {
            const { requestedMode, fallbackMode } = event.detail;
            console.log(`🔄 AROverlay: Camera switch failed from ${requestedMode} to ${fallbackMode}`);
            setCameraFacingMode(fallbackMode);
            setFallbackAdjustments(true);
        };

        console.log("🎧 AROverlay: Adding cameraSwitchFailed event listener");
        window.addEventListener('cameraSwitchFailed', handleCameraSwitchFailed);

        return () => {
            console.log("🎧 AROverlay: Removing cameraSwitchFailed event listener");
            window.removeEventListener('cameraSwitchFailed', handleCameraSwitchFailed);
        };
    }, []);

    const showSparkle = useMemo(() => fallbackAdjustments || forceDisableTracking, [fallbackAdjustments, forceDisableTracking]);
    const sparkleClassName = useMemo(() => {
        if (!selectedFlavor || selectedFlavor.id === FLAVORS[0].id) {
            return '';
        }
        return 'wide';
    }, [selectedFlavor]);

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
            {/* AR Scene */}
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                allFlavors={FLAVORS}
                cameraFacingMode={cameraFacingMode}
                forceDisableTracking={forceDisableTracking}
                showSparkle={showSparkle}
                sparkleClassName={sparkleClassName}
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