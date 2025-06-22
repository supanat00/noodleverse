// src/data/flavors.js

// Import ไอคอน
import iconTonkotsu from "/assets/icons/tonkotsu.webp";
import iconGochucheese from "/assets/icons/gochucheese.webp";
import iconKimchi from "/assets/icons/kimchi.webp";

import presenter01 from "/assets/videos/presenter-01.webm";
import presenter02 from "/assets/videos/presenter-02.webm";
import presenter03 from "/assets/videos/presenter-03.webm";
/**
 * นี่คือ "Single Source of Truth" สำหรับข้อมูลรสชาติทั้งหมด
 * ทุกอย่างที่เกี่ยวกับรสชาติจะถูกกำหนดไว้ที่นี่ที่เดียว
 * รวมถึง Path ไปยังโมเดล 3D ที่ประกอบกัน
 */
export const FLAVORS = [
  {
    id: "gochucheese",
    name: "รสโคชูชีส",
    iconSrc: iconGochucheese,
    videoPublicId: presenter03,
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138306/TKO/MAMAOK/models/gochucheese/gochucheese_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138306/TKO/MAMAOK/models/gochucheese/gochucheese_fork.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138307/TKO/MAMAOK/models/gochucheese/gochucheese_prop.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 5, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 2.5, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
        customTexture: "/assets/textures/cup_tex.png",
      },
      prop: {
        position: [0, 5, 0], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0],
        scale: 2.5,
      },
      chopstick: {
        position: [0, -9, 0], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 3,
      },
    },
  },
  {
    id: "kimchi",
    name: "รสกิมจิ",
    iconSrc: iconKimchi,
    videoPublicId: presenter02,
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138412/TKO/MAMAOK/models/kimchi/kimchi_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138413/TKO/MAMAOK/models/kimchi/kimchi_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138414/TKO/MAMAOK/models/kimchi/kimchi_prop.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 2.2, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      prop: {
        position: [0, 2.3, 0.1], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [0.65, -3.5, 0], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 1.35,
      },
    },
  },
  {
    id: "tonkotsu",
    name: "รสทงคัตสึ",
    iconSrc: iconTonkotsu,
    videoPublicId: presenter01,
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137829/TKO/MAMAOK/models/tonkotsu/tonkotsu_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137830/TKO/MAMAOK/models/tonkotsu/tonkotsu_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137830/TKO/MAMAOK/models/tonkotsu/tonkotsu_prop.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 2.2, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      prop: {
        position: [0, 2.3, 0.1], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [-1.75, -4.5, 0], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 1.35,
      },
    },
  },
];
