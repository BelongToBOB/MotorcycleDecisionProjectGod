import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../style/BikeTypeAdd.css";

export default function BikeTypeAdd() {
  const [moto_type_name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const img = e.target.files[0];
    if (!img) return;
    const formData = new FormData();
    formData.append("image", img);
    try {
      const res = await axios.post("http://localhost:5000/api/upload/image", formData);
      setPicture(res.data.url);
      toast.success("อัปโหลดรูปสำเร็จ");
    } catch {
      toast.error("อัปโหลดรูปไม่สำเร็จ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moto_type_name.trim()) return toast.error("กรุณาระบุชื่อประเภท");
    try {
      await axios.post(
        "http://localhost:5000/api/mototype",
        { moto_type_name, picture },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("เพิ่มข้อมูลสำเร็จ");
      navigate("/BikeTypeEdit");
    } catch {
      toast.error("เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="section-admin-page-edit">
        <div className="admin-edit-box-edit">
          <div className="admin-tag-edit">
            <h2>เพิ่มข้อมูลประเภท</h2>
          </div>
          <form className="form-add" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ชื่อประเภท</label>
              <input
                type="text"
                value={moto_type_name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>อัปโหลดรูปภาพ</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {picture && (
                <div className="preview-box">
                  <img src={picture} alt="preview" />
                </div>
              )}
            </div>

            <div className="btn-area">
              <button
                className="cancel-btn"
                type="button"
                onClick={() => navigate("/BikeTypeEdit")}
              >
                ยกเลิก
              </button>
              <button className="confirm-btn" type="submit">
                ยืนยัน
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
