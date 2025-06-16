import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touc-icon.png", "masked-icon.png"],
  manifest: {
    name: "MAMA Noodle Verse",
    short_name: "MAMA Noodle Verse",
    description: "MAMA Noodle Verse",
    icons: [
      {
        src: "./pwa/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./pwa/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "./pwa/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "./pwa/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./pwa/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "icon",
      },
    ],
    theme_color: "#181818",
    background_color: "#e8eac2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
