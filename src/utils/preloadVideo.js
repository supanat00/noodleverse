/**
 * ฟังก์ชันสำหรับดาวน์โหลดไฟล์วิดีโอล่วงหน้าและเก็บไว้ในแคชของเบราว์เซอร์
 * @param {string} src - The URL of the video file.
 * @returns {Promise<Event>} A promise that resolves when the video is ready to be played without buffering.
 */
export function preloadVideo(src) {
  return new Promise((resolve, reject) => {
    // 1. สร้าง video element ขึ้นมาในหน่วยความจำ
    const video = document.createElement("video");

    // 2. ตั้งค่า event listeners ก่อนกำหนด src
    //    'canplaythrough' คือ event ที่บอกว่าเบราว์เซอร์โหลดข้อมูลมาพอที่จะเล่นได้จนจบโดยไม่สะดุด
    video.addEventListener("canplaythrough", resolve, { once: true });
    video.addEventListener(
      "error",
      (e) => reject(`Failed to preload video: ${src}`, e),
      { once: true }
    );

    // 3. ตั้งค่า attributes ที่จำเป็น
    video.src = src;
    video.crossOrigin = "anonymous"; // สำคัญมากสำหรับ WebGL/Three.js
    video.preload = "auto"; // บอกให้เบราว์เซอร์เริ่มโหลดโดยอัตโนมัติ
    video.muted = true; // ป้องกันการเล่นเสียงอัตโนมัติ
    video.playsInline = true; // จำเป็นสำหรับ iOS

    // ไม่ต้องเรียก .play() หรือ .load() เพราะ `preload="auto"` จะจัดการให้เอง
    // เราแค่ต้องการให้ไฟล์ถูกดาวน์โหลดมา ไม่ใช่ให้มันเล่น
  });
}
