import { detectBrowserAndPlatform } from "./deviceUtils";

/**
 * แปลง Blob เป็นไฟล์ที่มี MIME type ที่ถูกต้อง
 * @param {Blob} blob - Blob ที่ต้องการแปลง
 * @param {string} mimeType - MIME type ที่ต้องการ
 * @returns {File} ไฟล์ที่มี MIME type ที่ถูกต้อง
 */
export const convertBlobToFile = (blob, mimeType) => {
  const { isIOS, isSafari, isChrome, isAndroid } = detectBrowserAndPlatform();

  // กำหนดนามสกุลไฟล์ตาม MIME type
  let extension = "mp4";
  if (mimeType?.includes("webm")) {
    extension = "webm";
  } else if (mimeType?.includes("ogg")) {
    extension = "ogv";
  }

  // สำหรับ iOS/Safari ใช้ mp4 เสมอ
  if (isIOS || isSafari) {
    extension = "mp4";
  }

  // สำหรับ Android/Chrome ใช้ WebM
  if (isAndroid || isChrome) {
    extension = "webm";
  }

  const filename = `mama-noodleverse.${extension}`;

  // สร้างไฟล์ใหม่ด้วย MIME type ที่ถูกต้อง
  return new File([blob], filename, { type: mimeType });
};

/**
 * ตรวจสอบและแก้ไข MIME type ให้ถูกต้อง
 * @param {string} originalMimeType - MIME type เดิม
 * @returns {string} MIME type ที่ถูกต้อง
 */
export const fixMimeType = (originalMimeType) => {
  const { isIOS, isSafari, isChrome } = detectBrowserAndPlatform();

  // หากไม่มี MIME type หรือเป็น webm ให้ใช้ fallback
  if (!originalMimeType || originalMimeType === "video/webm") {
    if (isIOS || isSafari) {
      return "video/mp4";
    } else if (isChrome) {
      return "video/mp4";
    } else {
      return "video/mp4";
    }
  }

  return originalMimeType;
};

/**
 * สร้าง Blob ที่มี MIME type ที่ถูกต้อง
 * @param {Array} chunks - Array ของ Blob chunks
 * @param {string} mimeType - MIME type ที่ต้องการ
 * @returns {Blob} Blob ที่มี MIME type ที่ถูกต้อง
 */
export const createCorrectBlob = (chunks, mimeType) => {
  const correctedMimeType = fixMimeType(mimeType);
  console.log(`Creating blob with MIME type: ${correctedMimeType}`);

  return new Blob(chunks, { type: correctedMimeType });
};

/**
 * ตรวจสอบว่าไฟล์วิดีโอสามารถเปิดได้หรือไม่
 * @param {Blob} blob - Blob ที่ต้องการตรวจสอบ
 * @returns {Promise<boolean>} ผลการตรวจสอบ
 */
export const testVideoPlayability = async (blob) => {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(blob);
      const video = document.createElement("video");

      video.onloadedmetadata = () => {
        console.log("✅ Video metadata loaded successfully");
        URL.revokeObjectURL(url);
        resolve(true);
      };

      video.onerror = (error) => {
        console.error("❌ Video loading error:", error);
        URL.revokeObjectURL(url);
        resolve(false);
      };

      // ตั้งเวลา timeout
      setTimeout(() => {
        console.warn("⚠️ Video loading timeout");
        URL.revokeObjectURL(url);
        resolve(false);
      }, 5000);

      video.src = url;
      video.load();
    } catch (error) {
      console.error("❌ Error testing video playability:", error);
      resolve(false);
    }
  });
};

/**
 * แปลงวิดีโอเป็นรูปแบบที่เหมาะสมสำหรับการดาวน์โหลด
 * @param {Blob} originalBlob - Blob เดิม
 * @param {string} mimeType - MIME type ที่ต้องการ
 * @returns {Promise<Blob>} Blob ที่แปลงแล้ว
 */
export const convertVideoForDownload = async (originalBlob, mimeType) => {
  const { isIOS, isSafari, isChrome, isAndroid } = detectBrowserAndPlatform();

  // สำหรับ iOS/Safari ใช้ mp4 เสมอ
  if (isIOS || isSafari) {
    const correctedMimeType = "video/mp4";
    console.log(`Converting video for iOS/Safari: ${correctedMimeType}`);
    return new Blob([originalBlob], { type: correctedMimeType });
  }

  // สำหรับ Android/Chrome ใช้ WebM เพื่อคุณภาพที่ดีกว่า
  if (isAndroid || isChrome) {
    const correctedMimeType = "video/webm";
    console.log(
      `Converting video for Android/Chrome to WebM: ${correctedMimeType}`
    );
    return new Blob([originalBlob], { type: correctedMimeType });
  }

  // สำหรับ browser อื่นๆ ใช้ MIME type ที่ได้รับ
  const correctedMimeType = fixMimeType(mimeType);
  console.log(`Converting video for other browsers: ${correctedMimeType}`);
  return new Blob([originalBlob], { type: correctedMimeType });
};
