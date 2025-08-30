import React from "react";
import Modal from "./Modal"; // Import the Modal component

function Header({
  darkMode,
  setDarkMode,
  isModalOpen,
  setIsModalOpen,
  heading,
}) {
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            title="Edit Settings"
            onClick={openModal}
          >
            ✏️
          </button>
        </div>
      </div>

      {isModalOpen && <Modal onClose={closeModal}  />}
    </>
  );
}

export default Header;
