// App.jsx (Optimized)
import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
// import AROverlay from './components/AROverlay/AROverlay'; // <--- เอา import ตรงนี้ออก
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { FLAVORS } from './data/flavors';

// import preload modules
import mediaPipeService from './services/mediaPipeService'

import { preloadGLTF } from './utils/preloadGLTF';
import { preloadVideo } from './utils/preloadVideo';


// ใช้ React.lazy เพื่อบอกว่า "เดี๋ยวค่อยโหลด component นี้ เมื่อถึงเวลาต้องใช้"
// โค้ดของ AROverlay จะถูกแยกออกไปเป็นไฟล์ .js อีกไฟล์ (chunk)
const AROverlay = React.lazy(() => import('./components/AROverlay/AROverlay'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function preloadAssets() {
      try {
        console.log("Preloading all assets (Models, MediaPipe, Videos)...");

        // (2) ดึง URL ของทุกอย่างที่ต้องโหลด
        const modelUrls = FLAVORS.flatMap(flavor => Object.values(flavor.models));
        const videoUrls = FLAVORS.map(flavor => flavor.videoPublicId).filter(Boolean); // .filter(Boolean) เพื่อกรองค่า null/undefined ออก

        // (3) สร้าง list ของ Promises ทั้งหมด
        const assetPromises = [
          ...modelUrls.map(url => preloadGLTF(url)),      // โหลดโมเดル 3D
          ...videoUrls.map(url => preloadVideo(url)),     // <<<--- โหลดวิดีโอ
          mediaPipeService.initialize()                   // โหลดและตั้งค่า MediaPipe
        ];

        // 4. รอให้ทุกอย่างเสร็จสิ้น
        await Promise.all(assetPromises);

        console.log("All assets preloaded successfully!");
        setIsLoading(false);
      } catch (error) {
        console.error('Fatal Error: Preloading assets failed:', error);
        setIsLoading(false);
      }
    }

    preloadAssets();
  }, []);

  return (
    <div className="app-background">
      <div className="app-container">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          // Suspense คือ component ที่จะแสดง "fallback" UI
          // ขณะที่ React กำลังรอโหลดโค้ดของ AROverlay
          // ในเคสนี้อาจจะใช้ LoadingScreen เดิมซ้ำก็ได้ หรือตัว loading เล็กๆ ก็ได้
          <Suspense fallback={<LoadingScreen />}>
            <AROverlay />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;