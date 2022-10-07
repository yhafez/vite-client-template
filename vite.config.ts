import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: { host: true, port: 3000, proxy: {
		"/api": {
			target: "http://localhost:5001",
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ""),
		},
	},
},
})
