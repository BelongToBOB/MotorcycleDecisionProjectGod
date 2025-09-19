import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../style/BikeList.css";
import API_BASE_URL from "../config";

export default function BikeList() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/motorcycle`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBikes(res.data))
      .catch(() => toast.error("โหลดข้อมูลรถไม่สำเร็จ"));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/mototype`, {
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
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/motorcycle/${id}`, {
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
    .filter(
      (bike) =>
        !selectedType || bike.moto_type_id === Number(selectedType)
    )
    .filter(
      (bike) =>
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

          {/* Search + Filter */}
          <div className="search-bar">
            <div className="search-box">
              
              <input
                type="text"
                placeholder="ค้นหาชื่อ/ยี่ห้อ"
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
            <Link to={"/BikeListAdd"}>
              <button className="add-btn">+ เพิ่ม</button>
            </Link>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>รูป</th>
                  <th>ชื่อรถ</th>
                  <th>ยี่ห้อ</th>
                  <th>CC</th>
                  <th>น้ำหนัก</th>
                  <th>ค่าบำรุงรักษา</th>
                  <th>สิ้นเปลือง (กม./ลิตร)</th>
                  <th>ราคา</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredBikes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  filteredBikes.map((bike) => (
                    <tr key={bike.motorcycle_id}>
                      <td>
                        <img
                          src={bike.picture || "/default-bike.png"}
                          alt={bike.moto_name}
                          className="table-avatar"
                        />
                      </td>
                      <td>{bike.moto_name}</td>
                      <td>{bike.moto_brand}</td>
                      <td>{bike.moto_cc}</td>
                      <td>{bike.moto_weight}</td>
                      <td>{bike.maintenance_cost?.toLocaleString()}</td>
                      <td>{bike.consumption_rate}</td>
                      <td>{bike.moto_price?.toLocaleString()}</td>
                      <td>
                        <Link to={`/BikeListEdit/${bike.motorcycle_id}`}>
                          <button className="edit-btn">แก้ไข</button>
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(bike.motorcycle_id)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
