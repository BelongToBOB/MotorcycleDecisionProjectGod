import React from 'react'
import '../style/Home.css'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-menu">
          <ul>
            <li><a href="#">เกี่ยวกับ</a></li>
            <li><a href="#">ติดต่อเรา</a></li>
          </ul>
          <div className="footer-logo">
            <a href="#">BIKEMATCH</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
