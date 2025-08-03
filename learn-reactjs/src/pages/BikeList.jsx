import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import BikeListBox from "../components/BikeListBox";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import '../style/BikeList.css';

export default function BikeList() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/motorcycle", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBikes(res.data))
      .catch(() => toast.error("โหลดข้อมูลรถไม่สำเร็จ"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mototype", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setTypes(res.data))
      .catch(() => setTypes([]));
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันลบรถจักรยานยนต์นี้?",
      text: "หากลบแล้วจะไม่สามารถย้อนคืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/motorcycle/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBikes(bikes.filter((bike) => bike.motorcycle_id !== id));
        Swal.fire("ลบข้อมูลสำเร็จ", "", "success");
      } catch (err) {
        const msg = err?.response?.data?.message || "เกิดข้อผิดพลาดที่ server";
        Swal.fire("ลบไม่สำเร็จ", msg, "error");
      }
    }
  };

  const filteredBikes = bikes
    .filter((bike) => !selectedType || bike.moto_type_id === Number(selectedType))
    .filter((bike) =>
      bike.moto_name.toLowerCase().includes(search.toLowerCase()) ||
      bike.moto_brand.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="section-admin-page">
        <div className="admin-edit-box">
          <div className="admin-tag">
            <h2>ข้อมูลรายการรถจักรยานยนต์</h2>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ/ยี่ห้อ"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <br />
          <select
            className="select-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">ทุกประเภท</option>
            {types.map((type) => (
              <option value={type.moto_type_id} key={type.moto_type_id}>
                {type.moto_type_name}
              </option>
            ))}
          </select>

          <div className="BikeTypeBox-main">
            <div className="add-btn">
              <Link to={"/BikeListAdd"}>
                <button>เพิ่ม +</button>
              </Link>
            </div>
            {filteredBikes.length === 0 ? (
              <div style={{ marginTop: 24, textAlign: "center", color: "#888" }}>
                ไม่พบข้อมูล
              </div>
            ) : (
              filteredBikes.map((bike) => (
                <BikeListBox key={bike.motorcycle_id} bike={bike} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
