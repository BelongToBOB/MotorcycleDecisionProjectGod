// BikeTypeBox.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/BikeTypeBox.css";

export default function BikeTypeBox({ type, onDelete }) {
  return (
    <tr>
      <td>
        <img
          src={type.picture || "/default-bike-type.png"}
          alt={type.moto_type_name}
          className="table-avatar"
        />
      </td>
      <td>{type.moto_type_id}</td>
      <td>{type.moto_type_name}</td>
      <td>
        <Link to={`/BikeTypeModify/${type.moto_type_id}`}>
          <button className="edit-btn">แก้ไข</button>
        </Link>
        <button
          className="delete-btn"
          onClick={() => onDelete && onDelete(type.moto_type_id)}
        >
          ลบ
        </button>
      </td>
    </tr>
  );
}
