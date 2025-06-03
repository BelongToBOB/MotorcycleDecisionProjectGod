import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/AdminInfoBox.css";

export default function AdminInfoBox({ admin, onDelete }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "ลบแอดมิน?",
      text: `คุณต้องการลบแอดมิน ${admin.username} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/${admin.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        Swal.fire("ลบสำเร็จ!", "ข้อมูลแอดมินถูกลบแล้ว", "success");
        if (onDelete) onDelete(admin.id); // แจ้ง parent ให้ลบออกจาก list
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบแอดมินได้", "error");
      }
    }
  };

  return (
    <div className="info-admin-box">
      <div className="info-part">
        <div className="info-admin-img">
          <img src={admin.picture || "/default-profile.png"} alt="admin" />
        </div>
        <div className="info-admin">
          <p>Username: {admin.username}</p>
          <p>Email: {admin.email}</p>
          <p>Password: *********</p>
        </div>
      </div>
      <div className="edit-part">
        <Link to={`/AdminEdit/${admin.id}`}>
          <button className="edit-btn">แก้ไข</button>
        </Link>
        <button className="delete-btn" onClick={handleDelete}>
          ลบ
        </button>
        <span>admin_id: {admin.id}</span>
      </div>
    </div>
  );
}

