import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",   // ชี้ตรง ๆ ว่าใช้ localhost
    port: 5173,          // พอร์ตปกติของ Vite
    strictPort: true,    // ถ้ามี process อื่นใช้พอร์ตนี้ จะ error เลย (ไม่เปลี่ยนพอร์ตเอง)
    hmr: {
      protocol: "ws",    // ใช้ websocket ธรรมดา (ไม่ใช่ wss)
      host: "localhost",
      port: 5173
    }
  }
})
