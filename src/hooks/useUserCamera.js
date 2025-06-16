import { useState, useEffect } from "react";

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
        // ขอ stream จากกล้องหน้า (user)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // 'user' คือกล้องหน้า
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
