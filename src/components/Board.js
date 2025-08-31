import React from "react";
import Tile from "./Tile";

function Board({ guesses, statuses, currentGuess, wordLength }) {
  const MAX_GUESSES = 6;

  const renderTile = (letter, status, isActive) => (
    <Tile letter={letter} status={status} isActive={isActive} />
  );

  return (
    <div className="board-wrap">
      <div className="board">
        {[...Array(MAX_GUESSES)].map((_, r) => (
          <div
          key={r}
          className="row"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${wordLength}, 1fr)`,
            gap: "8px",
            justifyContent: "center",
            width: "100%",
            maxWidth: wordLength <= 4 ? `${wordLength * 65}px` : "450px", // fix for desktop
            margin: "0 auto",
          }}
        >
            {[...Array(wordLength)].map((__, c) => {
              const guess = guesses[r] || "";
              const statusRow = statuses[r] || [];
              const letter =
                r === guesses.length ? currentGuess[c] || "" : guess[c] || "";
              const status = statusRow[c];

              const activePos =
                currentGuess.length >= wordLength
                  ? wordLength - 1
                  : currentGuess.length;
              const isActive =
                r === guesses.length &&
                c === activePos &&
                !status &&
                guesses.length < MAX_GUESSES;

              return <div key={c}>{renderTile(letter, status, isActive)}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
