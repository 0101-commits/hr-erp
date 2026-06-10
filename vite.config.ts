import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  /* GitHub Pages는 https://<owner>.github.io/hr-erp/ 하위 경로에서 서빙됨 */
  base: command === "build" ? "/hr-erp/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}));
