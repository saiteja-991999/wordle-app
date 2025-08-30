import React from "react";

function Header({ darkMode, setDarkMode }) {
  return (
    <div className="header">
      <div className="title">Wordle</div>{" "}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="theme-btn"
          title="Toggle theme"
          tabIndex={-1}
          onClick={() => setDarkMode((s) => !s)}
        >
          {darkMode ? "☀️" : "🌙"}{" "}
        </button>
      </div>
    </div>
  );
}

export default Header;
