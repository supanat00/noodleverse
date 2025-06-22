// App.jsx (Optimized)
import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
// import AROverlay from './components/AROverlay/AROverlay'; // <--- เอา import ตรงนี้ออก
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { FLAVORS } from './data/flavors';
import { preloadGLTF } from './utils/preloadGLTF';
import mediaPipeService from './services/mediaPipeService'

// ใช้ React.lazy เพื่อบอกว่า "เดี๋ยวค่อยโหลด component นี้ เมื่อถึงเวลาต้องใช้"
// โค้ดของ AROverlay จะถูกแยกออกไปเป็นไฟล์ .js อีกไฟล์ (chunk)
const AROverlay = React.lazy(() => import('./components/AROverlay/AROverlay'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function preloadAssets() {
      try {
        console.log("Preloading all assets...");
        const modelUrls = FLAVORS.flatMap(flavor => Object.values(flavor.models));

        // 2. สร้าง Promise list
        const assetPromises = [
          ...modelUrls.map(url => preloadGLTF(url)), // โหลดโมเดล 3D
          mediaPipeService.initialize() // <<<--- โหลดและตั้งค่า MediaPipe
        ];

        // 3. รอให้ทุกอย่างเสร็จสิ้น
        await Promise.all(assetPromises);

        console.log("All assets preloaded successfully!");
        setIsLoading(false);
      } catch (error) {
        console.error('Fatal Error: Preloading assets failed:', error);
        // ควรแสดงหน้า Error ที่นี่
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