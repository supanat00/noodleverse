import { useState, useEffect } from 'react';
import './App.css';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AROverlay from './components/AROverlay/AROverlay';

// Import ข้อมูลและเครื่องมือที่จำเป็นสำหรับการ Preload
import { FLAVORS } from './data/flavors';
import { cld } from './utils/cloudinary';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { videoCodec } from "@cloudinary/url-gen/actions/transcode";
import { auto } from "@cloudinary/url-gen/qualifiers/videoCodec";

const MINIMUM_LOADING_TIME = 3000; // 3 วินาที

/**
 * App.jsx
 * - จัดการ State หลักของแอป: loading, assetsReady, cameraReady, transitioning, ready
 * - Preload Assets และหน่วงเวลา
 * - รอสัญญาณว่ากล้องพร้อมจาก AROverlay
 * - ควบคุมการ Transition ระหว่างหน้า
 */
function App() {
  const [appState, setAppState] = useState('loading');

  useEffect(() => {
    // --- สร้างฟังก์ชันสำหรับแต่ละ Task ที่ต้องรอ ---

    // Task 1: โหลด Assets (วิดีโอและโมเดล)
    const preloadAssets = () => {
      const preloadFirstVideo = new Promise((resolve) => {
        const firstFlavor = FLAVORS[0];
        if (!firstFlavor?.videoPublicId) return resolve();
        const video = cld.video(firstFlavor.videoPublicId).delivery(quality('auto')).transcode(videoCodec(auto()));
        const videoEl = document.createElement('video');
        videoEl.src = video.toURL();
        videoEl.onloadeddata = resolve;
        videoEl.onerror = () => {
          console.error("Failed to preload video, but continuing.");
          resolve();
        };
      });

      const preloadFirstModel = new Promise((resolve) => {
        const firstFlavor = FLAVORS[0];
        if (!firstFlavor?.modelSrc) return resolve();
        fetch(firstFlavor.modelSrc)
          .then(res => res.ok ? resolve() : resolve())
          .catch(() => {
            console.error("Failed to preload model, but continuing.");
            resolve();
          });
      });

      return Promise.all([preloadFirstVideo, preloadFirstModel]);
    };

    // Task 2: Promise สำหรับหน่วงเวลา
    const minimumWait = () => new Promise(resolve => {
      setTimeout(resolve, MINIMUM_LOADING_TIME);
    });

    // --- ใช้ Promise.all เพื่อรอให้ Asset และ Timer เสร็จ ---
    const initializeApp = async () => {
      try {
        console.log("Preloading assets and waiting for minimum time...");

        // เราจะรอแค่ 2 อย่างนี้ก่อน
        await Promise.all([
          preloadAssets(),
          minimumWait()
        ]);

        console.log("Assets preloaded and minimum time has passed. App is ready to show AR.");
        // เปลี่ยน state เป็น 'ready' เพื่อเริ่ม render AROverlay
        setAppState('ready');

      } catch (error) {
        console.error("Initialization failed:", error);
        // แม้จะพลาด ก็ยังพยายามเปิดแอป
        setAppState('ready');
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="app-background">
      <div className="app-container">

        {appState === 'loading' && <LoadingScreen />}

        {appState === 'ready' && <AROverlay />}

      </div>
    </div>
  );
}

export default App;