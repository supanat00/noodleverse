import mediaPipeService from "./mediaPipeService";

// ตัวแปรระดับ module
let selectedService = "mediapipe";
let isInitializing = false;
let isInitialized = false;
let initializationPromise = null;

const adaptiveFaceService = {
  /**
   * เริ่มต้น MediaPipe service
   */
  async initialize() {
    if (isInitialized && selectedService === "mediapipe") {
      return Promise.resolve(selectedService);
    }
    if (isInitializing) {
      return initializationPromise;
    }

    isInitializing = true;
    let retries = 0;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 3000;

    const doInitialize = async () => {
      try {
        console.log("📱 Initializing MediaPipe Face Service...");
        await mediaPipeService.initialize();
        selectedService = "mediapipe";
        isInitialized = true;
        isInitializing = false;

        console.log("🎯 MediaPipe Face Service initialized successfully");
        return selectedService;
      } catch (error) {
        console.error("MediaPipe Face Service: Initialization Failed!", error);
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(
            `🔄 Retrying MediaPipe initialization (${retries}/${MAX_RETRIES})...`
          );
          await new Promise((res) => setTimeout(res, RETRY_DELAY));
          return doInitialize();
        } else {
          isInitializing = false;
          throw error;
        }
      }
    };

    initializationPromise = doInitialize();
    return initializationPromise;
  },

  /**
   * ดึง instance ของ MediaPipe service
   */
  getInstance() {
    if (!isInitialized || selectedService !== "mediapipe") {
      console.warn(
        "MediaPipe Face Service: getInstance() called before initialization is complete."
      );
      return null;
    }

    return mediaPipeService.getInstance();
  },

  /**
   * ตรวจจับใบหน้าจาก image element
   */
  async detectFaces(imageElement) {
    if (!isInitialized || selectedService !== "mediapipe") {
      throw new Error("MediaPipe Face Service not initialized");
    }

    try {
      const faceMesh = mediaPipeService.getInstance();
      return new Promise((resolve, reject) => {
        faceMesh.onResults((results) => {
          if (
            results.multiFaceLandmarks &&
            results.multiFaceLandmarks.length > 0
          ) {
            resolve(results.multiFaceLandmarks[0]);
          } else {
            resolve(null);
          }
        });

        faceMesh.send({ image: imageElement }).catch(reject);
      });
    } catch (error) {
      console.error("Face detection failed:", error);
      throw error;
    }
  },

  /**
   * รับข้อมูลเกี่ยวกับ service ที่ใช้อยู่
   */
  getServiceInfo() {
    return {
      service: selectedService,
      status: isInitialized ? "READY" : "NOT_READY",
      timestamp: Date.now(),
    };
  },

  /**
   * เปลี่ยน service แบบ manual (สำหรับ debugging)
   */
  async forceService(serviceType) {
    if (isInitializing) {
      throw new Error("Cannot force service while initializing");
    }

    // Cleanup service เก่าก่อน switch เสมอ
    mediaPipeService.dispose();

    console.log(`🔄 Force switching to ${serviceType}...`);

    if (serviceType === "mediapipe") {
      await mediaPipeService.initialize();
      selectedService = "mediapipe";
    } else if (serviceType === "none") {
      // ปิดระบบจับหน้า ไม่ต้อง initialize อะไร
      selectedService = "none";
    } else {
      throw new Error(`Unknown service type: ${serviceType}`);
    }

    isInitialized = true;
    console.log(`✅ Forced service switch to: ${serviceType}`);
    return selectedService;
  },

  /**
   * Cleanup resources
   */
  dispose() {
    if (selectedService === "mediapipe") {
      const faceMesh = mediaPipeService.getInstance();
      if (faceMesh) {
        faceMesh.close();
      }
    }
    selectedService = null;
    isInitialized = false;
    isInitializing = false;
    initializationPromise = null;
  },
};

export default adaptiveFaceService;
