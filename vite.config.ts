import path from "path";
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
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.2.0",
        },
        wouter: {
          singleton: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "wouter"],
  },
  // base: "/farm",
  // build: { target: "esnext" },
  // server: {
  //   port: 3001,
  // },
  // preview: {
  //   port: 3001,
  // },
});
