import React from 'react';
import './FlavorSelector.css';

import { FLAVORS } from '../../data/flavors';
import iconCheckmark from '../../assets/icons/checkmark.png';

const FlavorSelector = ({ selectedFlavorId, onSelectFlavor }) => {
    return (
        <div className="flavor-selector-container">
            {FLAVORS.map((flavor) => {
                const isActive = selectedFlavorId === flavor.id;

                return (
                    <div
                        key={flavor.id}
                        className={`flavor-button-wrapper ${isActive ? 'active' : ''}`}
                        onClick={() => onSelectFlavor(flavor.id)}
                        role="button"
                        aria-label={`Select ${flavor.name}`}
                        tabIndex={0}
                    >
                        {/* ใช้ <img> โดยตรงเลย เพราะภาพ PNG มีพื้นหลังโปร่งใสและสีเทาอยู่แล้ว */}
                        <img
                            src={flavor.iconSrc}
                            alt={flavor.name}
                            className="flavor-icon"
                        />

                        {/* แสดงไอคอนติ๊กถูกซ้อนทับ ก็ต่อเมื่อปุ่มนี้ active */}
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