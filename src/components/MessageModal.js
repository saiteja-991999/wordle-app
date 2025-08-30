import React from "react";

function MessageModal({ message, resetGame }) {
  return (
    <div className="modal-overlay" onClick={resetGame}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{message.title}</h3>
        <p>{message.text}</p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button className="btn primary" onClick={resetGame}>Play New Game</button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
