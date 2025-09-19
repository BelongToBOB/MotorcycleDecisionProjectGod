import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/BikeStyle.css";
import { useNavigate } from "react-router-dom";
import { useRecommend } from "../context/RecommendContext";
import axios from "axios";

export default function BikeStyle() {
  const { setSelectedType, selectedType } = useRecommend();
  const [types, setTypes] = useState([]);
  const [showDetail, setShowDetail] = useState(null);
  const navigate = useNavigate();

  // ✅ คำอธิบายเพิ่มเติมเก็บไว้ใน frontend
  const descriptions = {
    1: "ใช้งานทั่วไป ขับง่าย ประหยัดน้ำมัน เหมาะกับทุกเพศทุกวัย",
    2: "ออโต้เมติก ใช้งานในเมือง คล่องตัว มีพื้นที่เก็บของ",
    3: "แรง ดีไซน์โฉบเฉี่ยว เหมาะกับผู้ที่ชอบความเร็วและสไตล์",
    4: "สไตล์วินเทจ คลาสสิค เหมาะกับสายแฟชั่นและสะสม",
    5: "เดินทางไกล นั่งสบาย ไปได้ทุกที่ เหมาะกับสายท่องเที่ยว",
    6: "ลุยป่า ลุยทางฝุ่น เหมาะกับสายผจญภัย",
    7: "สปอร์ตเปลือย คล่องตัว ใช้ได้ทั้งในเมืองและทางไกล",
    8: "ใหญ่ ทรงเท่ ขับทางไกลนั่งสบาย เหมาะกับสายชิลล์",
    9: "คลาสสิคขั้นสุด ดีไซน์ย้อนยุค เหมาะกับสายสะสมและแฟชั่น",
    10: "เดินทางไกลทุกสภาพถนน ลุยได้ทั้งถนนดำและถนนลูกรัง",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }
    axios
      .get("http://localhost:5000/api/mototype", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTypes(res.data))
      .catch(() => setTypes([]));
  }, []);

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    navigate("/Prioritize");
  };

  const toggleDetail = (typeId) => {
    setShowDetail(showDetail === typeId ? null : typeId);
  };

  return (
    <>
      <Navbar />
      <section className="container-bikeStyle">
        <div className="content-box">
          <div className="typetext">
            <h1>เลือกประเภทรถจักรยานยนต์</h1>
            <div className="typebike-box">
              {types.length === 0 && <div>ไม่พบข้อมูลประเภท</div>}
              {types.map((type) => (
                <div key={type.moto_type_id} className="type-wrapper">
                  <div
                    className={`type-choice ${
                      selectedType === type.moto_type_id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectType(type.moto_type_id)}
                  >
                    <img
                      src={type.picture || "/default-bike-type.png"}
                      alt={type.moto_type_name}
                    />
                    <p>{type.moto_type_name}</p>

                    {/* ปุ่ม ℹ️ */}
                    <button
                      className="info-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDetail(type.moto_type_id);
                      }}
                    >
                      ℹ
                    </button>
                  </div>

                  {/* แสดงคำอธิบายจาก frontend */}
                  {showDetail === type.moto_type_id && (
                    <div className="detail-box">
                      <h4>{type.moto_type_name}</h4>
                      <p>
                        {descriptions[type.moto_type_id] ||
                          "ไม่มีรายละเอียดเพิ่มเติม"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
