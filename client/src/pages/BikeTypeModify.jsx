import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import ImageUploader from '../components/ImageUploader'
import '../style/BikeTypeModify.css'

export default function BikeTypeModify() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    moto_type_name: "",
    picture: "",
  })

  useEffect(() => {
    axios.get(`http://localhost:5000/api/mototype/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setForm({
        moto_type_name: res.data.moto_type_name || "",
        picture: res.data.picture || ""
      })
    })
    .catch(() => toast.error("โหลดข้อมูลไม่สำเร็จ"))
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = url => setForm(f => ({ ...f, picture: url }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.moto_type_name.trim()) return toast.error("กรุณาระบุชื่อประเภท")
    try {
      await axios.put(`http://localhost:5000/api/mototype/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      toast.success("อัปเดตข้อมูลสำเร็จ")
      navigate("/BikeTypeEdit")
    } catch {
      toast.error("อัปเดตข้อมูลไม่สำเร็จ")
    }
  }

  return (
    <>
      <Navbar/>
      <Sidebar />
      <section className='section-admin-page-edit'>
        <div className='admin-edit-box-edit'>
          <div className='admin-tag-edit'><h2>แก้ไขข้อมูลประเภท</h2></div>
          <form className='bikeModify-info-edit' onSubmit={handleSubmit}>
            <div className='admin-info-box'>
              <div className='admin-info-grid-bike-add'>
              <div className='admin-img-upload'>
                  <h3>รูปภาพประเภท</h3>
                  <ImageUploader
                    value={form.picture}
                    onUpload={handleImageChange} 
                    className="preview-img"
                  />
                </div>
                <div className='admin-id'>
                  <h3>รหัสประเภท</h3>
                  <input type="text" className='admin-id-input' value={id} disabled />
                </div>
                <div className='admin-name'>
                  <h3>ชื่อประเภท</h3>
                  <input
                    type="text"
                    name="moto_type_name"
                    className='admin-name-input'
                    value={form.moto_type_name}
                    onChange={handleChange}
                  />
                </div>
                <div className='btn-area'>
                    <button className='cancel-btn' type="button" onClick={()=>navigate("/BikeTypeEdit")}>ยกเลิก</button>
                    <button className='confirm-btn2' type="submit">ยืนยัน</button>
                </div>
              </div>
            </div>
            
          </form>
        </div>
      </section>
    </>
  )
}
