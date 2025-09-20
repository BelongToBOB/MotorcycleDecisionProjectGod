import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminInfoBox from "../components/AdminInfoBox";
import "../style/AdminPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import API_BASE_URL from "../config";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setAdmins(res.data))
      .catch(() => setAdmins([]));
  }, []);

  // filter ค้นหา
  const filtered = admins.filter((admin) =>
    admin.username?.toLowerCase().includes(search.toLowerCase())
  );

  // callback หลังลบ
  const handleDelete = (id) => {
    setAdmins((prev) => prev.filter((a) => a.user_id !== id));
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="section-admin-page">
        <div className="admin-edit-box">
          <div className="admin-tag">
            <h2>ข้อมูลผู้ดูแลระบบ</h2>
          </div>



          {/* ✅ ตารางใหม่ */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>รูป</th>
                <th>Username</th>
                <th>Email</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((admin) => (
                <AdminInfoBox
                  key={admin.user_id}
                  admin={admin}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
