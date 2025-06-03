import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../style/AdminUserPage.css'
import AdminUserInfoBox from '../components/AdminUserInfoBox';
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setUsers(res.data))
    .catch(() => toast.error("ดึงข้อมูลผู้ใช้ไม่สำเร็จ"));
  }, []);


  const handleDelete = async (id) => {
    if(window.confirm("ยืนยันลบผู้ใช้นี้?")) {
      await axios.delete(`http://localhost:5000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(users.filter(u => u.id !== id));
      toast.success("ลบผู้ใช้สำเร็จ");
    }
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar/>
      <Sidebar />
      <section className='section-user-page'>
        <div className='user-edit-box'>
          <div className='user-tag'>
            <h2>ข้อมูลรายการผู้ใช้</h2>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {filteredUsers.map(user =>
            <AdminUserInfoBox key={user.id} user={user} onDelete={handleDelete} />
          )}
        </div>
      </section>
    </>
  )
}

