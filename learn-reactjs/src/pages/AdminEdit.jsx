import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/AdminEdit.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUploader from "../components/ImageUploader";

export default function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admin/${id}`, {
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
        setLoading(false);
      })
      .catch(() => {
        toast.error("ไม่พบข้อมูลแอดมิน");
        navigate("/AdminBo");
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

      await axios.put(`http://localhost:5000/api/admin/${id}`, updateBody, {
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
        <div className="admin-edit-box-edit">
          <div className="admin-tag-edit">
            <h2>แก้ไขข้อมูลผู้ดูแลระบบ</h2>
          </div>
          <form className="admin-info-edit" onSubmit={handleSubmit}>
            <div className="admin-img-upload">
              <div className="admin-img">
                <img src={form.picture || "/default-profile.png"} alt="" />
              </div>
              <ImageUploader
                onUpload={(url) => setForm({ ...form, picture: url })}
              />
            </div>

            <div className="admin-info-box">
              <div className="admin-info-grid">
                <div className="admin-id">
                  <h3>รหัสผู้ดูแลระบบ</h3>
                  <input
                    type="text"
                    className="admin-id-input"
                    value={id}
                    disabled
                  />
                </div>
                <div className="admin-name">
                  <h3>ชื่อผู้ดูแลระบบ</h3>
                  <input
                    type="text"
                    name="username"
                    className="admin-name-input"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-email">
                  <h3>Email</h3>
                  <input
                    type="email"
                    name="email"
                    className="admin-email-input"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-phone">
                  <h3>เบอร์โทรศัพท์</h3>
                  <input
                    type="text"
                    name="phone"
                    className="admin-phone-input"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-address">
                  <h3>ที่อยู่</h3>
                  <textarea
                    name="address"
                    className="admin-address-input"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-password">
                  <h3>รหัสผ่านใหม่ (ถ้าไม่เปลี่ยน ปล่อยว่าง)</h3>
                  <input
                    type="password"
                    name="password"
                    className="admin-password-input"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-confirm-password">
                  <h3>ยืนยันรหัสผ่าน</h3>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="admin-confirm-password-input"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="btn-area">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => navigate("/AdminBo")}
                >
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
