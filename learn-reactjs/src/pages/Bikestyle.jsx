import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '../style/BikeStyle.css'
import { useNavigate } from 'react-router-dom'
import { useRecommend } from '../context/RecommendContext'
import axios from 'axios'

export default function BikeStyle() {
  const { setSelectedType, selectedType } = useRecommend();
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
      if (!token) {
        navigate('/Login');
        return;
      }
    axios.get("http://localhost:5000/api/mototype", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setTypes(res.data))
    .catch(() => setTypes([]));
  }, []);

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    navigate("/Prioritize");
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
              {types.map(type => (
                <div
                  className="type-choice"
                  key={type.id}
                  style={{
                    border: selectedType === type.id ? "2px solid red" : "1px solid #ddd",  
                  }}
                  onClick={() => handleSelectType(type.id)}
                  tabIndex={0}
                  title={type.moto_type_name}
                >
                  <img
                    src={type.picture || "/default-bike-type.png"}
                    alt={type.moto_type_name}
                  />
                  <p style={{ fontWeight: 500 }}>{type.moto_type_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
