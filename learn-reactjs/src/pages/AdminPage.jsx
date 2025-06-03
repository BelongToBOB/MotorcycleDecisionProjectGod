import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminInfoBox from "../components/AdminInfoBox";
import "../style/AdminPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  // ดึงข้อมูลแอดมินทั้งหมดเมื่อเข้าเพจ
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setAdmins(res.data))
      .catch(() => setAdmins([]));
  }, []);

  // ฟิลเตอร์ค้นหาชื่อ
  const filtered = admins.filter((admin) =>
    admin.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="section-admin-page">
        <div className="admin-edit-box">
          <div className="admin-tag">
            <h2>ข้อมูลผู้ดูแลระบบ</h2>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="ชื่อแอดมิน"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filtered.map((admin) => (
            <AdminInfoBox key={admin.id} admin={admin} />
          ))}
        </div>
      </section>
    </>
  );
}

