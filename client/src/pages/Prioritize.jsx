import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../style/Prioritize.css";
import { useRecommend } from "../context/RecommendContext";
import API_BASE_URL from "../config";

const criteriaInit = [
  { id: "price", label: "ราคา" },
  { id: "cc", label: "CC" },
  { id: "maintenance", label: "ค่าบำรุงรักษา" },
  { id: "consumption", label: "อัตราสิ้นเปลือง" },
];

export default function Prioritize() {
  const [left, setLeft] = useState(criteriaInit); 
  const [right, setRight] = useState([]); 
  const { setPriority } = useRecommend();
  const navigate = useNavigate();

  const handleSelect = (id) => {
    const selected = left.find((c) => c.id === id);
    setLeft(left.filter((c) => c.id !== id));
    setRight([...right, selected]);
  };

  const handleRemove = (id) => {
    const removed = right.find((c) => c.id === id);
    setRight(right.filter((c) => c.id !== id));
    setLeft([...left, removed]);
  };

  const handleNext = () => {
    setPriority(right.map((c) => c.id));
    navigate("/Criterion");
  };

  return (
    <>
      <Navbar />
      <section className="section-prioritize">
        <div className="content-box-prioritize-out">
          <div className="content-box-prioritize">
            {/* ซ้าย: ตัวเลือก */}
            <div className="options">
              <h2>จัดลำดับเกณฑ์ </h2>
              {left.length === 0 && (
                <div style={{ color: "#888" }}>เลือกหมดแล้ว</div>
              )}
              {left.map((item) => (
                <button key={item.id} onClick={() => handleSelect(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            {/* ขวา: ลำดับเกณฑ์ที่เลือก */}
            <div className="rank">
              <div className="ranking-box">
                <h3>ลำดับความสำคัญ</h3>
                {right.length === 0 && (
                  <div style={{ color: "#888" }}>ยังไม่ได้เลือกลำดับ</div>
                )}
                {right.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                      padding: 10,
                    }}
                  >
                    <span style={{ fontSize: 18, marginRight: 10 }}>
                      {idx + 1}.
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <button
                      className="remove-buttonP"
                      onClick={() => handleRemove(item.id)}
                      type="button"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ปุ่มไปหน้าถัดไป */}
          <div className="button-space-prioritize">
            <Link to={"/Bikestyle"}>
              <button className="back-btn-prioritize">ย้อนกลับ</button>
            </Link>
            <button
              className="next-btn-prioritize"
              onClick={handleNext}
              disabled={right.length !== criteriaInit.length}
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
