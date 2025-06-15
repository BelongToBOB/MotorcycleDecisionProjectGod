import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../style/Criterion.css";
import { useRecommend } from "../context/RecommendContext";

const PRICE_ORDER = [
  "ไม่เกิน 50,000 บาท",
  "50,000 - 100,000 บาท",
  "100,000 - 200,000 บาท",
  "200,001 - 500,000 บาท",
  "มากกว่า 500,000 บาท",
];
const CC_ORDER = [
  "110-125 cc",
  "126-160 cc",
  "161-300 cc",
  "301-500 cc",
  "501-999 cc",
  "1000 cc ขึ้นไป",
];

const FUEL_ORDER = [
  "60-40 กม./ลิตร",
  "40-30 กม./ลิตร",
  "30-20 กม./ลิตร",
  "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)",
];
const MAINT_ORDER = [
  "ต่ำกว่า 2,000 บาท/ปี",
  "2,000 - 5,000 บาท/ปี",
  "5,000 - 10,000 บาท/ปี",
  "มากกว่า 10,000 บาท/ปี",
];
const BRAND_ORDER = [
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
];

export default function Criterion() {
  const { selectedType, setCriteria } = useRecommend();
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    price: [], cc: [], fuel: [], maintenance: [], brand: []
  });
  const [available, setAvailable] = useState({
    price: [], cc: [], fuel: [], maintenance: [], brand: []
  });
  const [selected, setSelected] = useState({
    price: "", cc: "", fuel: "", maintenance: "", brand: ""
  });

  const fetchOptions = async (criteria = {}) => {
    try {
      const qs = new URLSearchParams({ typeId: selectedType, ...criteria });
      const res = await fetch(
        `http://localhost:5000/api/criteria-options-dynamic?${qs.toString()}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (!res.ok) {
        console.error(`API error ${res.status}`);
        setOptions({ price: [], cc: [], fuel: [], maintenance: [], brand: [] });
        setAvailable({ price: [], cc: [], fuel: [], maintenance: [], brand: [] });
        return;
      }

      const data = await res.json();
      const {
        price:       priceData       = [],
        cc:          ccData          = [],
        fuel:        fuelData        = [],
        maintenance: maintData       = [],
        brand:       brandData       = [],
      } = data || {};

      setOptions({
        price:       PRICE_ORDER.filter(l => priceData.includes(l)),
        cc:          CC_ORDER.filter(l    => ccData.includes(l)),
        fuel:        FUEL_ORDER.filter(l  => fuelData.includes(l)),
        maintenance: MAINT_ORDER.filter(l => maintData.includes(l)),
        brand:       BRAND_ORDER
      });

      setAvailable({
        price:       priceData,
        cc:          ccData,
        fuel:        fuelData,
        maintenance: maintData,
        brand:       brandData,
      });
    } catch (err) {
      console.error("โหลด options ไม่สำเร็จ", err);
      // ไม่ต้องทำอะไรเพิ่มเติม ให้ UI รับรู้ options คงเดิม
    }
  };

  useEffect(() => {
    if (!selectedType) return;
    fetchOptions();
  }, [selectedType]);

  const handleSelect = (key, value) => {
  const next = { ...selected };

  if (key === "brand") {
    // reset ทุกอย่างยกเว้น brand
    next.price = "";
    next.cc = "";
    next.fuel = "";
    next.maintenance = "";
  }

  next[key] = value;
  setSelected(next);
  fetchOptions(next);
};


  const isDisabled = (key, value) => {
  if (key === "brand" && value === "เลือกทุกแบรนด์") return false;
  const arr = available[key] || [];
  return !arr.includes(value);
};

  const handleNext = () => {
    setCriteria(selected);
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

              {/* ยี่ห้อ */}
              <div className="brand">
                <h3>ยี่ห้อ</h3>
                {options.brand.length
                  ? options.brand.map((r, i) => (
                      <div key={i} className="button-con">
                        <button
                          className={`check-btn ${selected.brand === r ? "active" : ""}`}
                          onClick={() => handleSelect("brand", r)}
                          type="button"
                        />
                        <p>{r}</p>
                      </div>
                    ))
                  : <p className="note-empty">ไม่มีตัวเลือกในหมวดนี้</p>
                }
              </div>

              {/* งบประมาณ */}
              <div className="price">
                <h3>งบประมาณ</h3>
                {options.price.length
                  ? options.price.map((r, i) => (
                      <div key={i} className="button-con">
                        <button
                          disabled={isDisabled("price", r)}
                          className={`check-btn ${selected.price === r ? "active" : ""}`}
                          onClick={() => handleSelect("price", r)}
                          type="button"
                        />
                        <p>{r}</p>
                      </div>
                    ))
                  : <p className="note-empty">ไม่มีตัวเลือกในหมวดนี้</p>
                }
              </div>

              {/* CC */}
              <div className="cc">
                <h3>CC</h3>
                {options.cc.length
                  ? options.cc.map((r, i) => (
                      <div key={i} className="button-con">
                        <button
                          disabled={isDisabled("cc", r)}
                          className={`check-btn ${selected.cc === r ? "active" : ""}`}
                          onClick={() => handleSelect("cc", r)}
                          type="button"
                        />
                        <p>{r}</p>
                      </div>
                    ))
                  : <p className="note-empty">ไม่มีตัวเลือกในหมวดนี้</p>
                }
              </div>

              {/* อัตราสิ้นเปลือง */}
              <div className="fuel">
                <h3>อัตราสิ้นเปลือง</h3>
                {options.fuel.length
                  ? options.fuel.map((r, i) => (
                      <div key={i} className="button-con">
                        <button
                          disabled={isDisabled("fuel", r)}
                          className={`check-btn ${selected.fuel === r ? "active" : ""}`}
                          onClick={() => handleSelect("fuel", r)}
                          type="button"
                        />
                        <p>{r}</p>
                      </div>
                    ))
                  : <p className="note-empty">ไม่มีตัวเลือกในหมวดนี้</p>
                }
              </div>

              {/* ค่าบำรุงรักษา */}
              <div className="maintenance">
                <h3>ค่าบำรุงรักษาในปีแรก</h3>
                {options.maintenance.length
                  ? options.maintenance.map((r, i) => (
                      <div key={i} className="button-con">
                        <button
                          disabled={isDisabled("maintenance", r)}
                          className={`check-btn ${selected.maintenance === r ? "active" : ""}`}
                          onClick={() => handleSelect("maintenance", r)}
                          type="button"
                        />
                        <p>{r}</p>
                      </div>
                    ))
                  : <p className="note-empty">ไม่มีตัวเลือกในหมวดนี้</p>
                }
              </div>

            </div>
            <div className="button-space-prioritize">
              <Link to="/Prioritize">
                <button className="back-btn-prioritize">ย้อนกลับ</button>
              </Link>
              <button
                className="next-btn-prioritize"
                onClick={handleNext}
                disabled={Object.values(selected).some(v => !v)}
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
