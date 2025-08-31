import React, { useState } from "react";

function Modal({ onClose, isDarkMode }) {
  const [word, setWord] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputWord = e.target.value.toUpperCase();
    if (inputWord.length <= 8) {
      setWord(inputWord);
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation(); // Prevent affecting Wordle grid
  };

  const handleGenerate = () => {
    if (word.length >= 3 && word.length <= 8) {
      // Use base site URL without stacking params
      const currentUrl = `${window.location.origin}${window.location.pathname}`;

      // Encode the word
      const encryptedWord = btoa(encodeURIComponent(word));

      // Append ?word= param
      const generated = `${currentUrl}?word=${encryptedWord}`;
      setGeneratedUrl(generated);
      setError("");
    } else {
      setError("Please enter a word between 3 to 8 letters.");
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
        <h3>Custom Wordle Generator</h3>
        <input
          type="text"
          value={word}
          onChange={handleInputChange}
          placeholder="Enter 3–8 letter word"
          maxLength={8}
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
