import React from 'react'
import '../style/Home.css'
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-menu">
          <ul>
            <li><a href="#">เกี่ยวกับ</a></li>
            <li><Link to={'/Contact'}>ติดต่อเรา</Link></li>
          </ul>
          <div className="footer-logo">
            <a href="#">BIKEMATCH</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
