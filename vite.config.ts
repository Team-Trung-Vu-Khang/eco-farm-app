import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    federation({
      name: "eco-farm-app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
        "./FarmerFarmingWorkPage": "./src/pages/farmer/farming-work/index.tsx",
      },
      shared: [],
    }),
  ],
  // base: "/farm",
  // build: { target: "esnext" },
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
});
