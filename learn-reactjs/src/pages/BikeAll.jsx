import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BikeCard from "../components/BikeCard";
import BikeDetailCard from "../components/BikeDetailCard";
import "../style/BikeAll.css";

export default function BikeAll() {
  const [bikes, setBikes] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/motorcycle")
      .then((res) => setBikes(res.data))
      .catch(() => setBikes([]));
    axios
      .get("http://localhost:5000/api/mototype")
      .then((res) => setTypes(res.data))
      .catch(() => setTypes([]));
  }, []);

  const query = new URLSearchParams(location.search);
  const type = query.get("type");   // id (number)
  const brand = query.get("brand"); // string
  const search = query.get("search"); // string

  let filteredBikes = bikes;

  if (type) {
    filteredBikes = filteredBikes.filter(b => String(b.moto_type_id) === String(type));
  }
  if (brand) {
    filteredBikes = filteredBikes.filter(b =>
      b.moto_brand?.toLowerCase() === brand.toLowerCase()
    );
  }
  if (search) {
    const s = search.toLowerCase();
    filteredBikes = filteredBikes.filter(b =>
      (b.moto_name && b.moto_name.toLowerCase().includes(s)) ||
      (b.moto_brand && b.moto_brand.toLowerCase().includes(s))
    );
  }

  const brands = [...new Set(filteredBikes.map(b => b.moto_brand))];

  return (
    <>
      <Navbar />
      <section className="BikeAll-section">
        <div className="BikeAll-con">
          {filteredBikes.length === 0 && (
            <div style={{ color: "red", padding: 32, fontSize: 20 }}>ไม่พบข้อมูลรถที่คุณค้นหา</div>
          )}
          {brands.map((brand) => (
            <div className="Bike-product" key={brand}>
              <div className="Brand-bike-name">
                <h2>{brand}</h2>
              </div>
              <div className="Bike-productName">
                {filteredBikes
                  .filter((b) => b.moto_brand === brand)
                  .map((bike) => (
                    <BikeCard key={bike.id} bike={bike} onDetail={() => setSelectedBike(bike)} />
                  ))}
              </div>
            </div>
          ))}
        </div>
        <BikeDetailCard
          bike={selectedBike}
          onClose={() => setSelectedBike(null)}
        />
      </section>
    </>
  );
}
