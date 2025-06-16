// 1. Import ไอคอนทั้งหมดที่ด้านบนของไฟล์
import iconOriginal from "../assets/icons/original.png";
import iconKimchi from "../assets/icons/kimchi.png";
import iconTomYum from "../assets/icons/tom-yum.png";

/**
 * นี่คือ "Single Source of Truth" สำหรับข้อมูลรสชาติทั้งหมด
 * ทุกอย่างที่เกี่ยวกับรสชาติจะถูกกำหนดไว้ที่นี่ที่เดียว
 */
export const FLAVORS = [
  {
    id: "original",
    name: "รสดั้งเดิม",
    videoPublicId: "TKO/MAMAOK/videos/presenter-01",
    // 2. เพิ่ม property 'iconSrc' โดยใช้ตัวแปรที่ import มา
    iconSrc: iconOriginal,
    // modelSrc: '/models/bowl-original.glb', // เตรียมไว้สำหรับโมเดล 3D
  },
  {
    id: "kimchi",
    name: "รสกิมจิ",
    videoPublicId: "TKO/MAMAOK/videos/presenter-02",
    iconSrc: iconKimchi,
    // modelSrc: '/models/bowl-kimchi.glb',
  },
  {
    id: "tom-yum",
    name: "รสต้มยำ",
    videoPublicId: "TKO/MAMAOK/videos/presenter-03",
    iconSrc: iconTomYum,
    // modelSrc: '/models/bowl-tom-yum.glb',
  },
];
