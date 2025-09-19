import React from 'react'
import { Link } from 'react-router-dom'
import '../style/BikeListBox.css'

export default function BikeListBox({ bike, onDelete }) {
  return (
    <div className='info-admin-box'>
      <div className='info-part'>
        <div className='info-admin-img-bikeList'>
          <img src={bike.picture || "/default-bike.png"} alt="" />
        </div>
        <div className='info-admin'>
          <p>ชื่อรถจักรยานยนต์: {bike.moto_name}</p>
          <p>ยี่ห้อ: {bike.moto_brand}</p>
          <p>น้ำหนัก: {bike.moto_weight}</p>
          <p>cc: {bike.moto_cc}</p>
          <p>ค่าบำรุงรักษาปีแรก: {bike.maintenance_cost}</p>
          <p>อัตราสิ้นเปลือง: {bike.consumption_rate}</p>
          <p>เนื้อหา: {bike.moto_content}</p>
          <p>ราคา: {bike.moto_price}</p>
        </div>
      </div>
      <div className='edit-part'>
        <Link to={`/BikeListEdit/${bike.motorcycle_id}`}>
          <button className='edit-btn-bikeList'>แก้ไข</button>
        </Link>
        <button className='delete-btn-bikeList' onClick={() => onDelete(bike.motorcycle_id)}>
          ลบ
        </button>
      </div>
    </div>
  )
}

