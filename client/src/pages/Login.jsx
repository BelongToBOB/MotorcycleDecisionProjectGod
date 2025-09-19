import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "../store/userStore";
import API_BASE_URL from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const { setUser, setToken } = useUserStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.emailOrUsername || !form.password) {
      return toast.error("กรุณากรอกข้อมูลให้ครบ");
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        emailOrUsername: form.emailOrUsername,
        password: form.password,
      });

      // console.log("Login Response:", res.data);

      const { token, payload } = res.data;

      localStorage.setItem("token", token);
      setToken(token);
      // console.log("Token ที่ถูกบันทึก:", token);
      setUser(payload); // บันทึกข้อมูลผู้ใช้
      toast.success("เข้าสู่ระบบสำเร็จ");

      if (payload.role === "admin") {
        navigate("/AdminBo");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <>
      <Navbar />
      <section className="login-section">
        <div className="w-login">
          <div className="container">
            <div className="login_box">
              <h1>เข้าสู่ระบบ</h1>
              <input
                type="text"
                placeholder="Email or Username"
                className="login-email"
                name="emailOrUsername"
                value={form.emailOrUsername}
                onChange={handleChange}
              />
              <br />
              <br />
              <input
                type="password"
                placeholder="Password"
                className="login-password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <br />
              <button className="enter-button" onClick={handleLogin}>
                ตกลง
              </button>
              <div className="forgotpass">
                <a href="#">ลืมรหัสผ่าน?</a>
              </div>
            </div>
            <div className="register">
              <p>
                ยังไม่มีบัญชีใช่ไหม?{" "}
                <Link to={"/Register"}> ลงทะเบียนได้ที่นี่!!</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
