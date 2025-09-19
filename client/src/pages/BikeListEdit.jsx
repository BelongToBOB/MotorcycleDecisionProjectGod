import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import ImageUploader from '../components/ImageUploader'
import '../style/BikeListEdit.css'
import API_BASE_URL from "../config";

export default function BikeListEdit() {
  const { id } = useParams();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    moto_name: "",
    moto_brand: "",
    moto_weight: "",
    moto_cc: "",
    maintenance_cost: "",
    consumption_rate: "",
    moto_content: "",
    moto_price: "",
    moto_type_id: "",
    picture: "",
    fuel_size: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // โหลดข้อมูลเดิมของมอไซค์
    axios.get(`${API_BASE_URL}/motorcycle/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      const d = res.data;
      setForm({
        moto_name: d.moto_name || "",
        moto_brand: d.moto_brand || "",
        moto_weight: d.moto_weight || "",
        moto_cc: d.moto_cc || "",
        maintenance_cost: d.maintenance_cost || "",
        consumption_rate: d.consumption_rate || "",
        moto_content: d.moto_content || "",
        moto_price: d.moto_price || "",
        moto_type_id: d.moto_type_id || "",
        picture: d.picture || "",
        fuel_size: d.fuel_size || ""
      });
    }).catch(() => toast.error("โหลดข้อมูลไม่สำเร็จ"));

    // โหลดประเภท
    axios.get(`${API_BASE_URL}/api/mototype`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setTypes(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageUpload = url => setForm(f => ({ ...f, picture: url }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.moto_name || !form.moto_type_id) return toast.error("กรอกข้อมูลให้ครบ");

    try {
      await axios.put(`${API_BASE_URL}/motorcycle/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("บันทึกข้อมูลสำเร็จ");
      navigate("/BikeList");
    } catch {
      toast.error("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className='section-admin-page-edit'>
        <div className='admin-edit-box-edit'>
          <div className='admin-tag-edit'><h2>แก้ไขข้อมูลรถจักรยานยนต์</h2></div>
          <form className="my-form-bg" onSubmit={handleSubmit}>
            <div className='admin-info-box'>
              <div className='admin-info-grid-bike-list-add'>
                <div className='admin-img-upload'>
                  <h3>รูปภาพ</h3>
                  <ImageUploader value={form.picture} onUpload={handleImageUpload} />
                </div>
                <div className='bike-type'>
                  <h3>ประเภท</h3>
                  <select
                    name="moto_type_id"
                    className='bike-type-input'
                    value={form.moto_type_id}
                    onChange={handleChange}
                  >
                    <option value="">--เลือกประเภท--</option>
                    {types.map(t => (
                      <option key={t.moto_type_id} value={t.moto_type_id}>
                        {t.moto_type_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='edit-bike-column'>
                  <div className='bike-brand'>
                    <h3>ยี่ห้อ</h3>
                    <input name="moto_brand" className='bike-brand-input' value={form.moto_brand} onChange={handleChange} />
                  </div>
                  <div className='bike-name-input'>
                    <h3>ชื่อรถจักรยานยนต์</h3>
                    <input name="moto_name" className='bike-name-input' value={form.moto_name} onChange={handleChange} />
                  </div>
                  <div className='bike-manter'>
                    <h3>ค่าบำรุงรักษาปีแรก</h3>
                    <input name="maintenance_cost" className='bike-manter-input' value={form.maintenance_cost} onChange={handleChange} />
                  </div>
                  <div className='bike-kml'>
                    <h3>อัตราสิ้นเปลือง</h3>
                    <input name="consumption_rate" className='bike-kml-input' value={form.consumption_rate} onChange={handleChange} />
                  </div>
                  <div className='bike-weight'>
                    <h3>น้ำหนัก</h3>
                    <input name="moto_weight" className='bike-weight-input' value={form.moto_weight} onChange={handleChange} />
                  </div>
                  <div className='bike-cc'>
                    <h3>cc</h3>
                    <input name="moto_cc" className='bike-cc-input' value={form.moto_cc} onChange={handleChange} />
                  </div>
                  <div className='bike-fuel-size'>
                    <h3>ขนาดถังน้ำมัน (ลิตร)</h3>
                    <input name="fuel_size" className='bike-fuel-size-input' value={form.fuel_size} onChange={handleChange} />
                  </div>
                  <div className='bike-price'>
                    <h3>ราคา</h3>
                    <input name="moto_price" className='bike-price-input' value={form.moto_price} onChange={handleChange} />
                  </div>
                  <div className='bike-moreInfo'>
                    <h3>รายละเอียด</h3>
                    <textarea name="moto_content" className='bike-moreInfo-input' value={form.moto_content} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className='btn-area'>
                <button className='cancel-btn' type="button" onClick={() => navigate("/BikeList")}>ยกเลิก</button>
                <button className='confirm-btn2' type="submit">ยืนยัน</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
