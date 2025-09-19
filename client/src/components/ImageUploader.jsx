import React, { useState, useRef } from "react";
import axios from "axios";
import "../style/ImageUploader.css";

export default function ImageUploader({ value, onUpload }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(value || null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : value || null);
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.url) {
        onUpload(res.data.url);
        setPreview(res.data.url);
        setImage(null);
      } else {
        alert("ไม่ได้รับ url กลับจาก server");
      }
    } catch (err) {
      alert(
        "อัปโหลดรูปไม่สำเร็จ: " + (err?.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {/* ปุ่มเลือกไฟล์ (ใช้ label คลุม input) */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileRef}
        id="upload-image"
        style={{ display: "none" }}
      />
      <label htmlFor="upload-image">
        <button
          type="button"
          className="select-img-btn"
          onClick={() => fileRef.current.click()}
        >
          เลือกรูปภาพ
        </button>
      </label>
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: 90,
            height: 90,
            objectFit: "cover",
            margin: 8,
            borderRadius: 8,
          }}
        />
      )}
      <button onClick={handleUpload} disabled={!image || loading} className="upload-btn">
        {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
      </button>
    </div>
  );
}

