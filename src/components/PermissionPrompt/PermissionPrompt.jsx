import React from 'react';
import './PermissionPrompt.css';

const PermissionPrompt = ({ onGrant }) => {
    return (
        <div className="permission-prompt-overlay">
            <div className="permission-prompt-box">
                <h2>เปิดประสบการณ์ AR</h2>
                <p>แอปพลิเคชันนี้ต้องการเข้าถึงกล้องของคุณเพื่อใช้งานฟิลเตอร์ AR</p>
                <button className="permission-grant-button" onClick={onGrant}>
                    เริ่มต้นใช้งาน
                </button>
            </div>
        </div>
    );
};

export default PermissionPrompt;