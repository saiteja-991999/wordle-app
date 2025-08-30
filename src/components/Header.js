import React from "react";

function Header({ darkMode, setDarkMode }) {
  return (
    <div className="header">
      <div className="title">Six-letter Wordle</div>
      <button className="theme-btn" onClick={() => setDarkMode((prev) => !prev)}>
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

export default Header;
