import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../style/Criterion.css";
import { useRecommend } from "../context/RecommendContext"; // <-- ต้องมี context นี้ด้วย!

export default function Criterion() {
  // สำหรับเก็บค่าที่เลือกในแต่ละหมวด
  const [selected, setSelected] = useState({
    price: "",
    cc: "",
    fuel: "",
    fuel_size: "",
    maintenance: "",
    brand: "",
  });

  const { setCriteria } = useRecommend();
  const navigate = useNavigate();

  const options = {
    price: [
      "ต่ำกว่า 50,000 บาท",
      "50,000 - 80,000 บาท",
      "80,001 - 150,000 บาท",
      "150,001 - 300,000 บาท",
      "300,001 - 600,000 บาท",
      "600,001 - 1,000,000 บาท",
      "มากกว่า 1,000,000 บาท",
    ],
    cc: [
      "110-125 cc",
      "126-200 cc",
      "201-400 cc",
      "401-700 cc",
      "701-999 cc",
      "999 cc ขึ้นไป",
    ],
    fuel: [
      "50-60 กม./ลิตร",
      "40-49 กม./ลิตร",
      "30-39 กม./ลิตร",
      "20-29 กม./ลิตร",
      "ต่ำกว่า 20 กม./ลิตร",
    ],
    fuel_size: [
      "น้อยกว่า 7.9 ลิตร",
      "8 - 10.9 ลิตร",
      "11 - 14.9 ลิตร",
      "15 - 19.9 ลิตร",
      "20 ลิตรขึ้นไป"
    ],
    maintenance: [
      "ต่ำกว่า 2,000 บาท/ปี",
      "2,001 - 5,000 บาท/ปี",
      "5,001 - 10,000 บาท/ปี",
      "10,001 - 20,000 บาท/ปี",
      "มากกว่า 20,000 บาท/ปี",
    ],
    brand: [
      "เลือกทุกแบรนด์",
      "Honda",
      "Yamaha",
      "Kawasaki",
      "Suzuki",
      "BMW",
      "Ducati",
      "GPX",
      "Royal Enfield",
      "Harley-Davidson",
    ],
  };

  // เมื่อเลือกแต่ละตัวเลือก
  const handleSelect = (type, value) => {
    setSelected((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // ถัดไป
  const handleNext = () => {
    setCriteria(selected); // บันทึกลง context
    navigate("/Result");
  };

  return (
    <>
      <Navbar />
      <section className="section-criterion">
        <div className="content-box-criterion-out">
          <div className="content-box-criterion">
            <h2 className="choice-text">ตัวเลือก</h2>
            <div className="data-choice">
              {/* ราคา */}
              <div className="price">
                <h3>ราคา</h3>
                {options.price.map((range, i) => (
                  <div key={i} className="button-con">
                    <button
                      className={`check-btn ${
                        selected.price === range ? "active" : ""
                      }`}
                      onClick={() => handleSelect("price", range)}
                      type="button"
                    />
                    <p>{range}</p>
                  </div>
                ))}
              </div>

              {/* CC */}
              <div className="cc">
                <h3>CC</h3>
                {options.cc.map((cc, i) => (
                  <div key={i} className="button-con">
                    <button
                      className={`check-btn ${
                        selected.cc === cc ? "active" : ""
                      }`}
                      onClick={() => handleSelect("cc", cc)}
                      type="button"
                    />
                    <p>{cc}</p>
                  </div>
                ))}
              </div>

              {/* อัตราสิ้นเปลือง */}
              <div className="fuel">
                <h3>อัตราสิ้นเปลือง</h3>
                {options.fuel.map((fuel, i) => (
                  <div key={i} className="button-con">
                    <button
                      className={`check-btn ${
                        selected.fuel === fuel ? "active" : ""
                      }`}
                      onClick={() => handleSelect("fuel", fuel)}
                      type="button"
                    />
                    <p>{fuel}</p>
                  </div>
                ))}
              </div>

              {/* ขนาดถังน้ำมัน */}
              <div className="fuel-size">
                <h3>ขนาดถังน้ำมัน</h3>
                {options.fuel_size.map((sz, i) => (
                  <div key={i} className="button-con">
                    <button
                      className={`check-btn ${
                        selected.fuel_size === sz ? "active" : ""
                      }`}
                      onClick={() => handleSelect("fuel_size", sz)}
                      type="button"
                    />
                    <p>{sz}</p>
                  </div>
                ))}
              </div>

              {/* ค่าบำรุงรักษา */}
              <div className="maintenance">
                <h3>ค่าบำรุงรักษา</h3>
                {options.maintenance.map((fee, i) => (
                  <div key={i} className="button-con">
                    <button
                      className={`check-btn ${
                        selected.maintenance === fee ? "active" : ""
                      }`}
                      onClick={() => handleSelect("maintenance", fee)}
                      type="button"
                    />
                    <p>{fee}</p>
                  </div>
                ))}
              </div>

              <div className="brand">
                <h3>ยี่ห้อ</h3>
                <div className="brand-options">
                  {options.brand.map((b, i) => (
                    <div key={i} className="button-con">
                      <button
                        className={`check-btn ${
                          selected.brand === b ? "active" : ""
                        }`}
                        onClick={() => handleSelect("brand", b)}
                        type="button"
                      />
                      <p>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="button-space-prioritize">
              <Link to={"/Prioritize"}>
                <button className="back-btn-prioritize">ย้อนกลับ</button>
              </Link>
              <button
                className="next-btn-prioritize"
                onClick={handleNext}
                disabled={Object.values(selected).some((v) => !v)}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
