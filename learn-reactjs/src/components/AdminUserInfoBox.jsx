import React from 'react'
import { Link } from 'react-router-dom';
import '../style/AdminUserInfoBox.css'

export default function AdminUserInfoBox({ user, onDelete }) {
  return (
    <div className='info-user-box'>
        <div className='info-part'>
            <div className='info-user-img'>
                <img src={user.picture || "/default-profile.png"} alt="" />
            </div>
            <div className='info-user'>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Password: *********</p>
            </div>
        </div>
        <div className='edit-part'>
            <Link to={`/UserEdit/${user.id}`}><button className='edit-btn'>แก้ไข</button></Link>
            <button className='delete-btn' onClick={() => onDelete(user.id)}>ลบ</button>
            <span>user_id: {user.id}</span>
        </div>
    </div>
  )
}

