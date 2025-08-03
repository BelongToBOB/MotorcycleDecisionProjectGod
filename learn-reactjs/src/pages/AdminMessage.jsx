import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../style/AdminMessage.css';
import Swal from 'sweetalert2';

export default function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/message', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
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
      cancelButtonColor: "#3085d6"
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/message/${message_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(msgs => msgs.filter(m => m.message_id !== message_id));
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
        {loading ? <div>Loading...</div> : (
          <table className="admin-msg-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อ</th>
                <th>อีเมล</th>
                <th>เบอร์</th>
                <th>ข้อความ</th>
                <th>วันที่ส่ง</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m, idx) => (
                <tr key={m.message_id}>
                  <td>{idx + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.tel}</td>
                  <td>{m.content}</td>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(m.message_id)} className="delete-btn">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
