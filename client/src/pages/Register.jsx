import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../style/Register.css";
import dropDown from "../images/dropdown.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    job: "",
  });

  const provinces = [
    "กรุงเทพมหานคร",
    "กระบี่",
    "กาญจนบุรี",
    "กาฬสินธุ์",
    "กำแพงเพชร",
    "ขอนแก่น",
    "จันทบุรี",
    "ฉะเชิงเทรา",
    "ชลบุรี",
    "ชัยนาท",
    "ชัยภูมิ",
    "ชุมพร",
    "เชียงราย",
    "เชียงใหม่",
    "ตรัง",
    "ตราด",
    "ตาก",
    "นครนายก",
    "นครปฐม",
    "นครพนม",
    "นครราชสีมา",
    "นครศรีธรรมราช",
    "นครสวรรค์",
    "นนทบุรี",
    "นราธิวาส",
    "น่าน",
    "บึงกาฬ",
    "บุรีรัมย์",
    "ปทุมธานี",
    "ประจวบคีรีขันธ์",
    "ปราจีนบุรี",
    "ปัตตานี",
    "พระนครศรีอยุธยา",
    "พังงา",
    "พัทลุง",
    "พิจิตร",
    "พิษณุโลก",
    "เพชรบุรี",
    "เพชรบูรณ์",
    "แพร่",
    "ภูเก็ต",
    "มหาสารคาม",
    "มุกดาหาร",
    "แม่ฮ่องสอน",
    "ยโสธร",
    "ยะลา",
    "ร้อยเอ็ด",
    "ระนอง",
    "ระยอง",
    "ราชบุรี",
    "ลพบุรี",
    "ลำปาง",
    "ลำพูน",
    "ศรีสะเกษ",
    "สกลนคร",
    "สงขลา",
    "สตูล",
    "สมุทรปราการ",
    "สมุทรสงคราม",
    "สมุทรสาคร",
    "สระแก้ว",
    "สระบุรี",
    "สิงห์บุรี",
    "สุโขทัย",
    "สุพรรณบุรี",
    "สุราษฎร์ธานี",
    "สุรินทร์",
    "หนองคาย",
    "หนองบัวลำภู",
    "อ่างทอง",
    "อำนาจเจริญ",
    "อุดรธานี",
    "อุตรดิตถ์",
    "อุทัยธานี",
    "อุบลราชธานี",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }

    const finalJob = form.job === "อื่นๆ" ? form.jobOther : form.job;

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        birthDate: form.birthDate,
        phone: form.phone,
        province: form.province,
        occupation: finalJob,
      });
      toast.success("ลงทะเบียนสำเร็จ");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="w-register">
          <div className="container">
            <form className="register_box" onSubmit={handleSubmit}>
              <h1>ลงทะเบียน</h1>
              <div className="register-form-input">
                <div className="Username-input">
                  <p>ชื่อผู้ใช้</p>
                  <input
                    name="username"
                    onChange={handleChange}
                    type="text"
                    className="registerinput"
                  />
                </div>
                <div className="Email-input">
                  <p>อีเมล</p>
                  <input
                    name="email"
                    onChange={handleChange}
                    type="text"
                    className="registerinput"
                  />
                </div>
                <div className="first-name">
                  <p>ชื่อจริง</p>
                  <input
                    name="firstName"
                    onChange={handleChange}
                    type="text"
                    className="registerinput"
                  />
                </div>
                <div className="last-name">
                  <p>นามสกุล</p>
                  <input
                    name="lastName"
                    onChange={handleChange}
                    type="text"
                    className="registerinput"
                  />
                </div>
                <div className="dropdown">
                  <p>เพศ</p>
                  <select
                    name="gender"
                    onChange={handleChange}
                    className="registerinput"
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
                <div className="date">
                  <p>วัน/เดือน/ปี เกิด</p>
                  <input
                    name="birthDate"
                    onChange={handleChange}
                    type="date"
                    className="registerinput"
                  />
                </div>
                <div className="phoneNumber">
                  <p>เบอร์โทรศัพท์</p>
                  <input
                    name="phone"
                    onChange={handleChange}
                    type="text"
                    className="registerinput"
                  />
                </div>
                <div className="province">
                  <p>จังหวัดที่อาศัย</p>
                  <select
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className="registerinput"
                  >
                    <option value="">เลือกจังหวัด</option>
                    {provinces.map((prov, i) => (
                      <option key={i} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="job">
                  <p>อาชีพ</p>
                  <select
                    name="job"
                    value={form.job}
                    onChange={handleChange}
                    className="registerinput"
                  >
                    <option value="">เลือกอาชีพ</option>
                    <option value="นักเรียน">นักเรียน</option>
                    <option value="นักศึกษา">นักศึกษา</option>
                    <option value="พนักงานบริษัท">พนักงานบริษัท</option>
                    <option value="เจ้าของกิจการ">เจ้าของกิจการ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                {form.job === "อื่นๆ" && (
                  <div className="job-other">
                    <p>ระบุอาชีพ</p>
                    <input
                      type="text"
                      name="jobOther"
                      onChange={handleChange}
                      className="registerinput"
                      placeholder="กรอกอาชีพของคุณ"
                    />
                  </div>
                )}

                <div className="password">
                  <p>รหัสผ่าน</p>
                  <input
                    name="password"
                    onChange={handleChange}
                    type="password"
                    className="registerinput"
                  />
                </div>
                <div className="password-confirm">
                  <p>ยืนยันรหัสผ่าน</p>
                  <input
                    name="confirmPassword"
                    onChange={handleChange}
                    type="password"
                    className="registerinput"
                  />
                </div>
              </div>
              <button type="submit" className="enter-button">
                ตกลง
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
