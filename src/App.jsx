import { useState, useEffect } from 'react';
import './App.css';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AROverlay from './components/AROverlay/AROverlay';

const MINIMUM_LOADING_TIME = 3000; // 3 วินาที

function App() {
  const [appState, setAppState] = useState('loading');
  const [cameraStream, setCameraStream] = useState(null); // เรายังคงต้องใช้ State นี้

  useEffect(() => {
    let stream = null;
    let loadingTimer = null;

    // Task 1: ขออนุญาตกล้อง (เราต้องทำที่นี่ เพราะเป็นเงื่อนไขหลัก)
    const getCameraPermission = () => new Promise(async (resolve, reject) => {
      try {
        console.log("App.jsx: Requesting camera permission...");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        // เมื่อได้รับอนุญาตแล้ว ให้เก็บ stream ไว้ใน state
        setCameraStream(stream);
        console.log("App.jsx: Camera permission GRANTED.");
        resolve(stream); // ส่ง stream กลับไป
      } catch (err) {
        console.error("App.jsx: Camera permission DENIED.", err);
        // TODO: แสดง UI บอกผู้ใช้ว่าต้องอนุญาตกล้อง
        reject(err); // reject promise เพื่อหยุดการทำงาน
      }
    });

    // Task 2: Promise สำหรับหน่วงเวลา
    const minimumWait = () => new Promise(resolve => {
      loadingTimer = setTimeout(resolve, MINIMUM_LOADING_TIME);
    });

    // --- ใช้ Promise.all เพื่อรอให้ "ทั้งสองเงื่อนไข" สำเร็จ ---
    const initializeApp = async () => {
      try {
        console.log("App.jsx: Waiting for BOTH camera approval AND 3-second timer...");

        // รอให้ผู้ใช้กด Allow และรอให้ครบ 3 วินาที
        // อะไรเสร็จก่อน ก็จะรออีกอันหนึ่ง
        await Promise.all([
          getCameraPermission(),
          minimumWait()
        ]);

        console.log("App.jsx: All conditions met. App is ready!");
        // เมื่อทุกอย่างพร้อม, เปลี่ยน State เพื่อแสดง AROverlay
        setAppState('ready');

      } catch (error) {
        // จะเข้ามาที่นี่ถ้าผู้ใช้กด "Block"
        console.log("App.jsx: Initialization stopped due to an error (e.g., camera denied).");
        // แอปจะค้างอยู่ที่หน้า Loading Screen
      }
    };

    initializeApp();

    // Cleanup Function
    return () => {
      // หยุดการทำงานของกล้องเมื่อออกจากแอป
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // เคลียร์ timer เผื่อผู้ใช้ออกจากหน้าไปก่อน
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, []); // [] รันแค่ครั้งเดียว

  return (
    <div className="app-background">
      <div className="app-container">
        {/*
          - ถ้า state ยังไม่พร้อม (loading), แสดง LoadingScreen
          - ถ้า state เป็น 'ready', แสดง AROverlay และส่ง stream ที่พร้อมแล้วลงไป
        */}
        {appState !== 'ready' ? (
          <LoadingScreen />
        ) : (
          <AROverlay cameraStream={cameraStream} />
        )}
      </div>
    </div>
  );
}

export default App;