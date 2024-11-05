import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: [
    "favicon.ico",
    "robots.txt",
    "apple-touch-icon.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "android-chrome-maskable-192x192.png",
  ],
  manifest: {
    name: "Vaxcare",
    short_name: "Vaxcare",
    description:
      "Vaxcare Talogtog is a Barangay Child Health Immunization System designed to streamline vaccination efforts for children in local communities. The app supports health workers in tracking immunization schedules, sending reminders to parents, and maintaining accurate health records for each child. With a user-friendly interface and offline capabilities, Vaxcare Talogtog ensures reliable access to essential health information, promoting the well-being of children in the barangay.",
    theme_color: "#181818",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    screenshots: [
      {
        src: "screenshots/home.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "screenshots/feature1.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "screenshots/feature2.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    icons: [
      {
        src: "icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/android-chrome-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
