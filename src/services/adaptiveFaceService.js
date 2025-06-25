import mediaPipeService from "./mediaPipeService";
import tensorflowService from "./tensorflowService";

// ตัวแปรระดับ module
let selectedService = "none";
let isInitializing = false;
let isInitialized = true;
let initializationPromise = null;

const adaptiveFaceService = {
  /**
   * ตรวจสอบและเลือก service ที่เหมาะสมที่สุด
   */
  async selectBestService() {
    console.log("🔍 Selecting best face detection service...");

    // ลอง MediaPipe ก่อน (เร็วกว่าและมีประสิทธิภาพดีกว่า)
    try {
      console.log("📱 Testing MediaPipe compatibility...");
      await mediaPipeService.initialize();
      console.log("✅ MediaPipe selected as primary service");
      return "mediapipe";
    } catch (mediaPipeError) {
      console.warn(
        "⚠️ MediaPipe failed, trying TensorFlow.js:",
        mediaPipeError.message
      );

      // ลอง TensorFlow.js
      try {
        console.log("🧠 Testing TensorFlow.js compatibility...");
        const compatibility = await tensorflowService.checkCompatibility();

        if (!compatibility.supported) {
          throw new Error(
            `TensorFlow.js not supported: ${compatibility.reason}`
          );
        }

        await tensorflowService.initialize();
        console.log("✅ TensorFlow.js selected as fallback service");
        return "tensorflow";
      } catch (tensorflowError) {
        console.error("❌ Both services failed:", tensorflowError.message);
        throw new Error(
          `No compatible face detection service found. MediaPipe: ${mediaPipeError.message}, TensorFlow: ${tensorflowError.message}`
        );
      }
    }
  },

  /**
   * เริ่มต้น service ที่เหมาะสมที่สุด
   */
  async initialize() {
    if (isInitialized && selectedService) {
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
        const serviceType = await this.selectBestService();
        selectedService = serviceType;
        isInitialized = true;
        isInitializing = false;

        console.log(
          `🎯 Adaptive Face Service initialized with: ${serviceType.toUpperCase()}`
        );
        return selectedService;
      } catch (error) {
        console.error("Adaptive Face Service: Initialization Failed!", error);
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(
            `🔄 Retrying adaptive service selection (${retries}/${MAX_RETRIES})...`
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
   * ดึง instance ของ service ที่เลือกแล้ว
   */
  getInstance() {
    if (!isInitialized || !selectedService) {
      console.warn(
        "Adaptive Face Service: getInstance() called before initialization is complete."
      );
      return null;
    }

    if (selectedService === "mediapipe") {
      return mediaPipeService.getInstance();
    } else if (selectedService === "tensorflow") {
      return tensorflowService.getInstance();
    } else if (selectedService === "none") {
      return null;
    }

    return null;
  },

  /**
   * ตรวจจับใบหน้าจาก image element
   */
  async detectFaces(imageElement) {
    if (!isInitialized || !selectedService) {
      throw new Error("Adaptive Face Service not initialized");
    }

    if (selectedService === "none") {
      // ปิดระบบจับหน้า
      return null;
    }

    try {
      if (selectedService === "mediapipe") {
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
      } else if (selectedService === "tensorflow") {
        const faces = await tensorflowService.detectFaces(imageElement);
        return faces.length > 0 ? faces[0] : null;
      }
    } catch (error) {
      console.error("Face detection failed:", error);
      throw error;
    }
  },

  /**
   * รับข้อมูลเกี่ยวกับ service ที่ใช้อยู่
   */
  getServiceInfo() {
    if (!isInitialized) {
      return { status: "not_initialized" };
    }

    return {
      status: "initialized",
      service: selectedService,
      timestamp: new Date().toISOString(),
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
    tensorflowService.dispose();

    console.log(`🔄 Force switching to ${serviceType}...`);

    if (serviceType === "mediapipe") {
      await mediaPipeService.initialize();
      selectedService = "mediapipe";
    } else if (serviceType === "tensorflow") {
      await tensorflowService.initialize();
      selectedService = "tensorflow";
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
      // MediaPipe cleanup
      const faceMesh = mediaPipeService.getInstance();
      if (faceMesh) {
        faceMesh.close();
      }
    } else if (selectedService === "tensorflow") {
      tensorflowService.dispose();
    }

    selectedService = null;
    isInitialized = false;
    isInitializing = false;
    initializationPromise = null;
  },
};

export default adaptiveFaceService;
