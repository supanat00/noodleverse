import { useState, useEffect } from "react";
import { detectBrowserAndPlatform } from "../utils/deviceUtils";

/**
 * useUserCamera Hook
 *
 * Hook ง่ายๆ สำหรับการเปิดกล้องหน้าของผู้ใช้
 * และคืนค่า video element ที่มี stream ของกล้องอยู่
 */
export const useUserCamera = () => {
  // State สำหรับเก็บ video element ที่พร้อมใช้งาน
  const [videoStreamElement, setVideoStreamElement] = useState(null);

  useEffect(() => {
    // สร้าง video element เสมือนขึ้นมา
    const video = document.createElement("video");
    video.setAttribute("playsinline", ""); // สำคัญสำหรับ iOS
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", ""); // ปิดเสียงตัวเอง

    let stream = null;

    // ฟังก์ชันสำหรับขออนุญาตและเปิดกล้อง
    const startCamera = async () => {
      try {
        const { isIOS, isSafari } = detectBrowserAndPlatform();

        // ตั้งค่า video constraints ที่เหมาะสมสำหรับแต่ละ platform
        const videoConstraints = {
          facingMode: "user", // 'user' คือกล้องหน้า
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };

        // สำหรับ iOS/Safari ใช้การตั้งค่าเพิ่มเติม
        if (isIOS || isSafari) {
          videoConstraints.width = { ideal: 1280, max: 1920 };
          videoConstraints.height = { ideal: 720, max: 1080 };
        }

        console.log(
          `Camera initialization for: iOS=${isIOS}, Safari=${isSafari}`
        );
        console.log(`Video constraints:`, videoConstraints);

        // ขอ stream จากกล้อง
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });

        video.srcObject = stream;
        video.play();
        setVideoStreamElement(video); // เมื่อพร้อมแล้ว ให้ set state
      } catch (err) {
        console.error("Error accessing camera:", err);
        // TODO: อาจจะแสดง UI แจ้งเตือนผู้ใช้ว่าเปิดกล้องไม่ได้
      }
    };

    startCamera();

    // Cleanup function: จะทำงานเมื่อ component ถูก unmount
    return () => {
      // หยุด track ทุกเส้นของ stream เพื่อปิดไฟกล้อง
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // [] ทำงานแค่ครั้งเดียว

  return videoStreamElement;
};
