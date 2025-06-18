// src/data/flavors.js

// Import ไอคอน
import iconTonkotsu from "/assets/icons/tonkotsu.webp";
import iconGochucheese from "/assets/icons/gochucheese.webp";
import iconKimchi from "/assets/icons/kimchi.webp";

/**
 * นี่คือ "Single Source of Truth" สำหรับข้อมูลรสชาติทั้งหมด
 * ทุกอย่างที่เกี่ยวกับรสชาติจะถูกกำหนดไว้ที่นี่ที่เดียว
 * รวมถึง Path ไปยังโมเดล 3D ที่ประกอบกัน
 */
export const FLAVORS = [
  {
    id: "gochucheese",
    name: "รสโกชูชีส",
    iconSrc: iconGochucheese,
    videoPublicId: "TKO/MAMAOK/videos/presenter-03",
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138306/TKO/MAMAOK/models/gochucheese/gochucheese_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138306/TKO/MAMAOK/models/gochucheese/gochucheese_fork.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138307/TKO/MAMAOK/models/gochucheese/gochucheese_prop.glb",
    },
  },
  {
    id: "kimchi",
    name: "รสกิมจิ",
    iconSrc: iconKimchi,
    videoPublicId: "TKO/MAMAOK/videos/presenter-02",
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138412/TKO/MAMAOK/models/kimchi/kimchi_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138413/TKO/MAMAOK/models/kimchi/kimchi_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750138414/TKO/MAMAOK/models/kimchi/kimchi_prop.glb",
    },
  },
  {
    id: "tonkotsu",
    name: "รสทงคัตสึ",
    iconSrc: iconTonkotsu,
    videoPublicId: "TKO/MAMAOK/videos/presenter-01",
    models: {
      bowl: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137829/TKO/MAMAOK/models/tonkotsu/tonkotsu_bowl.glb",
      chopstick:
        "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137830/TKO/MAMAOK/models/tonkotsu/tonkotsu_chopstick.glb",
      prop: "https://res.cloudinary.com/da8eemrq8/image/upload/v1750137830/TKO/MAMAOK/models/tonkotsu/tonkotsu_prop.glb",
    },
  },
];
