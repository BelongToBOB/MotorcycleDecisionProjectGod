import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/AdminEdit.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

export default function AdminEdit() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const inputFile = useRef(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลแอดมิน
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/${user_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setForm({
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          password: "",
          confirmPassword: "",
          picture: res.data.picture || "",
        });
        setPreview(res.data.picture || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("ไม่พบข้อมูลแอดมิน");
        navigate("/AdminPage");
      });
  }, [user_id, navigate]);

  // อัปเดตรูปโปรไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("picture", file);

    const token = localStorage.getItem("token");
    toast.info("กำลังอัปโหลด...");

    axios
      .put(`${API_BASE_URL}/admin/${user_id}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setForm((prev) => ({ ...prev, picture: res.data.picture }));
        toast.success("อัปเดตรูปโปรไฟล์สำเร็จ");
      })
      .catch(() => toast.error("อัปโหลดรูปไม่สำเร็จ"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // อัปเดตข้อมูลแอดมิน
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }
    try {
      const updateBody = { ...form };
      if (!form.password) delete updateBody.password;
      delete updateBody.confirmPassword;

      await axios.put(`${API_BASE_URL}/api/admin/${user_id}`, updateBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("อัปเดตข้อมูลสำเร็จ");
      navigate("/AdminPage");
    } catch (err) {
      toast.error("อัปเดตข้อมูลไม่สำเร็จ");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="section-admin-page-edit">
        <div className="admin-edit-container">
          <h2 className="admin-edit-title">แก้ไขข้อมูลผู้ดูแลระบบ</h2>
          <form className="admin-edit-form" onSubmit={handleSubmit}>
            <div className="admin-edit-profile">
              <img
                src={preview || "/default-profile.png"}
                alt="profile"
                className="admin-profile-img"
                onClick={() => inputFile.current.click()}
              />
              <input
                type="file"
                ref={inputFile}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => inputFile.current.click()}
              >
                เปลี่ยนรูป
              </button>
            </div>

            <div className="admin-edit-fields">
              <label>
                ชื่อผู้ดูแลระบบ
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                เบอร์โทรศัพท์
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                ที่อยู่
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>
              <label>
                รหัสผ่านใหม่ (ถ้าไม่เปลี่ยน ปล่อยว่าง)
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </label>
              <label>
                ยืนยันรหัสผ่าน
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="admin-edit-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/AdminPage")}
              >
                ยกเลิก
              </button>
              <button type="submit" className="confirm-btn">
                ยืนยัน
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
