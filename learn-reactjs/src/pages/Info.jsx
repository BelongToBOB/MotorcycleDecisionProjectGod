import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Info.css';

// รูปโลโก้แบรนด์
import Honda from '../images/brandLogo/Honda_Logo.svg-removebg-preview.png'
import Yamaha from '../images/brandLogo/yamah-logo-removebg-preview.png'
import Kawasaki from '../images/brandLogo/kawasaki-logo-removebg-preview.png'
import Suzuki from '../images/brandLogo/suzuki-logo-removebg-preview.png'
import Gpx from '../images/brandLogo/gpxLogo-removebg-preview.png'
import Re from '../images/brandLogo/royal-enfieldLogo-removebg-preview.png'
import Bmw from '../images/brandLogo/bmwlogo-removebg-preview.png'
import Ducati from '../images/brandLogo/DucatiLogo-removebg-preview.png'
import Hld from '../images/brandLogo/Harley_davidson_logo-removebg-preview.png'
import Triumph from '../images/brandLogo/triumphLogo-removebg-preview.png'
import Vespa from '../images/brandLogo/vespaLogo-removebg-preview.png'
import Lambretta from '../images/brandLogo/lambrettaLogo-removebg-preview.png'
import Benelli from '../images/brandLogo/BenelliLogo-removebg-preview.png'
import KTM from '../images/brandLogo/KTMLogo-removebg-preview.png'
import Aprilia from '../images/brandLogo/aprilia-logo-removebg-preview.png'
import Idm from '../images/brandLogo/indian-motorcycle-logo-removebg-preview.png'
import Scomadi from '../images/brandLogo/scomadi-logo-png-removebg-preview.png'
import Italjet from '../images/brandLogo/italjetLogo-removebg-preview.png'
import Zontes from '../images/brandLogo/ZONTES-logo-removebg-preview.png'

const brandOptions = [
  { key: "Honda", img: Honda, alt: "Honda" },
  { key: "Yamaha", img: Yamaha, alt: "Yamaha" },
  { key: "Kawasaki", img: Kawasaki, alt: "Kawasaki" },
  { key: "Suzuki", img: Suzuki, alt: "Suzuki" },
  { key: "Gpx", img: Gpx, alt: "Gpx" },
  { key: "Royal Enfield", img: Re, alt: "Re" },
  { key: "Bmw", img: Bmw, alt: "Bmw" },
  { key: "Ducati", img: Ducati, alt: "Ducati" },
  { key: "Haley Davidson", img: Hld, alt: "Hld" },
  { key: "Triumph", img: Triumph, alt: "Triumph" },
  { key: "Vespa", img: Vespa, alt: "Vespa" },
  { key: "Lambretta", img: Lambretta, alt: "Lambretta" },
  { key: "Benelli", img: Benelli, alt: "Benelli" },
  { key: "Ktm", img: KTM, alt: "KTM" },
  { key: "Aprilia", img: Aprilia, alt: "Aprilia" },
  { key: "Indian Motorcycle", img: Idm, alt: "Idm" },
  { key: "Scomadi", img: Scomadi, alt: "Scomadi" },
  { key: "Italjet", img: Italjet, alt: "Italjet" },
  { key: "Zontes", img: Zontes, alt: "Zontes" },
];

export default function Info() {
  const [typeOptions, setTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/Login');
          return;
        }
        const res = await axios.get("http://localhost:5000/api/mototype", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res.data)) setTypeOptions(res.data);
        else setTypeOptions([]);
      } catch (err) {
        setTypeOptions([]);
        if (err.response && err.response.status === 401) {
          navigate('/Login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [navigate]);

  const handleTypeSelect = (typeId) => {
    navigate(`/BikeAll?type=${typeId}`);
  };

  const handleBrandSelect = (brandKey) => {
    navigate(`/BikeAll?brand=${brandKey}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/BikeAll?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <Navbar/>
      <section className="section-search-bike">
        <div className="findBike">
          <div className="findbike-box">
            <h1>ค้นหารถจักรยานยนต์ของคุณ</h1>
            <form className="searchbrand" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="motorcycle name"
                className="bikebrand"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="search-btn">ค้นหา</button>
            </form>
            <h6>กรอกชื่อรุ่นหรือยี่ห้อรถจักรยานยนต์ที่คุณต้องการค้นหา ระบบจะแสดงรายละเอียดรถให้คุณเลือกได้อย่างสะดวกและรวดเร็ว</h6>
          </div>
        </div>
      </section>

      <section className="section-type-bike">
        <div className="typebike">
          <div className="type-container">
            <h1>ประเภทรถจักรยานยนต์</h1>
            <div className="typebike-box">
              {loading ? (
                <div>กำลังโหลด...</div>
              ) : Array.isArray(typeOptions) && typeOptions.length > 0 ? (
                typeOptions.map((type) => (
                  <div
                    key={type.id}
                    className="type-choice"
                    style={{ cursor: 'pointer', textAlign: 'center', margin: "0 15px" }}
                    onClick={() => handleTypeSelect(type.id)}
                    tabIndex={0}
                    title={type.moto_type_name}
                  >
                    <img className='typebike-box'
                      src={type.picture || "/default-type.png"}
                      alt={type.moto_type_name}
                    />
                    <p>{type.moto_type_name}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: "red" }}>ไม่พบข้อมูลประเภท</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-type-bike">
        <div className="typebike">
          <div className="type-container">
            <h1>ยี่ห้อรถจักรยานยนต์</h1>
            <div className="typebike-box-brand">
              {brandOptions.map((item) => (
                <div
                  key={item.key}
                  className="brand-choice"
                  style={{ cursor: "pointer", margin: "0 15px", display: "inline-block" }}
                  onClick={() => handleBrandSelect(item.key)}
                  tabIndex={0}
                  title={item.alt}
                >
                  <img src={item.img} alt={item.alt} style={{ width: 100, height: 60, objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}

