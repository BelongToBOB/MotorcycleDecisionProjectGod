import React, { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import '../style/Register.css'
import dropDown from '../images/dropdown.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API_BASE_URL from "../config";

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    job: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน")
    }

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
        address: form.address,
        occupation: form.job 
      })     
      toast.success("ลงทะเบียนสำเร็จ")
      navigate('/login')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด")
    }
  }

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="w-register">
          <div className="container">
            <form className="register_box" onSubmit={handleSubmit}>
              <h1>ลงทะเบียน</h1>
              <div className='register-form-input'>
                <div className='Username-input'>
                  <p>ชื่อผู้ใช้</p>
                  <input name="username" onChange={handleChange} type="text" className="registerinput" />
                </div>
                <div className='Email-input'>
                  <p>อีเมล</p>
                  <input name="email" onChange={handleChange} type="text" className="registerinput" />
                </div>
                <div className='first-name'>
                  <p>ชื่อจริง</p>
                  <input name="firstName" onChange={handleChange} type="text" className="registerinput" />
                </div>
                <div className='last-name'>
                  <p>นามสกุล</p>
                  <input name="lastName" onChange={handleChange} type="text" className="registerinput" />
                </div>
                <div className="dropdown">
                  <p>เพศ</p>
                  <select name="gender" onChange={handleChange} className="registerinput">
                    <option value="">เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
                <div className='date'>
                  <p>วัน/เดือน/ปี เกิด</p>
                  <input name="birthDate" onChange={handleChange} type="date" className="registerinput" />
                </div>
                <div className='phoneNumber'>
                  <p>เบอร์โทรศัพท์</p>
                  <input name="phone" onChange={handleChange} type="text" className="registerinput" />
                </div>
                <div className='address-regis'>
                  <p>ที่อยู่</p>
                  <textarea name="address" onChange={handleChange} className="addressInput" placeholder="ระบุที่อยู่ของคุณ..."></textarea>
                </div>
                <div className='job'>
                  <p>อาชีพ</p>
                  <input name="job" onChange={handleChange} type="text" className="registerinput" />
                </div>              
                <p></p>                
                <div className='password'>
                  <p>รหัสผ่าน</p>
                  <input name="password" onChange={handleChange} type="password" className="registerinput" />
                </div>
                <div className='password-confirm'>
                  <p>ยืนยันรหัสผ่าน</p>
                  <input name="confirmPassword" onChange={handleChange} type="password" className="registerinput" />
                </div>
              </div>
              <button type="submit" className="enter-button">ตกลง</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

