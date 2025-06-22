/**
 * FlavorSelector.jsx
 * 
 * UI Component สำหรับแสดงรายการรสชาติให้ผู้ใช้เลือก
 * ถูกออกแบบมาให้เป็น "dumb component" ที่รับ props และเรียก callback กลับไปเท่านั้น
 */
import React from 'react';
import './FlavorSelector.css';

import { FLAVORS } from '../../data/flavors';
import iconCheckmark from '/assets/icons/checkmark.webp';

// --- Sub-Component: FlavorButton ---
// แยกปุ่มแต่ละอันออกมาเป็น component ของตัวเองเพื่อความสะอาดและจัดการง่าย
// ใช้ React.memo เพื่อป้องกันการ re-render หาก props (flavor, isActive) ไม่เปลี่ยนแปลง
const FlavorButton = React.memo(({ flavor, isActive, onSelect }) => {
    const handleClick = () => {
        onSelect(flavor.id);
    };

    return (
        <div
            className={`flavor-button-wrapper ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()} // Bonus: a11y improvement
            role="button"
            aria-pressed={isActive} // ใช้ aria-pressed จะสื่อความหมายดีกว่า aria-label
            aria-label={flavor.name}
            tabIndex={0}
        >
            <img
                src={flavor.iconSrc}
                alt={flavor.name}
                className="flavor-icon"
                loading="lazy"
                decoding="async" // บอก browser ให้ decode รูปใน background thread
            />
            {isActive && (
                <img
                    src={iconCheckmark}
                    alt="Selected"
                    className="checkmark-icon"
                    aria-hidden="true" // ซ่อนจาก screen reader เพราะสถานะถูกบอกด้วย aria-pressed แล้ว
                />
            )}
        </div>
    );
});

// --- Main Component: FlavorSelector ---
// Component หลักที่ทำหน้าที่ map data มา render เป็น FlavorButton
const FlavorSelector = ({ selectedFlavorId, onSelectFlavor }) => {
    return (
        <div className="flavor-selector-container">
            {FLAVORS.map((flavor) => (
                <FlavorButton
                    key={flavor.id}
                    flavor={flavor}
                    isActive={selectedFlavorId === flavor.id}
                    onSelect={onSelectFlavor}
                />
            ))}
        </div>
    );
};

// Export โดยห่อด้วย React.memo เพื่อให้ component นี้ไม่ re-render โดยไม่จำเป็น
export default React.memo(FlavorSelector);