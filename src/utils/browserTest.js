import {
  detectBrowserAndPlatform,
  getOptimalVideoMimeType,
  getVideoMimeTypes,
} from "./deviceUtils";

/**
 * ฟังก์ชันทดสอบการตรวจจับ browser และ MIME type
 */
export const testBrowserDetection = () => {
  console.log("🧪 Testing Browser Detection...");

  const browserInfo = detectBrowserAndPlatform();
  console.log("Browser Info:", browserInfo);

  const optimalMimeType = getOptimalVideoMimeType();
  console.log("Optimal MIME Type:", optimalMimeType);

  const mimeTypes = getVideoMimeTypes();
  console.log("Available MIME Types:", mimeTypes);

  // ทดสอบ MediaRecorder support
  const supportedMimeTypes = mimeTypes.filter((mimeType) => {
    const isSupported = MediaRecorder.isTypeSupported(mimeType);
    console.log(
      `${mimeType}: ${isSupported ? "✅ Supported" : "❌ Not Supported"}`
    );
    return isSupported;
  });

  console.log("✅ Supported MIME Types:", supportedMimeTypes);

  return {
    browserInfo,
    optimalMimeType,
    supportedMimeTypes,
  };
};

/**
 * ฟังก์ชันทดสอบการตั้งค่า video constraints
 */
export const testVideoConstraints = () => {
  const { isIOS, isSafari, isChrome } = detectBrowserAndPlatform();

  const baseConstraints = {
    facingMode: "user",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  let optimizedConstraints = { ...baseConstraints };

  if (isIOS || isSafari) {
    optimizedConstraints.width = { ideal: 1280, max: 1920 };
    optimizedConstraints.height = { ideal: 720, max: 1080 };
    console.log("📱 iOS/Safari optimized constraints:", optimizedConstraints);
  } else if (isChrome) {
    console.log("🌐 Chrome using base constraints:", optimizedConstraints);
  } else {
    console.log(
      "🔧 Other browser using base constraints:",
      optimizedConstraints
    );
  }

  return optimizedConstraints;
};

/**
 * ฟังก์ชันทดสอบการสร้างและตรวจสอบ Blob
 */
export const testVideoBlob = (blob, mimeType) => {
  console.log("🧪 Testing Video Blob...");

  if (!blob) {
    console.error("❌ No blob provided");
    return false;
  }

  console.log(`Blob size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Blob type: ${blob.type}`);
  console.log(`Expected MIME type: ${mimeType}`);

  // ตรวจสอบว่า Blob มีขนาดที่เหมาะสม
  if (blob.size === 0) {
    console.error("❌ Blob is empty");
    return false;
  }

  if (blob.size < 1024) {
    console.warn("⚠️ Blob size is very small, might be corrupted");
  }

  // ตรวจสอบ MIME type
  if (blob.type !== mimeType) {
    console.warn(
      `⚠️ MIME type mismatch: expected ${mimeType}, got ${blob.type}`
    );
  }

  // ทดสอบการสร้าง URL
  try {
    const url = URL.createObjectURL(blob);
    console.log(`✅ Blob URL created: ${url}`);

    // ทดสอบการอ่าน Blob
    const reader = new FileReader();
    reader.onload = () => {
      console.log("✅ Blob can be read successfully");
    };
    reader.onerror = () => {
      console.error("❌ Error reading blob");
    };
    reader.readAsArrayBuffer(blob);

    return true;
  } catch (error) {
    console.error("❌ Error creating blob URL:", error);
    return false;
  }
};

/**
 * ฟังก์ชันทดสอบการรองรับ WebM
 */
export const testWebMSupport = () => {
  console.log("🧪 Testing WebM Support...");

  const { isAndroid, isChrome } = detectBrowserAndPlatform();
  console.log(`Platform: Android=${isAndroid}, Chrome=${isChrome}`);

  const webmMimeTypes = [
    "video/webm; codecs=vp9,opus",
    "video/webm; codecs=vp8,opus",
    "video/webm",
  ];

  const supportedWebM = webmMimeTypes.filter((mimeType) => {
    const isSupported = MediaRecorder.isTypeSupported(mimeType);
    console.log(
      `${mimeType}: ${isSupported ? "✅ Supported" : "❌ Not Supported"}`
    );
    return isSupported;
  });

  console.log(
    `✅ Supported WebM formats: ${supportedWebM.length}/${webmMimeTypes.length}`
  );

  if (supportedWebM.length > 0) {
    console.log(`🎯 Best WebM format: ${supportedWebM[0]}`);
  } else {
    console.warn("⚠️ No WebM support detected, will fallback to MP4");
  }

  return {
    isAndroid,
    isChrome,
    supportedWebM,
    hasWebMSupport: supportedWebM.length > 0,
  };
};
