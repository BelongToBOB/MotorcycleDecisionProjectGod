// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// export default API_BASE_URL;

// client/src/config.js
// let API_BASE_URL = "";

// if (import.meta.env.MODE === "development") {
//   // เวลา dev (vite run บน localhost:5173)
//   API_BASE_URL = "http://localhost:5000/api";
// } else {
//   // เวลา build แล้ว deploy (Railway/Production)
//   API_BASE_URL = "/api";
// }

// export default API_BASE_URL;

// let API_BASE_URL = import.meta.env.VITE_API_URL || "";

// if (!API_BASE_URL) {
//   if (import.meta.env.MODE === "development") {
//     API_BASE_URL = "http://localhost:5000/api";
//   } else {
//     API_BASE_URL = "/api";
//   }
// }

// export default API_BASE_URL;

let API_BASE_URL = "";

if (import.meta.env.MODE === "development") {
  // ใช้ proxy ของ vite → เขียนแค่ /api พอ
  API_BASE_URL = "/api";
} else {
  // ตอน build → backend กับ frontend อยู่ domain เดียวกัน
  API_BASE_URL = "/api";
}

export default API_BASE_URL;
