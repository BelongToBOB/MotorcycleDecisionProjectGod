import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore'; // ถ้าใช้ Zustand/Context สำหรับ auth
import '../style/Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login'); 
  }; 

  return (
    <>
      <div className={isOpen ? 'sidebar open' : 'sidebar'}>
        <button onClick={toggleSidebar} className="close-btn">x</button>
        <Link to="#" className="nav-link" onClick={toggleSidebar}>Close</Link>
        <h1>จัดการข้อมูลพื้นฐาน</h1>
        <Link to={'/AdminPage'} className="nav-link">ผู้ดูแลระบบ</Link>
        <Link to={'/AdminUserPage'} className="nav-link">ผู้ใช้งาน</Link>
        <Link to={'/BikeTypeEdit'} className="nav-link">ประเภทรถจักรยานยนต์</Link>
        <Link to={'/BikeList'} className="nav-link">รถจักรยานยนต์</Link>
        <Link to={'/AdminMessage'} className="nav-link">ข้อความ</Link>
        <Link to={'/Statistic'} className="nav-link">สถิติ</Link>
        <Link className="nav-link" onClick={handleLogout} to={'/'}>
          ลงชื่อออก
        </Link>
      </div>
      <div className="topbar">
        <button onClick={toggleSidebar} className="menu-btn">☰</button>
        <span className="page-title">จัดการข้อมูลพื้นฐาน</span>
      </div>
    </>
  );
}
