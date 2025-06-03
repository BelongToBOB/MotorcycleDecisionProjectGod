import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../style/AdminMessage.css';

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

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบข้อความนี้ใช่หรือไม่?")) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/message/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessages(msgs => msgs.filter(m => m.id !== id));
  };

  return (
    <>
      <Navbar />
      <Sidebar/>
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
                <tr key={m.id}>
                  <td>{idx + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.tel}</td>
                  <td>{m.content}</td>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(m.id)} className="delete-btn">ลบ</button>
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
