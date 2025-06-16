import React from 'react';
import './FlavorSelector.css';

// Import "ฐานข้อมูล" และไอคอนติ๊กถูกเท่านั้น
import { FLAVORS } from '../../data/flavors';
import iconCheckmark from '../../assets/icons/checkmark.png';

/**
 * FlavorSelector Component
 * แสดงผลปุ่มเลือกรสชาติโดยดึงข้อมูลทั้งหมดมาจาก FLAVORS array
 */
const FlavorSelector = ({ selectedFlavorId, onSelectFlavor }) => {
    return (
        <div className="flavor-selector-container">
            {FLAVORS.map((flavor) => {
                const isActive = selectedFlavorId === flavor.id;

                return (
                    <div
                        key={flavor.id}
                        // เราจะเปลี่ยนชื่อ class นิดหน่อยเพื่อให้สื่อความหมายมากขึ้น
                        className={`flavor-button-wrapper ${isActive ? 'active' : ''}`}
                        onClick={() => onSelectFlavor(flavor.id)}
                        role="button"
                        aria-label={`Select ${flavor.name}`}
                        tabIndex={0}
                    >
                        {/* 
              ไอคอนรสชาติ เราจะใช้ <img> โดยตรงเลย
              เพราะภาพ PNG ของคุณมีพื้นหลังโปร่งใสและสีเทาอยู่แล้ว
            */}
                        <img
                            src={flavor.iconSrc}
                            alt={flavor.name}
                            className="flavor-icon"
                        />

                        {/* 
              แสดงไอคอนติ๊กถูกซ้อนทับ ก็ต่อเมื่อปุ่มนี้ active 
            */}
                        {isActive && (
                            <img
                                src={iconCheckmark}
                                alt="Selected"
                                className="checkmark-icon"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FlavorSelector;