import * as tf from "@tensorflow/tfjs";
import * as faceDetection from "@tensorflow-models/face-detection";

// ตัวแปรระดับ module เพื่อเก็บ instance (Singleton Pattern)
let faceDetectionModel = null;
let isInitializing = false;
let isInitialized = false;
let initializationPromise = null;

const tensorflowService = {
  /**
   * เริ่มกระบวนการโหลดและตั้งค่า Face Detection Model
   * ใช้ TensorFlow.js แทน MediaPipe
   */
  async initialize() {
    if (isInitialized && faceDetectionModel) {
      return Promise.resolve(faceDetectionModel);
    }
    if (isInitializing) {
      return initializationPromise;
    }

    isInitializing = true;
    let retries = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    const doInitialize = async () => {
      try {
        console.log("TensorFlow Service: Initializing...");

        // ตั้งค่า TensorFlow.js backend
        await tf.setBackend("webgl");
        console.log("TensorFlow backend:", tf.getBackend());

        // โหลด face detection model
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: "tfjs",
          modelType: "short",
          maxFaces: 1,
        };

        faceDetectionModel = await faceDetection.createDetector(
          model,
          detectorConfig
        );

        console.log("[TFJS] faceDetectionModel loaded:", faceDetectionModel);
        console.log("TensorFlow Service: Initialization Complete!");
        isInitialized = true;
        isInitializing = false;
        return faceDetectionModel;
      } catch (error) {
        console.error("TensorFlow Service: Initialization Failed!", error);
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(
            `Retrying TensorFlow initialization (${retries}/${MAX_RETRIES})...`
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
   * ดึง instance ของ Face Detection Model ที่พร้อมใช้งานแล้ว
   */
  getInstance() {
    if (!isInitialized) {
      console.warn(
        "TensorFlow Service: getInstance() called before initialization is complete."
      );
      return null;
    }
    return faceDetectionModel;
  },

  /**
   * ตรวจจับใบหน้าจาก image element
   */
  async detectFaces(imageElement) {
    if (!isInitialized || !faceDetectionModel) {
      throw new Error("TensorFlow Service not initialized");
    }

    try {
      const faces = await faceDetectionModel.estimateFaces(imageElement, {
        flipHorizontal: false,
      });

      if (!faces || faces.length === 0) {
        console.warn("[TFJS] detectFaces: no faces detected");
      }
      return faces;
    } catch (error) {
      console.error("Face detection failed:", error);
      throw error;
    }
  },

  /**
   * ตรวจสอบว่า TensorFlow.js รองรับบนอุปกรณ์นี้หรือไม่
   */
  async checkCompatibility() {
    try {
      // ตรวจสอบ WebGL support
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        return { supported: false, reason: "WebGL not supported" };
      }

      // ตรวจสอบ TensorFlow.js backend
      await tf.setBackend("webgl");
      const backend = tf.getBackend();

      return {
        supported: true,
        backend,
        webglInfo: {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
        },
      };
    } catch (error) {
      return { supported: false, reason: error.message };
    }
  },

  /**
   * Cleanup resources
   */
  dispose() {
    if (faceDetectionModel) {
      faceDetectionModel = null;
    }
    isInitialized = false;
    isInitializing = false;
    initializationPromise = null;
  },
};

export default tensorflowService;
