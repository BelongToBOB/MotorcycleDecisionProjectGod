import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/AdminInfoBox.css";
import API_BASE_URL from "../config";

export default function AdminInfoBox({ admin, onDelete }) {
  const [showDetail, setShowDetail] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "ลบแอดมิน?",
      text: `คุณต้องการลบแอดมิน ${admin.username} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/${admin.user_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("ลบสำเร็จ!", "ข้อมูลแอดมินถูกลบแล้ว", "success");
        if (onDelete) onDelete(admin.user_id);
      } catch {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบแอดมินได้", "error");
      }
    }
  };

  return (
    <>
      {/* ✅ แถวของตาราง */}
      <tr>
        <td>
          <img
            src={admin.picture || "/default-profile.png"}
            alt="admin"
            className="admin-avatar"
          />
        </td>
        <td>{admin.username}</td>
        <td>{admin.email}</td>
        
        <td>
          <button className="detail-btn" onClick={() => setShowDetail(true)}>
            รายละเอียด
          </button>
          <Link to={`/AdminEdit/${admin.user_id}`}>
            <button className="edit-btn">แก้ไข</button>
          </Link>
        </td>
      </tr>

      {/* ✅ Modal รายละเอียด */}
      {showDetail && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setShowDetail(false)}
            >
              ✕
            </button>
            <h2>รายละเอียดแอดมิน</h2>
            <img
              src={admin.picture || "/default-profile.png"}
              alt="admin"
              className="admin-avatar-large"
            />
            <p><b>Username:</b> {admin.username}</p>
            <p><b>Email:</b> {admin.email}</p>
            <p><b>ID:</b> {admin.user_id}</p>
          </div>
        </div>
      )}
    </>
  );
}
