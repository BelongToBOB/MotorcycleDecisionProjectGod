import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function BikeTypeAdd() {
  const [moto_type_name, setName] = useState("")
  const [picture, setPicture] = useState("") // <-- state เก็บ url รูป
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  // handle file input
  const handleFileChange = async e => {
    const img = e.target.files[0]
    if (!img) return;
    const formData = new FormData()
    formData.append('image', img)
    try {
      const res = await axios.post("http://localhost:5000/api/upload/image", formData)
      setPicture(res.data.url) // ได้ url จาก cloudinary
      toast.success("อัปโหลดรูปสำเร็จ")
    } catch {
      toast.error("อัปโหลดรูปไม่สำเร็จ")
    }
  }

  // submit เพิ่มประเภท
  const handleSubmit = async e => {
    e.preventDefault()
    if (!moto_type_name.trim()) return toast.error("กรุณาระบุชื่อประเภท")
    try {
      await axios.post("http://localhost:5000/api/mototype", 
        { moto_type_name, picture }, // <<--- ส่ง picture ไปด้วย
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
      )
      toast.success("เพิ่มข้อมูลสำเร็จ")
      navigate("/BikeTypeEdit")
    } catch {
      toast.error("เพิ่มข้อมูลไม่สำเร็จ")
    }
  }

  return (
    <>
      <Navbar/>
      <Sidebar />
      <section className='section-admin-page-edit'>
        <div className='admin-edit-box-edit'>
          <div className='admin-tag-edit'><h2>เพิ่มข้อมูลประเภท</h2></div>
          <form className='admin-info-edit' onSubmit={handleSubmit}>
            <div className='admin-info-box'>
              <div className='admin-info-grid-bike-add'>
                <div className='admin-name'>
                  <h3>ชื่อประเภท</h3>
                  <input
                    type="text"
                    className='admin-name-input'
                    value={moto_type_name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className='admin-img-upload'>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {picture && <img src={picture} alt="preview" style={{maxHeight:60}} />}
                </div>
              </div>
              <div className='btn-area'>
                <button className='cancel-btn' type="button" onClick={()=>navigate("/BikeTypeEdit")}>ยกเลิก</button>
                <button className='confirm-btn2' type="submit">ยืนยัน</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
