import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import '../style/Contact.css'
import cb from '../images/cb1000_3-removebg-preview.png'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', tel: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return toast.error("กรุณาเข้าสู่ระบบก่อนส่งข้อความ");
    try {
      const res = await fetch('http://localhost:5000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success("ส่งข้อความเรียบร้อยแล้ว!");
        setForm({ name: '', email: '', tel: '', content: '' });
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
          <div className="contactus">
            <h2 className="contactus-text">ติดต่อเรา</h2>
            <p className="address">
              ที่อยู่ : 150 ถ.ศรีจันทร์ ต.ในเมือง อ.เมือง จ.ขอนแก่น Khon Kean, Thailand, 40000 <br /> Tel.999999999
            </p>
            <p className="time">
              เวลาติดต่อ <br /> 9.00am-6.00pm
            </p>
            <div className="contact-img">
              <img src={cb} alt="cb1000" />
            </div>
          </div>
          <div className="contactform">
            <form className="insideform" onSubmit={handleSubmit}>
              <div className="buttonform">
                <button className="confirm-btn" type="submit" disabled={loading}>แบบฟอร์มติดต่อ</button>
                <p>*โปรดระบุข้อมูลให้ครบถ้วนเพื่อความสะดวกในการติดต่อกลับ</p>
              </div>
              <div className="info-form">
                <div className="textform">
                  <div className="name">
                    <p>ชื่อ-นามสกุล</p>
                    <input type="text" name="name" placeholder="Enter name" className="nameform"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="email">
                    <p>E-mail</p>
                    <input type="email" name="email" placeholder="Enter email" className="emailform"
                      value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="tel">
                    <p>เบอร์โทรติดต่อ</p>
                    <input type="text" name="tel" placeholder="Enter tel" className="telform"
                      value={form.tel} onChange={handleChange} />
                  </div>
                </div>
                <div className="message">
                  <p>ข้อความ</p>
                  <textarea name="content" placeholder="Enter message" className="message"
                    value={form.content} onChange={handleChange} required />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
