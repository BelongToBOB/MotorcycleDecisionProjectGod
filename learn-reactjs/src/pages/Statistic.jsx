import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/Statistic.css";

export default function Statistic() {
  const [stat, setStat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/statistic", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setStat(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stat) return <div>ไม่สามารถโหลดข้อมูลสถิติได้</div>;

  return (
    <>
      <Navbar />
      <Sidebar/>
      <div className="statistic-section">
        <h2>รายงานสถิติการเลือก</h2>
        <div className="stat-card">
          <h3>รุ่นรถที่ถูกเลือกมากที่สุด</h3>
          <ol>
            {stat.topModels.map(({ model, count }, i) => (
              <li key={model}><b>{model}</b> : {count} ครั้ง</li>
            ))}
          </ol>
        </div>

        <div className="stat-card">
          <h3>ประเภทที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.typeCount).map(([type, count]) => (
              <li key={type}><b>{type}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>ยี่ห้อที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.brandCount).map(([brand, count]) => (
              <li key={brand}><b>{brand}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>ช่วงราคาที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.priceCount).map(([price, count]) => (
              <li key={price}><b>{price}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>CC ที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.ccCount).map(([cc, count]) => (
              <li key={cc}><b>{cc}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>อัตราสิ้นเปลืองที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.fuelCount).map(([fuel, count]) => (
              <li key={fuel}><b>{fuel}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>ขนาดถังน้ำมันที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.fuelSizeCount).map(([sz, count]) => (
              <li key={sz}><b>{sz}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>ค่าบำรุงรักษาที่ถูกเลือกบ่อย</h3>
          <ul>
            {Object.entries(stat.maintenanceCount).map(([m, count]) => (
              <li key={m}><b>{m}</b> : {count} ครั้ง</li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>10 ประวัติล่าสุด</h3>
          <ul>
            {stat.latest.map((h, idx) => (
              <li key={h.id}>
                #{idx + 1} | User: {h.userId} | ประเภท: {h.selectedType} | ยี่ห้อ: {h.criteria?.brand} | {new Date(h.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
