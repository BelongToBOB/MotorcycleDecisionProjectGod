import React from "react";
import "../style/BikeAll.css";

export default function BikeCard({ bike, onDetail }) {
  return (
    <div className="Bike-Name-pic">
      <img
        src={bike.picture || "/default-bike.png"}
        alt={bike.moto_name}
        className="bike-img-bikeAll"
        onClick={onDetail}
      />
      <h2 className="bike-name">{bike.moto_name}</h2>
    </div>
  );
}

