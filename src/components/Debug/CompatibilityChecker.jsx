import React, { useState, useEffect, useRef } from 'react';
import deviceCompatibility from '../../utils/deviceCompatibility';
import adaptiveFaceService from '../../services/adaptiveFaceService';
import './CompatibilityChecker.css';

const CompatibilityChecker = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [serviceInfo, setServiceInfo] = useState(null);
    const containerRef = useRef(null);

    const runCheck = async () => {
        setIsChecking(true);
        setError(null);

        try {
            const compatibilityResults = await deviceCompatibility.runFullCompatibilityCheck();
            const troubleshootingReport = deviceCompatibility.generateTroubleshootingReport(compatibilityResults);

            setResults({
                compatibility: compatibilityResults,
                troubleshooting: troubleshootingReport
            });

            // ตรวจสอบ service ที่ใช้อยู่
            const currentServiceInfo = adaptiveFaceService.getServiceInfo();
            setServiceInfo(currentServiceInfo);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        // ตรวจสอบ service ที่ใช้อยู่ทันที
        const currentServiceInfo = adaptiveFaceService.getServiceInfo();
        setServiceInfo(currentServiceInfo);
    }, []);

    useEffect(() => {
        // Scroll to bottom when results are shown
        if (results && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [results]);

    const getStatusIcon = (supported) => {
        return supported ? '✅' : '❌';
    };

    const getStatusColor = (supported) => {
        return supported ? '#4CAF50' : '#F44336';
    };

    // --- Manual Service Switcher ---
    const handleServiceChange = async (e) => {
        const newService = e.target.value;
        await adaptiveFaceService.forceService(newService);
        setServiceInfo(adaptiveFaceService.getServiceInfo());
    };

    if (!results && !isChecking) {
        return (
            <div className="compatibility-modal">
                <div className="flex-content" ref={containerRef}>
                    <div className="compatibility-checker">
                        <div className="compatibility-checker-header">
                            <span className="compatibility-checker-title">🔍 Device Compatibility Checker</span>
                        </div>
                        <p className="compatibility-checker-desc">ตรวจสอบความเข้ากันได้ของอุปกรณ์และ browser</p>
                        {serviceInfo && (
                            <div className="current-service-info">
                                <div className="current-service-header">🎯 Current Face Detection Service</div>
                                <div className="current-service-status-row">
                                    <span className="current-service-label">Status:</span>
                                    <span className="current-service-value">{serviceInfo.status}</span>
                                </div>
                                {serviceInfo.service && (
                                    <div className="current-service-status-row">
                                        <span className="current-service-label">Service:</span>
                                        <span className="current-service-value">{serviceInfo.service.toUpperCase()}</span>
                                    </div>
                                )}
                                <div className="service-switcher-row">
                                    <label htmlFor="service-switcher" className="service-switcher-label">เปลี่ยน Service (debug/เทส):</label>
                                    <select id="service-switcher" value={serviceInfo.service} onChange={handleServiceChange} className="service-switcher-select">
                                        <option value="mediapipe">MediaPipe</option>
                                        <option value="tensorflow">TensorFlow.js</option>
                                        <option value="none">None (ปิดระบบจับหน้า)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="compatibility-divider" />
                    </div>
                </div>
                <div className="flex-footer">
                    <button
                        onClick={runCheck}
                        className="check-button"
                        disabled={isChecking}
                    >
                        {isChecking ? 'กำลังตรวจสอบ...' : 'เริ่มตรวจสอบ'}
                    </button>
                </div>
            </div>
        );
    }

    if (isChecking) {
        return (
            <div className="compatibility-modal">
                <div className="flex-content" ref={containerRef}>
                    <h3>🔍 Device Compatibility Checker</h3>
                    <div className="checking-status">
                        <div className="spinner"></div>
                        <p>กำลังตรวจสอบความเข้ากันได้...</p>
                    </div>
                </div>
                <div className="flex-footer">
                    <button
                        onClick={runCheck}
                        className="check-button"
                        disabled={isChecking}
                    >
                        {isChecking ? 'กำลังตรวจสอบ...' : 'เริ่มตรวจสอบ'}
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="compatibility-modal">
                <div className="flex-content" ref={containerRef}>
                    <h3>🔍 Device Compatibility Checker</h3>
                    <div className="error-message">
                        <p>❌ เกิดข้อผิดพลาด: {error}</p>
                        <button onClick={runCheck} className="retry-button">
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                </div>
                <div className="flex-footer">
                    <button
                        onClick={runCheck}
                        className="check-button"
                        disabled={isChecking}
                    >
                        {isChecking ? 'กำลังตรวจสอบ...' : 'เริ่มตรวจสอบ'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="compatibility-modal">
            <div className="flex-content" ref={containerRef}>
                <h3>🔍 Device Compatibility Checker</h3>

                {/* Overall Status */}
                <div className="overall-status">
                    <h4>📊 Overall Status</h4>
                    <div className={`status-badge ${results.troubleshooting.overallStatus.toLowerCase()}`}>
                        {results.troubleshooting.overallStatus === 'FULLY_COMPATIBLE' ? '✅ Fully Compatible' : '⚠️ Has Issues'}
                    </div>
                </div>

                {/* Device Information */}
                <div className="section">
                    <h4>📱 Device Information</h4>
                    <div className="info-grid">
                        <div>Platform: {results.compatibility.deviceInfo.platform}</div>
                        <div>Mobile: {results.compatibility.deviceInfo.isMobile ? 'Yes' : 'No'}</div>
                        <div>Android: {results.compatibility.deviceInfo.isAndroid ? 'Yes' : 'No'}</div>
                        <div>iOS: {results.compatibility.deviceInfo.isIOS ? 'Yes' : 'No'}</div>
                        <div>Samsung: {results.compatibility.deviceInfo.isSamsung ? 'Yes' : 'No'}</div>
                        <div>Chrome: {results.compatibility.deviceInfo.isChrome ? 'Yes' : 'No'}</div>
                        <div>Safari: {results.compatibility.deviceInfo.isSafari ? 'Yes' : 'No'}</div>
                    </div>
                </div>

                {/* WebGL Support */}
                <div className="section">
                    <h4>🎮 WebGL Support</h4>
                    <div className="status-item" style={{ color: getStatusColor(results.compatibility.webgl.supported) }}>
                        <span>{getStatusIcon(results.compatibility.webgl.supported)}</span>
                        <span>{results.compatibility.webgl.supported ? 'Supported' : 'Not Supported'}</span>
                    </div>
                    {results.compatibility.webgl.supported && (
                        <div className="details">
                            <div>Vendor: {results.compatibility.webgl.vendor}</div>
                            <div>Renderer: {results.compatibility.webgl.renderer}</div>
                            <div>Version: {results.compatibility.webgl.version}</div>
                        </div>
                    )}
                    {!results.compatibility.webgl.supported && (
                        <div className="error-details">
                            <div>Reason: {results.compatibility.webgl.reason}</div>
                            <div>Details: {results.compatibility.webgl.details}</div>
                        </div>
                    )}
                </div>

                {/* MediaPipe Compatibility */}
                <div className="section">
                    <h4>📱 MediaPipe Compatibility</h4>
                    <div className="status-item" style={{ color: getStatusColor(results.compatibility.mediapipe.supported) }}>
                        <span>{getStatusIcon(results.compatibility.mediapipe.supported)}</span>
                        <span>{results.compatibility.mediapipe.supported ? 'Compatible' : 'Not Compatible'}</span>
                    </div>
                    {!results.compatibility.mediapipe.supported && (
                        <div className="error-details">
                            <div>Reason: {results.compatibility.mediapipe.reason}</div>
                            <div>Details: {results.compatibility.mediapipe.details}</div>
                        </div>
                    )}
                </div>

                {/* TensorFlow.js Compatibility */}
                <div className="section">
                    <h4>🧠 TensorFlow.js Compatibility</h4>
                    <div className="status-item" style={{ color: getStatusColor(results.compatibility.tensorflow.supported) }}>
                        <span>{getStatusIcon(results.compatibility.tensorflow.supported)}</span>
                        <span>{results.compatibility.tensorflow.supported ? 'Compatible' : 'Not Compatible'}</span>
                    </div>
                    {results.compatibility.tensorflow.supported && (
                        <div className="details">
                            <div>Backend: {results.compatibility.tensorflow.backend}</div>
                        </div>
                    )}
                    {!results.compatibility.tensorflow.supported && (
                        <div className="error-details">
                            <div>Reason: {results.compatibility.tensorflow.reason}</div>
                            <div>Details: {results.compatibility.tensorflow.details}</div>
                        </div>
                    )}
                </div>

                {/* Camera Access */}
                <div className="section">
                    <h4>📷 Camera Access</h4>
                    <div className="status-item" style={{ color: getStatusColor(results.compatibility.camera.supported) }}>
                        <span>{getStatusIcon(results.compatibility.camera.supported)}</span>
                        <span>{results.compatibility.camera.supported ? 'Available' : 'Not Available'}</span>
                    </div>
                    {!results.compatibility.camera.supported && (
                        <div className="error-details">
                            <div>Reason: {results.compatibility.camera.reason}</div>
                            <div>Error: {results.compatibility.camera.errorName}</div>
                            <div>Details: {results.compatibility.camera.details}</div>
                        </div>
                    )}
                </div>

                {/* Performance */}
                <div className="section">
                    <h4>⚡ Performance</h4>
                    <div className="info-grid">
                        <div>Device Memory: {results.compatibility.performance.deviceMemory} GB</div>
                        <div>CPU Cores: {results.compatibility.performance.hardwareConcurrency}</div>
                        {results.compatibility.performance.connection !== 'Unknown' && (
                            <>
                                <div>Connection: {results.compatibility.performance.connection.effectiveType}</div>
                                <div>Speed: {results.compatibility.performance.connection.downlink} Mbps</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Troubleshooting */}
                {results.troubleshooting.issues.length > 0 && (
                    <div className="section troubleshooting">
                        <h4>⚠️ Issues Found</h4>
                        <ul>
                            {results.troubleshooting.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {results.troubleshooting.recommendations.length > 0 && (
                    <div className="section recommendations">
                        <h4>💡 Recommendations</h4>
                        <ul>
                            {results.troubleshooting.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Current Service Info */}
                {serviceInfo && (
                    <div className="section">
                        <h4>🎯 Current Face Detection Service</h4>
                        <div className="info-grid">
                            <div>Status: {serviceInfo.status}</div>
                            {serviceInfo.service && <div>Service: {serviceInfo.service.toUpperCase()}</div>}
                            {serviceInfo.timestamp && <div>Timestamp: {new Date(serviceInfo.timestamp).toLocaleString()}</div>}
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <label htmlFor="service-switcher" style={{ fontWeight: 'bold', color: '#ffd700' }}>เปลี่ยน Service ด้วยตนเอง (สำหรับ debug/เทส): </label>
                            <select id="service-switcher" value={serviceInfo.service} onChange={handleServiceChange} style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 4 }}>
                                <option value="mediapipe">MediaPipe</option>
                                <option value="tensorflow">TensorFlow.js</option>
                                <option value="none">None (ปิดระบบจับหน้า)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-footer">
                <button
                    onClick={runCheck}
                    className="check-button"
                    disabled={isChecking}
                >
                    {isChecking ? 'กำลังตรวจสอบ...' : 'เริ่มตรวจสอบ'}
                </button>
            </div>
        </div>
    );
};

export default CompatibilityChecker; 