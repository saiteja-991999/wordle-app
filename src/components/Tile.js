import React from "react";

function Tile({ letter, status, isActive }) {
  return (
    <div className={`tile ${status ? `tile--${status}` : ""} ${isActive ? "tile--active" : ""}`}>
      <div className="tile-inner">{letter || ""}</div>
    </div>
  );
}

export default Tile;
