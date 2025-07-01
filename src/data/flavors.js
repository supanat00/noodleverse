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
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1751360345/TKO/MAMAOK/models/gochucheese/Gochucheese_bowl_04_xqhayo.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138306/TKO/MAMAOK/models/gochucheese/gochucheese_fork.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1751363366/TKO/MAMAOK/models/gochucheese/Gochucheese_prop_04_eejvbw.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 2.65, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      prop: {
        position: [0, 3.5, 0], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      chopstick: {
        position: [0, -3.75, 3.5], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 1.2,
      },
    },
    fallbackAdjustments: {
      bowl: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      prop: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [0, -3.75, 3.5],
        rotation: [0, 0, 0],
        scale: 1.2,
      },
    },
  },
  {
    id: "kimchi",
    name: "รสกิมจิ",
    iconSrc: iconKimchi,
    videoPublicId: presenter02,
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750755951/TKO/MAMAOK/models/kimchi/kimchi_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138413/TKO/MAMAOK/models/kimchi/kimchi_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750755952/TKO/MAMAOK/models/kimchi/kimchi_prop.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 2.65, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      prop: {
        position: [0, 3.5, 0], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [0.5, -3, 2], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 1,
      },
    },
    fallbackAdjustments: {
      bowl: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      prop: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [0.5, -3, 2],
        rotation: [0, 0, 0],
        scale: 1,
      },
    },
  },
  {
    id: "tonkotsu",
    name: "รสทงคัตสึ",
    iconSrc: iconTonkotsu,
    videoPublicId: presenter01,
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750756065/TKO/MAMAOK/models/tonkotsu/tonkotsu_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137830/TKO/MAMAOK/models/tonkotsu/tonkotsu_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750756066/TKO/MAMAOK/models/tonkotsu/tonkotsu_prop.glb",
    },
    adjustments: {
      bowl: {
        position: [0, 2.65, 0], // [x, y, z] ออฟเซ็ตจากจุดยึด (คาง)
        rotation: [Math.PI, 0, 0], // [x, y, z] การหมุน (เรเดียน)
        scale: 1.35, // ขนาด (ตัวเลขเดียวสำหรับทุกแกน)
      },
      prop: {
        position: [0, 3.5, 0], // ขยับ prop ขึ้นมานิดหน่อยและมาข้างหน้า
        rotation: [Math.PI, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [-0.75, -3.15, 1.5], // ตำแหน่งคงที่บนหน้าจอ
        rotation: [0, 0, 0],
        scale: 0.85,
      },
    },
    fallbackAdjustments: {
      bowl: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      prop: {
        position: [0, -1, 0],
        rotation: [(180 * Math.PI) / 180, 0, 0],
        scale: 1.35,
      },
      chopstick: {
        position: [-1.75, -4.35, 0],
        rotation: [0, 0, 0],
        scale: 1.35,
      },
    },
  },
];
