import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/UserEdit.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUploader from "../components/ImageUploader";
import dropDown from '../images/dropdown.png';

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
      .get(`http://localhost:5000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setForm({
          username: res.data.username || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          gender: res.data.gender || "",
          birthDate: res.data.birthDate ? res.data.birthDate.split('T')[0] : "",
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

  const handleGender = (gender) => setForm({ ...form, gender });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }
    try {
      const updateBody = { ...form };
      if (!form.password) delete updateBody.password;
      delete updateBody.confirmPassword;

      await axios.put(
        `http://localhost:5000/api/user/${id}`,
        updateBody,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("อัปเดตข้อมูลสำเร็จ");
      navigate("/AdminUserPage");
    } catch (err) {
      toast.error("อัปเดตข้อมูลไม่สำเร็จ");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar/>
      <Sidebar />
      <section className='section-admin-page-edit'>
        <div className='admin-edit-box-edit'>
          <div className='admin-tag-edit'>
            <h2>แก้ไขข้อมูลผู้ใช้</h2>
          </div>
          <form className='admin-info-edit' onSubmit={handleSubmit}>
            <div className='admin-img-upload'>
              <div className='admin-img'>
                <img src={form.picture || "/default-profile.png"} alt="" />
              </div>
              <ImageUploader onUpload={url => setForm({ ...form, picture: url })} />
            </div>
            <div className='admin-info-box'>
              <div className='admin-info-grid'>
                <div className='admin-id'>
                  <h3>รหัสผู้ใช้</h3>
                  <input type="text" className='admin-id-input' value={id} disabled />
                </div>
                <div className='admin-name'>
                  <h3>ชื่อผู้ใช้</h3>
                  <input type="text" className='admin-name-input' name="username" value={form.username} onChange={handleChange} />
                </div>
                <div className='admin-name'>
                  <h3>ชื่อจริง</h3>
                  <input type="text" className='admin-name-input' name="firstName" value={form.firstName} onChange={handleChange} />
                </div>
                <div className='admin-name'>
                  <h3>นามสกุล</h3>
                  <input type="text" className='admin-name-input' name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
                <div className='admin-email'>
                  <h3>Email</h3>
                  <input type="text" className='admin-email-input' name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="dropdown-user-edit">
                  <h3>เพศ</h3>
                  <button type="button" className="dropbtn-user-edit">
                    {form.gender ? (form.gender === "male" ? "ชาย" : "หญิง") : "เลือกเพศ"}
                    <img className='dropDown-icon' src={dropDown} alt="dropDown" />
                  </button>
                  <div className="dropdown-content-user-edit">
                    <a href="#" onClick={() => handleGender("male")}>ชาย</a>
                    <a href="#" onClick={() => handleGender("female")}>หญิง</a>
                  </div>
                </div>
                <div className='date-user-edit'>
                  <h3>วัน/เดือน/ปี เกิด</h3>
                  <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="registerinputdate-user-edit" />
                </div>
                <div className='admin-phone'>
                  <h3>เบอร์โทรศัพท์</h3>
                  <input type="text" className='admin-phone-input' name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className='admin-phone'>
                  <h3>อาชีพ</h3>
                  <input type="text" className='admin-phone-input' name="occupation" value={form.occupation} onChange={handleChange} />
                </div>
                <div className='admin-address'>
                  <h3>ที่อยู่</h3>
                  <textarea className='admin-address-input' name="address" value={form.address} onChange={handleChange} />
                </div>
                <div className='admin-password'>
                  <h3>รหัสผ่าน</h3>
                  <input type="password" className='admin-password-input' name="password" value={form.password} onChange={handleChange} />
                </div>
                <div className='admin-confirm-password'>
                  <h3>ยืนยันรหัสผ่าน</h3>
                  <input type="password" className='admin-confirm-password-input' name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
              <div className='btn-area'>
                <button className='cancel-btn' type="button" onClick={() => navigate("/AdminUserPage")}>ยกเลิก</button>
                <button className='confirm-btn2' type="submit">ยืนยัน</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

