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
    // ถ้าเคย initialize สำเร็จแล้ว ให้ return instance เดิมทันที
    if (isInitialized && faceMeshInstance) {
      return Promise.resolve(faceMeshInstance);
    }

    // ถ้ากำลัง initialize อยู่ ให้รอ promise เดิมจนเสร็จ
    if (isInitializing) {
      return initializationPromise;
    }

    // เริ่มกระบวนการ initialize
    isInitializing = true;

    // สร้าง Promise ใหม่สำหรับให้คนอื่นรอ
    initializationPromise = new Promise(async (resolve, reject) => {
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

        // "Warm-up" call: การเรียก onResults ครั้งแรกเป็นส่วนสำคัญของการ initialize
        // เราจะส่ง resolve function เข้าไปเพื่อให้รู้ว่ามันพร้อมแล้ว
        faceMesh.onResults(() => {});

        // นี่คือ trick: เราต้องรอให้ WASM module โหลดเสร็จจริงๆ
        // การเรียก send() ด้วย input เปล่าๆ จะเป็นการบังคับให้โหลด
        await faceMesh.send({ image: document.createElement("canvas") });

        console.log("MediaPipe Service: Initialization Complete!");
        faceMeshInstance = faceMesh;
        isInitialized = true;
        isInitializing = false;
        resolve(faceMeshInstance);
      } catch (error) {
        console.error("MediaPipe Service: Initialization Failed!", error);
        isInitializing = false;
        reject(error);
      }
    });

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
};

export default mediaPipeService;
