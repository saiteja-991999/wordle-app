import React, { useState } from "react";
import Modal from "./Modal"; // Import the Modal component

function Header({
  darkMode,
  setDarkMode,
  isModalOpen,
  setIsModalOpen,
  heading,
  wordLength,
  setWordLength,
}) {
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [open, setOpen] = useState(false); // dropdown open/close state

  const options = [3, 4, 5, 6, 7, 8]; // word lengths

  const handleSelect = (value) => {
    setWordLength(value);
    setOpen(false);
  };

  return (
    <>
      <div className="header">
        <div className="title">{heading}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="theme-btn"
            title="Toggle theme"
            tabIndex={-1}
            onClick={() => setDarkMode((s) => !s)}
          >
            {darkMode ? "☀️" : "🌙"}{" "}
          </button>
          {/* Edit Button */}
          <button
            className="theme-btn"
            title="Custom Wordle Generator"
            onClick={openModal}
          >
            ✏️
          </button>
        </div>
      </div>
      {heading === "Wordle" && (
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setOpen((prev) => !prev)}
            >
              {wordLength} Letters ▼
            </button>

            {open && (
              <div className="dropdown-options">
                {options.map((opt) => (
                  <div
                    key={opt}
                    className="dropdown-item"
                    onClick={() => handleSelect(opt)}
                  >
                    {opt} Letters
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
}

export default Header;
