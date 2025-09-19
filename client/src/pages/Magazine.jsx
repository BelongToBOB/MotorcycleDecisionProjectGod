import React, { useState } from "react";
import "../style/Magazine.css";
import Navbar from "../components/Navbar";
import Scoopy from "../images/HondaBike/scoopyi.png";
import Aerox from "../images/YamahaBike/Aerox155.png";
import Adv160 from "../images/HondaBike/adv160.png";
import Tenere from "../images/YamahaBike/Tenere700.png";
import Nx500 from "../images/HondaBike/nx500.png";
import R1300 from "../images/BMWBike/r1300gs.png";
import Cbr600rr from "../images/HondaBike/cbr600rr.png";
import Zx25r from "../images/KawasakiBike/ninjazx25.jpg";
import R1M from "../images/YamahaBike/R1M.png";
import Wave125i from "../images/HondaBike/wave125i.png";
import finn from "../images/YamahaBike/Finn.png";
import smash from "../images/SuzukiBike/Smash-Fi.png"
import mt09 from "../images/YamahaBike/Mt09.png"
import z900 from "../images/KawasakiBike/z900.jpg"
import hornet750 from "../images/HondaBike/cb750hornet.png"

export default function Magazine() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState("scooter");

  const bikes = [
    {
      id: 1,
      type: "scooter",
      title: "Honda Scoopy i",
      desc: "เล็ก คล่องตัว ขี่ง่าย ประหยัดน้ำมัน เหมาะชีวิตเมือง",
      image: Scoopy,
    },
    {
      id: 2,
      type: "scooter",
      title: "Yamaha Aerox 155",
      desc: "สปอร์ตไบค์สกู๊ตเตอร์ ดีไซน์ลู่ลม เร่งแซงมั่นใจ",
      image: Aerox,
    },
    {
      id: 3,
      type: "scooter",
      title: "Honda ADV160",
      desc: "ลุยได้ทุกที่ คล่องตัวในเมือง พร้อมลุยทางไกล",
      image: Adv160,
    },
    {
      id: 4,
      type: "adventure",
      title: "Yamaha Tenere 700",
      desc: "ลุยได้ทั้งทางดำและดิน พร้อมออกทริปไกล",
      image: Tenere,
    },
    {
      id: 5,
      type: "adventure",
      title: "Honda NX500",
      desc: "ลุยได้ทั้งทางดำและดิน พร้อมออกทริปไกล",
      image: Nx500,
    },
    {
      id: 6,
      type: "adventure",
      title: "BMW R1300GS",
      desc: "บิ๊กไบค์สายลุยตัวจริง เครื่องแรง ช่วงล่างดี ยานแม่วงการ",
      image: R1300,
    },
    {
      id: 7,
      type: "sport",
      title: "Honda CBR600RR",
      desc: "สปอร์ตไบค์คลาสกลาง สายสนามในตำนาน",
      image: Cbr600rr,
    },
    {
      id: 8,
      type: "sport",
      title: "Kawasaki ZX-25R",
      desc: "สปอร์ตไบค์ 4 สูบเรียงคลาส 250cc น้องเล็กที่แรงที่สุดในคลาส",
      image: Zx25r,
    },
    {
      id: 9,
      type: "sport",
      title: "Yamaha YZF-R1M",
      desc: "สปอร์ตไบค์ตัวท็อปของยามาฮ่า เทคโนโลยีจากสนามแข่งสู่ถนนจริง",
      image: R1M,
    },
    {
      id: 10,
      type: "family",
      title: "Honda Wave 125i",
      desc: "รถครอบครัวยอดนิยม ขี่ง่าย ประหยัด ซ่อมถูก",
      image: Wave125i,
    },
    {
      id: 11,
      type: "family",
      title: "Yamaha Finn",
      desc: "รถครอบครัวยอดนิยม ขี่ง่าย ประหยัด ซ่อมถูก ค่ายส้อมเสียง",
      image: finn,
    },
    {
      id: 12,
      type: "family",
      title: "Suzuki Smash Fi",
      desc: "รถครอบครัวยอดนิยม ขี่ง่าย ประหยัด ซ่อมถูก ค่ายคนบ้า",
      image: smash,
    },
    {
      id: 13,
      type: "naked",
      title: "Kawasaki Z900",
      desc: "สปอร์ตเนกเกต 4 สูบเรียง 900cc สายดุดัน สมรรถนะสูง",
      image: z900,
    },
    {
      id: 14,
      type: "naked",
      title: "Yamaha MT-09",
      desc: "สปอร์ตเนกเกตยอดนิยม เท่ ออฟชั่นแน่น ล้ำกว่าใคร",
      image: mt09,
    },
    {
      id: 15,
      type: "naked",
      title: "Honda Hornet 750",
      desc: "สปอร์ตเนกเกตทรงผู้ดี สองสูบเรียง 750cc ดึงดี มีเอกลักษณ์",
      image: hornet750,
    },
  ];

  const filtered =
    filter === "all" ? bikes : bikes.filter((b) => b.type === filter);

  const dataTabs = {
    Family: {
      label: "ครอบครัว",
      cost: { fuel: 10, maintain: 10 },
      usage: { city: 10, tour: 5, speed: 3 },
      summary: "อเนกประสงค์ ใช้งานได้หลากหลาย เหมาะกับทุกคนในครอบครัว",
    },
    scooter: {
      label: "สกู๊ตเตอร์",
      cost: { fuel: 6, maintain: 5 },
      usage: { city: 10, tour: 9, speed: 7 },
      summary: "ขี่ง่าย คุ้มค่าและคล่องตัว เหมาะชีวิตเร่งรีบในเมือง",
    },
    adventure: {
      label: "แอดเวนเจอร์",
      cost: { fuel: 5, maintain: 5 },
      usage: { city: 6, tour: 10, speed: 9 },
      summary: "ลุยได้ทุกสภาพถนน นั่งสบาย เหมาะทริปไกล",
    },
    sport: {
      label: "สปอร์ต",
      cost: { fuel: 3, maintain: 3 },
      usage: { city: 8, tour: 8, speed: 10 },
      summary: "เร้าใจ ลื่นไหล ควบคุมเฉียบคม สำหรับคนรักความเร็ว",
    },
    Naked: {
      label: "สปอร์ตเนกเกต",
      cost: { fuel: 5, maintain: 5 },
      usage: { city: 10, tour: 5, speed: 9 },
      summary: "เร่งแซงมั่นใจ ดีไซน์เท่ เหมาะขี่ในเมือง ปล่อยสัตว์ร้ายในตัวคุณ",
    },
  };

  const d = dataTabs[active];

  const maxCost = Math.max(
    ...Object.values(dataTabs).map((tab) =>
      Math.max(tab.cost.fuel, tab.cost.maintain)
    )
  );

  return (
    <>
      <Navbar />
      {/* ARTICLES */}
      <section id="articles" className="mag-articles">
        <div className="mag-container">
          <h2 className="mag-h2">บทความย่อย</h2>

          <div className="mag-articles__grid">
            {/* Scooter */}
            <article className="mag-article scooter">
              <div className="mag-article__header">
                <div className="mag-article__icon">🛵</div>
                <h3 className="mag-article__title" style={{ color: "#fff" }}>
                  รถสกู๊ตเตอร์เหมาะกับนักศึกษาและคนเมือง
                </h3>
              </div>
              <p className="mag-article__text" style={{ color: "#fff" }}>
                คล่องตัว ประหยัด และเก็บของใต้เบาะได้
                เหมาะกับการจอด-ออกตัวบ่อยในเมือง รถติดก็ยังสบายด้วยระบบออโต้
              </p>
            </article>

            {/* Adventure */}
            <article className="mag-article adventure">
              <div className="mag-article__header">
                <div className="mag-article__icon">🏕️</div>
                <h3 className="mag-article__title" style={{ color: "#fff" }}>
                  บิ๊กไบค์สำหรับสายผจญภัย
                </h3>
              </div>
              <p className="mag-article__text" style={{ color: "#fff" }}>
                เครื่องแรง ช่วงล่างสูง ลุยได้ทั้งถนนดำและเส้นทางลูกรัง
                เหมาะกับการเดินทางไกลและสำรวจสถานที่ใหม่ ๆ
              </p>
            </article>

            {/* Sport */}
            <article className="mag-article sport">
              <div className="mag-article__header">
                <div className="mag-article__icon">🏁</div>
                <h3 className="mag-article__title" style={{ color: "#fff" }}>
                  สปอร์ตไบค์สำหรับคนรักความเร็ว
                </h3>
              </div>
              <p className="mag-article__text" style={{ color: "#fff" }}>
                ดีไซน์ลู่ลม เร่งแซงมั่นใจ เกียร์สนุก ได้ฟีลซิ่งบนถนนเรียบ
                เหมาะกับคนชอบความแม่นยำและการควบคุม
              </p>
            </article>

            {/* Family */}
            <article className="mag-article family">
              <div className="mag-article__header">
                <div className="mag-article__icon">👨‍👩‍👧‍👦</div>
                <h3 className="mag-article__title" style={{ color: "#fff" }}>
                  มอไซค์ครอบครัวสำหรับทุกวัน
                </h3>
              </div>
              <p className="mag-article__text" style={{ color: "#fff" }}>
                ประหยัดน้ำมัน ขับขี่ง่าย ซ่อมบำรุงไม่แพง
                เหมาะกับการใช้งานในครอบครัวและการเดินทางประจำวัน
              </p>
            </article>

            {/* Sport Naked */}
            <article className="mag-article naked">
              <div className="mag-article__header">
                <div className="mag-article__icon">💢</div>
                <h3 className="mag-article__title" style={{ color: "#fff" }}>
                  สปอร์ตเนกเกตสายดุดัน
                </h3>
              </div>
              <p className="mag-article__text" style={{ color: "#fff" }}>
                ทรงเปลือย เท่ ขี่สนุกในเมือง คล่องตัวไม่ต่างจากสปอร์ต
                แต่ได้ความสบายในการขับขี่มากกว่า
              </p>
            </article>
          </div>
        </div>
      </section>
      {/* GALLERY */}
      <section id="gallery" className="mag-gallery">
        <div className="mag-container">
          <div className="mag-gallery__header">
            <div>
              <h2 className="mag-h2" style={{ color: "#000000ff" }}>
                แกลเลอรี่
              </h2>
              <p className="mag-sub">รถหลายประเภทพร้อมคำอธิบายสั้น ๆ</p>
            </div>
            <div className="mag-gallery__filters">
                <button
                className={`mag-btn small ${
                  filter === "family" ? "active" : ""
                }`}
                onClick={() => setFilter("family")}
              >
                ครอบครัว
              </button>
              <button
                className={`mag-btn small ${
                  filter === "scooter" ? "active" : ""
                }`}
                onClick={() => setFilter("scooter")}
              >
                สกู๊ตเตอร์
              </button>
              <button
                className={`mag-btn small ${
                  filter === "adventure" ? "active" : ""
                }`}
                onClick={() => setFilter("adventure")}
              >
                ท่องเที่ยว
              </button>
              <button
                className={`mag-btn small ${
                  filter === "sport" ? "active" : ""
                }`}
                onClick={() => setFilter("sport")}
              >
                สปอร์ต
              </button>
              <button
                className={`mag-btn small ${
                  filter === "naked" ? "active" : ""
                }`}
                onClick={() => setFilter("naked")}
              >
                สปอร์ตเนกเกต
              </button>
            </div>
          </div>

          <div className="mag-gallery__grid">
            {filtered.map((bike) => (
              <div key={bike.id} className={`mag-card ${bike.type}`}>
                <div className="mag-card__image">
                  <img src={bike.image} alt={bike.title} />
                </div>
                <div className="mag-card__content">
                  <h3>{bike.title}</h3>
                  <p>{bike.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* INFOGRAPHIC */}
      <section id="infographic" className="mag-infographic">
        <div className="mag-container">
          <h2 className="mag-h2">อินโฟกราฟิก</h2>
          <p className="mag-sub">เปรียบเทียบค่าใช้จ่ายและการใช้งานตามประเภท</p>

          {/* ✅ ปุ่มเลือก */}
          <div className="mag-infographic__tabs">
            {Object.keys(dataTabs).map((key) => (
              <button
                key={key}
                className={`mag-btn small ${active === key ? "active" : ""}`}
                onClick={() => setActive(key)}
              >
                {dataTabs[key].label}
              </button>
            ))}
          </div>

          <div className="mag-infographic__grid">
            <div className="mag-box">
              {/* น้ำมัน */}
              <div className="bar">
                <div className="bar-label">
                  <span>ประหยัดน้ำมัน</span>
                  <span>{d.cost.fuel} / 10</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill fuel"
                    style={{ width: `${d.cost.fuel * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* บำรุงรักษา */}
              <div className="bar">
                <div className="bar-label">
                  <span>บำรุงรักษา(ราคาถูก)</span>
                  <span>{d.cost.maintain} / 10</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill maintain"
                    style={{ width: `${d.cost.maintain * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* ในเมือง */}
              <div className="bar">
                <div className="bar-label">
                  <span>ในเมือง</span>
                  <span>{d.usage.city} / 10</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill city"
                    style={{ width: `${d.usage.city * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* ทัวร์ไกล */}
              <div className="bar">
                <div className="bar-label">
                  <span>ทัวร์ไกล</span>
                  <span>{d.usage.tour} / 10</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill tour"
                    style={{ width: `${d.usage.tour * 10}%` }}
                  ></div>
                </div>
              </div>

              {/* ความเร็ว */}
              <div className="bar">
                <div className="bar-label">
                  <span>ความเร็ว</span>
                  <span>{d.usage.speed} / 10</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill speed"
                    style={{ width: `${d.usage.speed * 10}%` }}
                  ></div>
                </div>
              </div>

              <p className="usage-summary">{d.summary}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
