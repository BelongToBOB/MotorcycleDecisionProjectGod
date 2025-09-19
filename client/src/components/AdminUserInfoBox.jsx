// AdminUserInfoBox.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/AdminUserInfoBox.css";
import API_BASE_URL from "../config";

export default function AdminUserInfoBox({ user, onDelete }) {
  return (
    <tr>
      <td>
        <img
          src={user.picture || "/default-profile.png"}
          alt={user.username}
          className="table-avatar"
        />
      </td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>*********</td>
      <td>{user.user_id}</td>
      <td>
        <Link to={`/UserEdit/${user.user_id}`}>
          <button className="edit-btn">แก้ไข</button>
        </Link>
        <button
          className="delete-btn"
          onClick={() => onDelete && onDelete(user.user_id)}
        >
          ลบ
        </button>
      </td>
    </tr>
  );
}
