import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Contact.css";
import cb from "../images/cb1000_3-removebg-preview.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return toast.error("กรุณาเข้าสู่ระบบก่อนส่งข้อความ");
    try {
      const res = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("ส่งข้อความเรียบร้อยแล้ว!");
        setForm({ name: "", email: "", tel: "", content: "" });
      } else {
        toast.error("ส่งข้อความไม่สำเร็จ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <section className="section-contact">
        <div className="container-contact">
          {/* ฝั่งข้อมูลการติดต่อ */}
          <div className="contactus">
            <h2>ติดต่อเรา</h2>
            <p className="address">
              ที่อยู่ : 150 ถ.ศรีจันทร์ ต.ในเมือง อ.เมือง จ.ขอนแก่น Khon Kaen,
              Thailand, 40000 <br />
              Tel. 999999999
            </p>
            <p className="time">เวลาติดต่อ: 9.00am - 6.00pm</p>
            <div className="contact-img">
              <img src={cb} alt="cb1000" />
            </div>
          </div>

          {/* ฝั่งฟอร์ม */}
          <div className="contactform">
            <form className="insideform" onSubmit={handleSubmit}>
              <h3>แบบฟอร์มติดต่อ</h3>
              <div className="info-form">
                <input
                  type="text"
                  name="name"
                  placeholder="ชื่อ-นามสกุล"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="tel"
                  placeholder="เบอร์โทรติดต่อ"
                  value={form.tel}
                  onChange={handleChange}
                />
                <textarea
                  name="content"
                  placeholder="ข้อความ"
                  value={form.content}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="confirm-btn" type="submit" disabled={loading}>
                {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
              </button>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginTop: "0.5rem",
                }}
              >
                *โปรดกรอกข้อมูลให้ครบถ้วนเพื่อความสะดวกในการติดต่อกลับ
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
