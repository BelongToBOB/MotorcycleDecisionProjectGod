import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Result.css';
import Star from '../images/star.png';
import { useRecommend } from '../context/RecommendContext';

export default function Result() {
  const { selectedType, priority, criteria } = useRecommend();
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ป้องกันกรณี reload result ตรง
    if (!selectedType || !priority?.length || !criteria) {
      navigate('/Bikestyle');
      return;
    }

    const userData = { selectedType, priority, criteria };
    console.log('ส่งข้อมูลไป backend:', userData);

    fetch('http://localhost:5000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => setResults([]));
  }, [selectedType, priority, criteria, navigate]);


  useEffect(() => {
    if (!results || !results.length) return;

    const historyKey = `recommendHistorySaved_${selectedType}_${JSON.stringify(priority)}_${JSON.stringify(criteria)}`;
    if (sessionStorage.getItem(historyKey)) return;
    sessionStorage.setItem(historyKey, "1");
  
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const historyData = {
      selectedType,
      priority,
      criteria,
      result: results.map(r => ({
        id: r.id,
        moto_name: r.moto_name,
        moto_brand: r.moto_brand,
        score: r.score
      }))
    };

  
    fetch('http://localhost:5000/api/recommend-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(historyData)
    }).then(res => {
      if (!res.ok) return res.json().then(e => { throw e });
      return res.json();
    }).catch(e => {
      console.warn("Cannot save recommend history:", e.message);
    });
  }, [results, selectedType, priority, criteria]);  

  if (!results) {
    return <div>Loading...</div>
  }

  if (!results.length) {
    return (
      <div>
        <Navbar/>
        <h2 style={{ textAlign: "center", marginTop: "2rem" }}>ไม่พบข้อมูลที่เหมาะสม</h2>
      </div>
    );
  }

  const best = results[0];
  const others = results.slice(1, 5);

  return (
    <>
      <Navbar/>
      <section className='section-result'>
        <div className='main-box'>
          <div className='first-side-box'>
            <div className='bestBike-text'>
              <h1 className='bestBike-text1'>รถจักรยานยนต์</h1>
              <h1 className='bestBike-text2'>ที่เหมาะกับคุณมากที่สุด</h1>
              <img src={best.picture || "/default-bike.png"} className="result-image" alt={best.moto_name} />
            </div>
            <div className='bestRank'>
              <h1 className='bestRank1'>อันดับที่ 1</h1>
              <h1 className='bestRank2'>{best.moto_name}</h1>
              <div className='info-result-box'>
                <h1 className='info-result-box1'>ยี่ห้อ : {best.moto_brand}</h1>
                <h1 className='info-result-box2'>ประเภท : {best.moto_type?.moto_type_name || "-"}</h1>
                <h1 className='info-result-box3'>รายละเอียด</h1>
                <p>{best.moto_content}</p>
                <h1 className='info-result-box4'>ราคา {best.moto_price?.toLocaleString()} บาท</h1>
                <div className='space-btn'>
                  <button className="moreInfo-btn">เพิ่มเติม</button>
                  <button className="moreInfo-btn2">5<img className="Star-img" src={Star} alt="" /></button>
                </div>
              </div>
            </div>
          </div>
          <div className='near-choice-text'>
            <h1>ตัวเลือกที่ใกล้เคียง</h1>
          </div>
          {others.map((item, idx) => (
            <div className='near-choice-box' key={item.id}>
              <h1>{idx + 2}</h1>
              <div className='box-image'>
                <img src={item.picture || "/default-bike.png"} alt={item.moto_name} />
              </div>
              <div className='near-choice-box-info'>
                <h3>ยี่ห้อ : {item.moto_brand}</h3>
                <h3>รุ่น : {item.moto_name}</h3>
                <h3>ประเภท : {item.moto_type?.moto_type_name || "-"}</h3>
                <h3>ราคา : {item.moto_price?.toLocaleString()} บาท</h3>
              </div>
              <button className="moreInfo-btn-near-choice">เพิ่มเติม</button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
