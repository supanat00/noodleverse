import { useState, useEffect } from 'react';
import './App.css';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AROverlay from './components/AROverlay/AROverlay';

// Import เครื่องมือ Cloudinary และข้อมูล
import { FLAVORS } from './data/flavors';
import { cld } from './utils/cloudinary';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";

const MINIMUM_LOADING_TIME = 3000; // กำหนดเวลาขั้นต่ำที่หน้าโหลดจะแสดง (3000ms = 3 วินาที)

function App() {
  const [appState, setAppState] = useState('loading');
  const [cameraStream, setCameraStream] = useState(null);

  useEffect(() => {
    let stream = null;

    // --- สร้างฟังก์ชันสำหรับแต่ละ Task ที่ต้องรอ ---

    // Task 1: ขออนุญาตกล้อง (เหมือนเดิม)
    const getCameraPermission = () => new Promise(async (resolve, reject) => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        setCameraStream(stream);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    // Task 2: โหลดวิดีโอตัวแรก (เหมือนเดิม)
    const preloadFirstVideo = () => new Promise((resolve, reject) => {
      const firstFlavor = FLAVORS[0];
      if (!firstFlavor?.videoPublicId) return reject(new Error("No first video."));

      const video = cld.video(firstFlavor.videoPublicId).delivery(quality('auto')).transcode(videoCodec(auto()));
      const videoEl = document.createElement('video');
      videoEl.src = video.toURL();
      videoEl.onloadeddata = resolve;
      videoEl.onerror = reject;
    });

    // ** Task 3 (ใหม่!): Promise สำหรับหน่วงเวลา **
    const minimumWait = () => new Promise(resolve => {
      setTimeout(resolve, MINIMUM_LOADING_TIME);
    });

    // --- ใช้ Promise.all เพื่อรอให้ทุกอย่างเสร็จ ---
    const initializeApp = async () => {
      try {
        console.log("Initialization started...");

        // รอให้ Task ทั้ง 3 อย่างสำเร็จพร้อมกัน
        await Promise.all([
          getCameraPermission(),
          preloadFirstVideo(),
          minimumWait() // เพิ่ม Timer Promise เข้าไป
        ]);

        console.log("All tasks completed. Transitioning...");
        setAppState('transitioning');
        setTimeout(() => {
          setAppState('ready');
        }, 500); // เวลาสำหรับ fade out animation

      } catch (error) {
        console.error("Initialization failed:", error);
        // TODO: แสดงหน้า Error
      }
    };

    initializeApp();

    // --- Cleanup Function ---
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // JSX ที่เหลือเหมือนเดิมทุกประการ
  return (
    <div className="app-background">
      <div className="app-container">
        <div className={`ar-overlay-wrapper ${appState === 'ready' ? 'visible' : ''}`}>
          <AROverlay cameraStream={cameraStream} />
        </div>
        {appState !== 'ready' && (
          <LoadingScreen isFadingOut={appState === 'transitioning'} />
        )}
      </div>
    </div>
  );
}

export default App;