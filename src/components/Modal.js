import React, { useState } from "react";

function Modal({ onClose, isDarkMode }) {
  const [word, setWord] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputWord = e.target.value.toUpperCase();
    if (inputWord.length <= 6) {
      setWord(inputWord);
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation(); // Prevent propagation to the parent (Wordle grid)
  };

  const handleGenerate = () => {
    if (word.length === 6) {
      // Get the current website URL
      const currentUrl = window.location.href;

      // Generate the URL by appending a path with the entered word
      const decryptedWord = btoa(encodeURIComponent(word));
      const generated = `${currentUrl}?word=${decryptedWord}`;
      setGeneratedUrl(generated);
      setError("");
    } else {
      setError("Please enter exactly 6 characters.");
    }
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <div
      className={`modal-overlay ${isDarkMode ? "dark-mode" : ""}`}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Settings</h3>
        <input
          type="text"
          value={word}
          onChange={handleInputChange}
          placeholder="Enter 6-letter word"
          maxLength="6"
          onKeyDown={handleKeyDown}
          className="modal-input"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn primary" onClick={handleGenerate}>
          Generate
        </button>
        <button className="btn ghost" onClick={onClose}>
          Close
        </button>

        {generatedUrl && (
          <div>
            <p>Generated URL:</p>
            <input type="text" value={generatedUrl} readOnly />
            <button className="btn ghost" onClick={handleCopy}>
              Copy URL
            </button>
            <button className="btn ghost">
              <a href={generatedUrl} target="_blank" rel="noreferrer">
                Play
              </a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
