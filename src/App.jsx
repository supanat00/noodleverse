// App.jsx (Production-Ready: Parallel Loading with Timeouts & Fallbacks)
import React, { useState, Suspense, useCallback } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PermissionPrompt from './components/PermissionPrompt/PermissionPrompt';
import { FLAVORS } from './data/flavors';

// import preload modules
import mediaPipeService from './services/mediaPipeService'
import { preloadGLTF } from './utils/preloadGLTF';
import { preloadVideo } from './utils/preloadVideo';

// React.lazy ยังคงใช้เหมือนเดิม
const AROverlay = React.lazy(() => import('./components/AROverlay/AROverlay'));

// Utility function for timeout handling
const withTimeout = (promise, timeoutMs, errorMessage) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
};

// Utility function for retry logic
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

function App() {
  const [appState, setAppState] = useState('requesting_permission');
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const startPreloading = useCallback(async () => {
    try {
      console.log("🚀 Starting production-ready parallel asset preloading...");
      setAppState('loading');
      setLoadingProgress(0);

      const MINIMUM_LOADING_TIME = 5000; // เพิ่มเป็น 5 วินาทีเพื่อให้เห็นจอพรีเซนเตอร์
      const timerPromise = new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME));

      // ✨ PRODUCTION-READY PARALLEL LOADING STRATEGY ✨
      const assetsLoadingPromise = (async () => {
        const modelUrls = FLAVORS.flatMap(flavor => Object.values(flavor.models));
        const videoUrls = FLAVORS.map(flavor => flavor.videoPublicId).filter(Boolean);

        // 1. Load MediaPipe first (critical for face tracking)
        console.log("📱 Loading MediaPipe...");
        setLoadingProgress(10);
        await withTimeout(
          retryWithBackoff(() => mediaPipeService.initialize()),
          15000, // 15s timeout for MediaPipe
          "MediaPipe initialization timeout"
        );
        setLoadingProgress(30);

        // 2. Load 3D models in parallel with individual timeouts
        console.log("🎯 Loading 3D models in parallel...");
        const modelPromises = modelUrls.map((url, index) =>
          withTimeout(
            retryWithBackoff(() => preloadGLTF(url)),
            20000, // 20s timeout per model
            `Model loading timeout: ${url}`
          ).then(() => {
            const progress = 30 + ((index + 1) / modelUrls.length) * 40;
            setLoadingProgress(progress);
            console.log(`✅ Model loaded: ${url}`);
          }).catch(error => {
            console.error(`❌ Model failed to load: ${url}`, error);
            // Continue loading other models even if one fails
            return null;
          })
        );

        // 3. Load videos with iOS-compatible strategy (optional preloading)
        console.log("🎬 Loading videos with iOS compatibility...");
        const videoPromises = videoUrls.map((url, index) =>
          withTimeout(
            retryWithBackoff(() => preloadVideo(url), 2, 2000), // Fewer retries for videos
            10000, // 10s timeout per video (shorter due to iOS restrictions)
            `Video loading timeout: ${url}`
          ).then(() => {
            const progress = 70 + ((index + 1) / videoUrls.length) * 20;
            setLoadingProgress(progress);
            console.log(`✅ Video loaded: ${url}`);
          }).catch(error => {
            console.warn(`⚠️ Video failed to preload (will load on-demand): ${url}`, error);
            // Videos can fail preloading - they'll load on-demand in useVideoTexture
            return null;
          })
        );

        // 4. Wait for all assets with Promise.allSettled (don't fail if some assets fail)
        const allPromises = [...modelPromises, ...videoPromises];
        const results = await Promise.allSettled(allPromises);

        // Check if critical assets (MediaPipe + at least one model) loaded successfully
        const successfulModels = results.slice(0, modelPromises.length).filter(r => r.status === 'fulfilled').length;
        const successfulVideos = results.slice(modelPromises.length).filter(r => r.status === 'fulfilled').length;

        console.log(`📊 Loading results: ${successfulModels}/${modelUrls.length} models, ${successfulVideos}/${videoUrls.length} videos`);

        if (successfulModels === 0) {
          throw new Error("No 3D models could be loaded. Please check your internet connection.");
        }

        setLoadingProgress(100);
      })();

      // Wait for both minimum time and asset loading
      await Promise.all([assetsLoadingPromise, timerPromise]);

      console.log("🎉 All critical assets loaded successfully!");
      setAppState('ready');

    } catch (err) {
      console.error('💥 Fatal Error: Asset preloading failed:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  }, []);

  // 4. Improved permission handling
  const handleGrantPermission = useCallback(async () => {
    try {
      console.log("📷 Requesting camera permission...");

      // Request video first, audio only when needed for recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // Don't request audio upfront
      });

      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());

      console.log("✅ Permission granted. Starting preload...");
      startPreloading();

    } catch (err) {
      console.error("❌ Permission denied:", err);
      if (err.name === 'NotAllowedError') {
        setError("จำเป็นต้องอนุญาตให้เข้าถึงกล้องเพื่อใช้งาน กรุณาอนุญาตและรีเฟรชหน้าเว็บ");
      } else if (err.name === 'NotFoundError') {
        setError("ไม่พบกล้องในอุปกรณ์ กรุณาตรวจสอบการเชื่อมต่อกล้อง");
      } else {
        setError("เกิดข้อผิดพลาดในการเข้าถึงกล้อง กรุณาลองใหม่อีกครั้ง");
      }
    }
  }, [startPreloading]);

  // 5. Enhanced content rendering with error boundaries
  const renderContent = () => {
    if (error) {
      return (
        <div className="error-screen">
          <div className="error-content">
            <h2>⚠️ เกิดข้อผิดพลาด</h2>
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                setAppState('requesting_permission');
              }}
              className="retry-button"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      );
    }

    switch (appState) {
      case 'requesting_permission':
        return <PermissionPrompt onGrant={handleGrantPermission} />;

      case 'loading':
        return <LoadingScreen progress={loadingProgress} />;

      case 'ready':
        return (
          <Suspense fallback={<LoadingScreen progress={50} />}>
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