// 1. Import ไอคอนทั้งหมดที่ด้านบนของไฟล์
import iconTonkotsu from "../assets/icons/tonkotsu.png";
import iconGochucheese from "../assets/icons/gochucheese.png";
import iconKimchi from "../assets/icons/kimchi.png";

/**
 * นี่คือ "Single Source of Truth" สำหรับข้อมูลรสชาติทั้งหมด
 * ทุกอย่างที่เกี่ยวกับรสชาติจะถูกกำหนดไว้ที่นี่ที่เดียว
 */
export const FLAVORS = [
  {
    id: "gochucheese",
    name: "รสโกชูชีส",
    videoPublicId: "TKO/MAMAOK/videos/presenter-03",
    iconSrc: iconGochucheese,
    modelSrc: "/models/gochucheese.glb",
  },
  {
    id: "kimchi",
    name: "รสกิมจิ",
    videoPublicId: "TKO/MAMAOK/videos/presenter-02",
    iconSrc: iconKimchi,
    modelSrc: "/models/kimchi.glb",
  },
  {
    id: "chashu",
    name: "รสชาชู",
    videoPublicId: "TKO/MAMAOK/videos/presenter-01",
    // 2. เพิ่ม property 'iconSrc' โดยใช้ตัวแปรที่ import มา
    iconSrc: iconTonkotsu,
    modelSrc: "/models/tonkotsu.glb", // เตรียมไว้สำหรับโมเดล 3D
  },
];
