import React from 'react';
import '../style/BikeDetailCard.css';

export default function BikeDetailCard({ bike, onClose }) {
  if (!bike) return null;
  return (
    <div className="bike-modal-backdrop" onClick={onClose}>
      <div className="bike-modal-card" onClick={e => e.stopPropagation()}>
        <button className="bike-modal-close" onClick={onClose}>✕</button>
        <div className="bike-modal-header">
          <img src={bike.picture || '/default-bike.png'} alt={bike.moto_name} />
          <div>
            <h2>{bike.moto_name}</h2>
            <h4>ยี่ห้อ: {bike.moto_brand}</h4>
            <h5>ประเภท: {bike.moto_type?.moto_type_name || '-'}</h5>
          </div>
        </div>
        <div className="bike-modal-body">
          <ul>
            <li><b>CC:</b> {bike.moto_cc} cc</li>
            <li><b>น้ำหนัก:</b> {bike.moto_weight} กก.</li>
            <li><b>ราคา:</b> {bike.moto_price?.toLocaleString()} บาท</li>
            <li><b>ค่าบำรุงรักษาปีแรก:</b> {bike.maintenance_cost?.toLocaleString()} บาท</li>
            <li><b>อัตราสิ้นเปลือง:</b> {bike.consumption_rate} กม./ลิตร</li>
            <li><b>ขนาดถังน้ำมัน:</b> {bike.fuel_size} ลิตร</li>
          </ul>
          <p className="bike-modal-desc">{bike.moto_content}</p>
        </div>
      </div>
    </div>
  );
}
