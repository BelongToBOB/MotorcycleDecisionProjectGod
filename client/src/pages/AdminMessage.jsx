import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/AdminMessage.css";
import Swal from "sweetalert2";

export default function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/message", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (message_id) => {
    const confirm = await Swal.fire({
      title: "ลบข้อความนี้?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/message/${message_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages((msgs) => msgs.filter((m) => m.message_id !== message_id));
        setSelectedMessage(null);
        Swal.fire("ลบแล้ว!", "ข้อความถูกลบเรียบร้อย", "success");
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อความได้", "error");
      }
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="admin-message-section">
        <h2>ข้อความติดต่อ (Contact Messages)</h2>
        <div className="message-layout">
          {/* 📩 Sidebar list */}
          <div className="message-list">
            {loading ? (
              <div>Loading...</div>
            ) : messages.length === 0 ? (
              <div>ไม่มีข้อความ</div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={m.message_id}
                  className={`message-item ${
                    selectedMessage?.message_id === m.message_id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSelectedMessage(m)}
                >
                  <p className="msg-name">{m.name}</p>
                  <p className="msg-preview">
                    {m.content.length > 25
                      ? m.content.slice(0, 25) + "..."
                      : m.content}
                  </p>
                  <span className="msg-date">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* 📖 Reading panel */}
          <div className="message-view">
            {selectedMessage ? (
              <>
                <h3>ข้อความจาก {selectedMessage.name}</h3>
                <p>
                  <b>อีเมล:</b> {selectedMessage.email}
                </p>
                <p>
                  <b>เบอร์:</b> {selectedMessage.tel}
                </p>
                <p>
                  <b>วันที่ส่ง:</b>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
                <div className="msg-full-content">
                  {selectedMessage.content}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(selectedMessage.message_id)}
                >
                  ลบข้อความนี้
                </button>
              </>
            ) : (
              <div className="empty-view">เลือกข้อความเพื่ออ่าน</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
