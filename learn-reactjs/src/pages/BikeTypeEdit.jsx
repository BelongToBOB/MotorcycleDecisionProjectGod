import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '../style/BikeTypeEdit.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import BikeTypeBox from '../components/BikeTypeBox'
import Swal from 'sweetalert2'

export default function BikeTypeEdit() {
  const [types, setTypes] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios.get("http://localhost:5000/api/mototype", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setTypes(res.data)
    })
    .catch(() => toast.error("โหลดข้อมูลไม่สำเร็จ"))
  }, []);
  
  const handleDelete = async (moto_type_id) => {
  const result = await Swal.fire({
    title: 'ยืนยันลบประเภทนี้?',
    text: 'หากลบประเภทนี้ รถจักรยานยนต์ประเภทนี้จะไม่สามารถใช้งานได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#3085d6"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:5000/api/mototype/${moto_type_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTypes(types.filter(type => type.moto_type_id !== moto_type_id));
      Swal.fire('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message;
      Swal.fire('ลบไม่สำเร็จ', msg || 'เกิดข้อผิดพลาดที่ server', 'error');
    }
  }
};
  

  const filtered = types.filter(
    t => t.moto_type_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar/>
      <Sidebar />
      <section className='section-admin-page'>
        <div className='admin-edit-box'>
          <div className='admin-tag'>
            <h2>ข้อมูลประเภทรถจักรยานยนต์</h2>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาชื่อประเภท"
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className='BikeTypeBox-main'>
            <div className='add-btn'>
              <Link to={'/BikeTypeAdd'}><button>เพิ่ม +</button></Link>
            </div>
            {filtered.map(type =>
              <BikeTypeBox key={type.moto_type_id} type={type} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </section>
    </>
  )
}


