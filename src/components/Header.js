import React, { useState } from "react";
import Modal from "./Modal"; // Import the Modal component

function Header({ darkMode, setDarkMode, isModalOpen, setIsModalOpen }) {

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    console.log("Settings saved!");
    closeModal();
  };

  return (
    <>
      <div className="header">
        <div className="title">Six-letter Wordle</div>
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
            title="Edit Settings"
            onClick={openModal}
          >
            ✏️
          </button>
        </div>
      </div>

      {isModalOpen && <Modal onClose={closeModal} onSave={handleSave} />}
    </>
  );
}

export default Header;
