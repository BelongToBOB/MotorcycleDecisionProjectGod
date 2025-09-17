import React from 'react'
import '../style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import ProfileUser from '../pages/ProfileUser';

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to={'/'}>BIKE</Link>
          <Link to={'/'} className="a2">MATCH</Link>
        </div>
        <div className="menu">
          <Link to={'/'}>หน้าหลัก</Link>
          <Link to={'/Info'}>ข้อมูลรถ</Link>
          <Link to={'/Magazine'}>แนะนำ</Link>
          <Link to={'/Contact'}>ติดต่อเรา</Link>
        </div>
        <div className="loginform">
          {user ? (
            <>
              <span className="user-name">
                <Link to={'/ProfileUser'}>👤{user.username || user.email}</Link>
                {user.role === "admin" && <span style={{ marginLeft: 6, color: "#e67e22" }}>👑แอดมิน</span>}
              </span>
              {user.role === "admin" && (
                <Link to="/AdminBo">
                  <button className="admin-button" style={{ marginLeft: 10 }}>
                    จัดการข้อมูล
                  </button>
                </Link>
              )}
              <button onClick={handleLogout} className="logout-button">ออกจากระบบ</button>
            </>
          ) : (
            <Link to={'/Login'}>
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </Link>
          )}
        </div>
      </nav>
      <div className="redline"></div>
    </header>
  )
}

export default Navbar
