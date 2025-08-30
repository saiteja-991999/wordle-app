import React from "react";

function Keyboard({ handleKey }) {
  const keyRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ];

  return (
    <div className="keyboard-wrap">
      <div className="keyboard">
        {keyRows.map((row, ri) => (
          <div key={ri} className="key-row">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`key ${
                  key === "ENTER" || key === "DEL" ? "wide" : ""
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
