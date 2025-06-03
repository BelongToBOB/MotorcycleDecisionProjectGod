import React from 'react'
import { Link } from 'react-router-dom'
import '../style/BikeTypeBox.css'
import Swal from "sweetalert2";

export default function BikeTypeBox({ type, onDelete }) {
  return (
    <div className='info-admin-box'>
      <div className='info-part'>
        <div className='info-admin-img'>
          <img src={type.picture || "/default-bike-type.png"} alt="" />
        </div>
        <div className='info-admin'>
          <p>รหัสประเภท: {type.id}</p>
          <p>ชื่อประเภท: {type.moto_type_name}</p>
        </div>
      </div>
      <div className='edit-part'>
        <Link to={`/BikeTypeModify/${type.id}`}>
          <button className='edit-btn'>แก้ไข</button>
        </Link>
        <button className='delete-btn' onClick={() => onDelete(type.id)}>ลบ</button>
      </div>
    </div>
  )
}


