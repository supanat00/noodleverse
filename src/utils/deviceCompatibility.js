/**
 * Device Compatibility Checker
 * ตรวจสอบความเข้ากันได้ของอุปกรณ์และแนะนำการแก้ไขปัญหา
 */

export const deviceCompatibility = {
  /**
   * ตรวจสอบข้อมูลอุปกรณ์และ browser
   */
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const vendor = navigator.vendor;

    return {
      userAgent,
      platform,
      vendor,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
      isAndroid: /Android/i.test(userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(userAgent),
      isSamsung: /Samsung/i.test(userAgent),
      isChrome: /Chrome/i.test(userAgent),
      isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
      isFirefox: /Firefox/i.test(userAgent),
      isEdge: /Edg/i.test(userAgent),
    };
  },

  /**
   * ตรวจสอบ WebGL support
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        return {
          supported: false,
          reason: "WebGL not supported",
          details: "Browser does not support WebGL",
        };
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : "Unknown";
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "Unknown";
      const version = gl.getParameter(gl.VERSION);
      const shadingLanguageVersion = gl.getParameter(
        gl.SHADING_LANGUAGE_VERSION
      );

      return {
        supported: true,
        vendor,
        renderer,
        version,
        shadingLanguageVersion,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      };
    } catch (error) {
      return {
        supported: false,
        reason: "WebGL check failed",
        details: error.message,
      };
    }
  },

  /**
   * ตรวจสอบ MediaPipe compatibility
   */
  async checkMediaPipeCompatibility() {
    try {
      // ตรวจสอบว่า MediaPipe modules สามารถโหลดได้หรือไม่
      const { FaceMesh } = await import("@mediapipe/face_mesh");

      // สร้าง instance ทดสอบ
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      // ตั้งค่า options
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // ทดสอบการทำงาน
      const testCanvas = document.createElement("canvas");
      testCanvas.width = 640;
      testCanvas.height = 480;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("MediaPipe initialization timeout")),
          10000
        );

        faceMesh.onResults(() => {
          clearTimeout(timeout);
          resolve();
        });

        faceMesh.send({ image: testCanvas }).catch(reject);
      });

      faceMesh.close();

      return {
        supported: true,
        message: "MediaPipe is fully compatible",
      };
    } catch (error) {
      return {
        supported: false,
        reason: "MediaPipe compatibility check failed",
        details: error.message,
      };
    }
  },

  /**
   * ตรวจสอบ TensorFlow.js compatibility
   */
  async checkTensorFlowCompatibility() {
    try {
      const tf = await import("@tensorflow/tfjs");

      // ตรวจสอบ backend ที่ใช้ได้
      const backends = await tf.ready();
      const currentBackend = tf.getBackend();

      // ทดสอบการสร้าง tensor
      const testTensor = tf.tensor([1, 2, 3, 4]);
      await testTensor.array(); // ทดสอบการทำงาน
      testTensor.dispose();

      return {
        supported: true,
        backend: currentBackend,
        availableBackends: backends,
        message: "TensorFlow.js is compatible",
      };
    } catch (error) {
      return {
        supported: false,
        reason: "TensorFlow.js compatibility check failed",
        details: error.message,
      };
    }
  },

  /**
   * ตรวจสอบ camera access
   */
  async checkCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      const settings = videoTrack.getSettings();

      // หยุด stream ทันที
      stream.getTracks().forEach((track) => track.stop());

      return {
        supported: true,
        capabilities,
        settings,
        message: "Camera access is available",
      };
    } catch (error) {
      return {
        supported: false,
        reason: "Camera access failed",
        details: error.message,
        errorName: error.name,
      };
    }
  },

  /**
   * ตรวจสอบ memory และ performance
   */
  checkPerformanceCapabilities() {
    const memory = navigator.deviceMemory || "Unknown";
    const cores = navigator.hardwareConcurrency || "Unknown";
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    return {
      deviceMemory: memory,
      hardwareConcurrency: cores,
      connection: connection
        ? {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
          }
        : "Unknown",
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * ตรวจสอบความเข้ากันได้ทั้งหมด
   */
  async runFullCompatibilityCheck() {
    console.log("🔍 Running full device compatibility check...");

    const results = {
      deviceInfo: this.getDeviceInfo(),
      webgl: this.checkWebGLSupport(),
      mediapipe: await this.checkMediaPipeCompatibility(),
      tensorflow: await this.checkTensorFlowCompatibility(),
      camera: await this.checkCameraAccess(),
      performance: this.checkPerformanceCapabilities(),
      timestamp: new Date().toISOString(),
    };

    console.log("📊 Compatibility check results:", results);
    return results;
  },

  /**
   * สร้างรายงานการแก้ไขปัญหา
   */
  generateTroubleshootingReport(compatibilityResults) {
    const issues = [];
    const recommendations = [];

    // ตรวจสอบ WebGL
    if (!compatibilityResults.webgl.supported) {
      issues.push("WebGL not supported");
      recommendations.push("Update your browser to a WebGL-compatible version");
    }

    // ตรวจสอบ MediaPipe
    if (!compatibilityResults.mediapipe.supported) {
      issues.push("MediaPipe not compatible");
      recommendations.push(
        "The app will automatically fallback to TensorFlow.js"
      );
    }

    // ตรวจสอบ TensorFlow.js
    if (!compatibilityResults.tensorflow.supported) {
      issues.push("TensorFlow.js not compatible");
      recommendations.push("Update your browser or try a different device");
    }

    // ตรวจสอบ Camera
    if (!compatibilityResults.camera.supported) {
      issues.push("Camera access denied");
      recommendations.push("Allow camera permissions in your browser settings");
    }

    // ตรวจสอบ Samsung S25 Ultra specific issues
    if (compatibilityResults.deviceInfo.isSamsung) {
      recommendations.push(
        "For Samsung devices: Try using Chrome browser for best compatibility"
      );
      recommendations.push(
        "If issues persist, try clearing browser cache and data"
      );
    }

    return {
      issues,
      recommendations,
      overallStatus: issues.length === 0 ? "FULLY_COMPATIBLE" : "HAS_ISSUES",
      compatibilityResults,
    };
  },
};

export default deviceCompatibility;
