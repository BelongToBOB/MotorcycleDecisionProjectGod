import React from 'react'
import '../style/Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

import ducatiImage from '../images/ducatiindex.jpg';
import waveImage from '../images/hondawave125i.png';
import zontesImage from '../images/zontes368gflip.png';

export default function Home() {
  return (
    <>
        <Navbar/>
            <div className="main-container">
                  <section>
                    <div className="wrapper">
                      <div className="text-wrap-con">
                        <a href="/">BIKE</a>
                        <a href="/" className="a2">MATCH</a>
                        <h2>ช่วยคุณเลือกรถที่ใช่</h2>
                      </div>
            
                      <section className="hero">
                        <div className="hero-content">
                          <h3>BIKEMATCH</h3>
                          <h2>
                            “ระบบสนับสนุนการตัดสินใจเลือกซื้อรถจักรยานยนต์อย่างชาญฉลาด”
                          </h2>
                          <p>เลือกซื้อรุ่นไหนดี ?</p>
                          <p>งบประมาณจำกัด ?</p>
                          <p>กลัวไม่ตรงตามความต้องการใช้งาน ?</p>
                          <Link to={'/Bikestyle'} className="cta-button">
                              เลือกรถที่เหมาะกับคุณเลย คลิ๊ก!!
                          </Link>
                        </div>
                        <div className="hero-image">
                          <img src={ducatiImage} alt="motorbike" />
                        </div>
                      </section>
            
                      <div className="mini-text">
                        <p>
                          หากมีข้อสงสัยสามารถติดต่อแอดมินได้ <a href="/">ที่นี่</a>
                        </p>
                      </div>
            
                      <section className="hot-section">
                        <div className="section-title">มาแรงในช่วงนี้</div>
            
                        <div className="bike-card">
                          <img
                            src={waveImage} alt="Honda Wave"
                            className="bike-img"
                          />
                          <div className="bike-info">
                            <h3>Honda wave 125i</h3>
                            <p>ประเภท : เกียร์ธรรมดา</p>
                            <p>รุ่นฮิตติดตลาดตลอดกาล ซื้อง่ายขายคล่อง</p>
                            <p>เริ่มต้น 56,000 บาท!!</p>
                          </div>
                        </div>
            
                        <div className="bike-card reverse">
                          <div className="bike-info">
                            <h3>Zontes 368G</h3>
                            <p>ประเภท : สกู๊ตเตอร์</p>
                            <p>น้องใหม่ไฟแรงแดนมังกร</p>
                            <p>เริ่มต้น 182,800 บาท!!</p>
                          </div>
                          <img
                            src={zontesImage} alt="Zontes"
                            className="bike-img-zt"
                          />
                        </div>
                      </section>
            
                      <div className="news">
                        <div className="section-title">ข่าวสาร</div>
                        <div className="firstgridbox">
                          <div className="firstbox">
                            <img
                              src="https://autostation.com/wp-content/uploads/2024/06/KV-Zontes-350E-2-2048x1365-1.jpg"
                              alt=""
                            />
                          </div>
                          <div className="firstbox">
                            <img
                              src="https://www.checkraka.com/uploaded/gallery/11/116a9e8b154908bc497c4c82fa6134a5.jpg"
                              alt=""
                            />
                          </div>
                          <div className="firstbox">
                            <img
                              src="https://i.ytimg.com/vi/bnSQfyK1DI0/maxresdefault.jpg"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
        <Footer/>
    </>
  )
}