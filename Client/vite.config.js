import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        proxy: {
            '/api-docs': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/swagger-ui': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }, "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            }
        }
    }
});
