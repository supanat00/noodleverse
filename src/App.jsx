// App.jsx (New Flow: Permission First, then Preload)
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PermissionPrompt from './components/PermissionPrompt/PermissionPrompt'; // 1. Import PermissionPrompt
import { FLAVORS } from './data/flavors';

// import preload modules
import mediaPipeService from './services/mediaPipeService'

import { preloadGLTF } from './utils/preloadGLTF';
import { preloadVideo } from './utils/preloadVideo';

// React.lazy ยังคงใช้เหมือนเดิม
const AROverlay = React.lazy(() => import('./components/AROverlay/AROverlay'));

function App() {
  // 2. สร้าง State ใหม่สำหรับจัดการ Flow ทั้งหมด
  const [appState, setAppState] = useState('requesting_permission'); // 'requesting_permission' | 'loading' | 'ready'
  const [error, setError] = useState(null);

  const startPreloading = useCallback(async () => {
    try {
      console.log("Preloading all assets SEQUENTIALLY to save memory...");
      setAppState('loading');

      const MINIMUM_LOADING_TIME = 5000;
      const timerPromise = new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME));

      // ✨ --- ส่วนที่แก้ไข --- ✨
      const assetsLoadingPromise = (async () => {
        const modelUrls = FLAVORS.flatMap(flavor => Object.values(flavor.models));
        const videoUrls = FLAVORS.map(flavor => flavor.videoPublicId).filter(Boolean);

        // 1. โหลด MediaPipe ก่อน เพราะสำคัญที่สุด
        console.log("Preloading MediaPipe...");
        await mediaPipeService.initialize();

        // 2. โหลดโมเดลทีละไฟล์
        console.log("Preloading 3D Models one by one...");
        for (const url of modelUrls) {
          console.log(`- Loading ${url}`);
          await preloadGLTF(url);
        }

        // 3. โหลดวิดีโอทีละไฟล์
        console.log("Preloading videos one by one...");
        for (const url of videoUrls) {
          console.log(`- Loading ${url}`);
          await preloadVideo(url);
        }

      })(); // <--- สิ้นสุดการแก้ไข
      // --- 4. รอให้ "ทั้งสองอย่าง" เสร็จสิ้น ---
      // Promise.all จะรอจนกว่า Promise ที่ช้าที่สุดจะเสร็จ
      // - ถ้าโหลด assets เสร็จใน 2 วิ: มันจะรอ timer อีก 3 วิ -> รวมเป็น 5 วิ
      // - ถ้าโหลด assets ใช้เวลา 6 วิ: timer จะเสร็จก่อน แต่ Promise.all จะรอ assets -> รวมเป็น 6 วิ
      console.time("TotalLoading");
      await Promise.all([assetsLoadingPromise, timerPromise]);
      console.timeEnd("TotalLoading");

      console.log("All assets preloaded and minimum time has passed!");
      setAppState('ready');

    } catch (err) {
      console.error('Fatal Error: Preloading assets failed:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  }, []);

  // 4. สร้างฟังก์ชันสำหรับขออนุญาต
  const handleGrantPermission = useCallback(async () => {
    try {
      console.log("Requesting camera permission...");
      // ขออนุญาตก่อน
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());

      console.log("Permission granted. Starting preload...");
      // เมื่อได้รับอนุญาตแล้ว ค่อยเริ่มทำการ Preload
      startPreloading();

    } catch (err) {
      console.error("Permission denied:", err);
      setError("จำเป็นต้องอนุญาตให้เข้าถึงกล้องและไมโครโฟนเพื่อใช้งาน");
    }
  }, [startPreloading]); // ระบุ dependency

  // 5. สร้างฟังก์ชันสำหรับ Render เนื้อหาตาม State
  const renderContent = () => {
    if (error) {
      return <div className="error-screen">{error}</div>; // อาจจะสร้างเป็น Component สวยๆ
    }

    switch (appState) {
      case 'requesting_permission':
        return <PermissionPrompt onGrant={handleGrantPermission} />;

      case 'loading':
        return <LoadingScreen />;

      case 'ready':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <AROverlay />
          </Suspense>
        );

      default:
        return <PermissionPrompt onGrant={handleGrantPermission} />;
    }
  };

  return (
    <div className="app-background">
      <div className="app-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;