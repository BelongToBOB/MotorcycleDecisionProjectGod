import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/UserEdit.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUploader from "../components/ImageUploader";
import API_BASE_URL from "../config";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthDate: "",
    phone: "",
    occupation: "",
    address: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setForm({
          username: res.data.username || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          gender: res.data.gender || "",
          birthDate: res.data.birthDate ? res.data.birthDate.split("T")[0] : "",
          phone: res.data.phone || "",
          occupation: res.data.occupation || "",
          address: res.data.address || "",
          password: "",
          confirmPassword: "",
          picture: res.data.picture || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("ไม่พบข้อมูลผู้ใช้");
        navigate("/AdminUserPage");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }
    try {
      const updateBody = { ...form };
      if (!form.password) delete updateBody.password;
      delete updateBody.confirmPassword;

      await axios.put(`${API_BASE_URL}/user/${id}`, updateBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("อัปเดตข้อมูลสำเร็จ");
      navigate("/AdminUserPage");
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
        <div className="admin-edit-box-edit">
          <h2 className="admin-tag-edit">แก้ไขข้อมูลผู้ใช้</h2>
          <form className="admin-info-edit" onSubmit={handleSubmit}>
            {/* รูปโปรไฟล์ */}
            <div className="admin-img-upload">
              <img
                src={form.picture || "/default-profile.png"}
                alt="profile"
                className="profile-preview"
              />
              <ImageUploader onUpload={(url) => setForm({ ...form, picture: url })} />
            </div>

            {/* ฟอร์มข้อมูล */}
            <div className="admin-info-box">
              <div className="admin-info-grid">
                <label>
                  รหัสผู้ใช้
                  <input type="text" value={id} disabled />
                </label>
                <label>
                  ชื่อผู้ใช้
                  <input type="text" name="username" value={form.username} onChange={handleChange} />
                </label>
                <label>
                  ชื่อจริง
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} />
                </label>
                <label>
                  นามสกุล
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} />
                </label>
                <label>
                  Email
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                </label>
                <label>
                  เพศ
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </label>
                <label>
                  วัน/เดือน/ปี เกิด
                  <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                </label>
                <label>
                  เบอร์โทรศัพท์
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                </label>
                <label>
                  อาชีพ
                  <input type="text" name="occupation" value={form.occupation} onChange={handleChange} />
                </label>
                <label>
                  ที่อยู่
                  <textarea name="address" value={form.address} onChange={handleChange} />
                </label>
                <label>
                  รหัสผ่านใหม่
                  <input type="password" name="password" value={form.password} onChange={handleChange} />
                </label>
                <label>
                  ยืนยันรหัสผ่าน
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                </label>
              </div>

              {/* ปุ่ม */}
              <div className="btn-area">
                <button className="cancel-btn" type="button" onClick={() => navigate("/AdminUserPage")}>
                  ยกเลิก
                </button>
                <button className="confirm-btn2" type="submit">
                  ยืนยัน
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
