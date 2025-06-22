/**
 * AROverlay.jsx
 * 
 * Controller หลักสำหรับหน้า AR ทำหน้าที่จัดการ state ของแอป
 * และเป็นตัวกลางเชื่อมระหว่าง UI components กับ AR Scene
 */
import React, { useState, useRef, useCallback } from 'react'; // 1. import useCallback
import './AROverlay.css';
import { FLAVORS } from '../../data/flavors';

// UI Components
import FlavorSelector from '../FlavorSelector/FlavorSelector';
import CameraUI from '../CameraUI/CameraUI';

// Scene Components
import ARSuperDebug from '../Debug/ARSuperDebug';

const AROverlay = () => {
    const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVORS[0].id);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');
    const arSystemRef = useRef(null);
    const selectedFlavor = FLAVORS.find(flavor => flavor.id === selectedFlavorId);

    // 2. ห่อฟังก์ชันที่ส่งเป็น props ด้วย useCallback
    // ฟังก์ชันนี้จะถูก "จำ" ไว้ และจะไม่ถูกสร้างใหม่ทุกครั้งที่ re-render
    // ทำให้ child component ที่ใช้ React.memo ไม่ re-render โดยไม่จำเป็น
    const handleSelectFlavor = useCallback((id) => {
        setSelectedFlavorId(id);
    }, []); // Dependency array ว่าง หมายถึง สร้างฟังก์ชันนี้แค่ครั้งแรกครั้งเดียว

    const handleSwitchCamera = useCallback((mode) => {
        setCameraFacingMode(mode);
    }, []);

    return (
        <div className="ar-overlay">
            <ARSuperDebug
                ref={arSystemRef}
                selectedFlavor={selectedFlavor}
                cameraFacingMode={cameraFacingMode}
            />
            <div className="ui-layer visible">
                {/* 3. ส่งฟังก์ชันที่ผ่านการ memoized แล้วไปเป็น props */}
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

// **อย่าลืม!** ไปที่ไฟล์ FlavorSelector.jsx และ CameraUI.jsx
// แล้วห่อ export default ด้วย React.memo ด้วยนะครับ
// export default React.memo(FlavorSelector);
// export default React.memo(CameraUI);

export default AROverlay;