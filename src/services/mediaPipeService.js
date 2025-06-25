import { FaceMesh } from "@mediapipe/face_mesh";

// ตัวแปรระดับ module เพื่อเก็บ instance ของ FaceMesh (Singleton Pattern)
let faceMeshInstance = null;
let isInitializing = false;
let isInitialized = false;

// Promise ที่จะ resolve เมื่อการ khởi tạo เสร็จสิ้น
let initializationPromise = null;

const mediaPipeService = {
  /**
   * เริ่มกระบวนการโหลดและตั้งค่า FaceMesh ล่วงหน้า
   * ฟังก์ชันนี้สามารถเรียกซ้ำได้หลายครั้งอย่างปลอดภัย
   * @returns {Promise<FaceMesh>} A promise that resolves with the initialized FaceMesh instance.
   */
  async initialize() {
    if (isInitialized && faceMeshInstance) {
      return Promise.resolve(faceMeshInstance);
    }
    if (isInitializing) {
      return initializationPromise;
    }
    isInitializing = true;
    let retries = 0;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1200;
    const doInitialize = async () => {
      try {
        console.log("MediaPipe Service: Initializing...");
        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMesh.onResults(() => {});
        await faceMesh.send({ image: document.createElement("canvas") });
        console.log("MediaPipe Service: Initialization Complete!");
        faceMeshInstance = faceMesh;
        isInitialized = true;
        isInitializing = false;
        return faceMeshInstance;
      } catch (error) {
        console.error("MediaPipe Service: Initialization Failed!", error);
        if (retries < MAX_RETRIES) {
          retries++;
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
   * ดึง instance ของ FaceMesh ที่พร้อมใช้งานแล้ว
   * @returns {FaceMesh | null}
   */
  getInstance() {
    if (!isInitialized) {
      console.warn(
        "MediaPipe Service: getInstance() called before initialization is complete."
      );
      return null;
    }
    return faceMeshInstance;
  },

  /**
   * Cleanup resources
   */
  dispose() {
    if (faceMeshInstance && typeof faceMeshInstance.close === "function") {
      faceMeshInstance.close();
    }
    faceMeshInstance = null;
    isInitialized = false;
    isInitializing = false;
    initializationPromise = null;
  },
};

export default mediaPipeService;
