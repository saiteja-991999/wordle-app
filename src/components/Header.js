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

  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
          {/* Help Icon */}
          <button className="theme-btn" onClick={() => setIsHelpOpen(true)}>
            ❓
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

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">How to Play</h2>

            <div className="modal-content">
              <p className="intro-text">
                Welcome to <strong>Wordle 🎉</strong>
              </p>

              <ul className="rules-list">
                <li>Guess the hidden word within limited tries.</li>
                <li>
                  <span className="green">🟩</span> means the letter is{" "}
                  <strong>correct & in the right spot</strong>.
                </li>
                <li>
                  <span className="yellow">🟨</span> means the letter is{" "}
                  <strong>correct but in the wrong spot</strong>.
                </li>
                <li>
                  <span className="gray">⬛</span> means the letter is{" "}
                  <strong>not in the word</strong>.
                </li>
                <li>
                  Customise word length (<strong>3–7</strong>) from the dropdown
                  below the header.
                </li>
                <li>
                  Use the <span className="emoji">✏️</span> button to{" "}
                  <strong>generate custom Wordles</strong> and share them with
                  friends.
                </li>
                <li>
                  Toggle <span className="emoji">🌙 / ☀️</span> for Dark & Light
                  mode.
                </li>
              </ul>
            </div>

            <button
              className="btn ghost close-btn"
              onClick={() => setIsHelpOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
}

export default Header;
