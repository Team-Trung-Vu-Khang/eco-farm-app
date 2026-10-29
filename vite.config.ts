import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "wouter"],
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      mangle: true,
      format: { comments: false },
    },
  },
});
