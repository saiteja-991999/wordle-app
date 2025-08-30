import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import MessageModal from "./components/MessageModal";
import Header from "./components/Header";

const WORD_LENGTH = 6;
const MAX_GUESSES = 6;

function App() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("wordleTheme");
    if (saved === "dark") setDarkMode(true);
    else if (saved === "light") setDarkMode(false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark-mode");
    else root.classList.remove("dark-mode");
    localStorage.setItem("wordleTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchAnswer = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=6"
      );
      const data = await response.json();
      setAnswer(data[0].toUpperCase());
    } catch (error) {
      console.error("Error fetching word:", error);
      setAnswer("PLANET");
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setStatuses([]);
    setCurrentGuess("");
    setMessage(null);
    fetchAnswer();
  };

  useEffect(() => {
    fetchAnswer();
  }, []);

  const handleKey = (key) => {
    if (message) return;
    if (guesses.length >= MAX_GUESSES) return;

    if (key === "ENTER") {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (key === "DEL") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prevGuess) => prevGuess + key);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;

    const guess = currentGuess.toUpperCase();
    const status = Array(WORD_LENGTH).fill("absent");
    const answerArr = answer.split("");

    guess.split("").forEach((ch, i) => {
      if (ch === answerArr[i]) {
        status[i] = "correct";
        answerArr[i] = null;
      }
    });

    guess.split("").forEach((ch, i) => {
      if (status[i] === "correct") return;
      const idx = answerArr.indexOf(ch);
      if (idx !== -1) {
        status[i] = "present";
        answerArr[idx] = null;
      }
    });

    setGuesses([...guesses, guess]);
    setStatuses([...statuses, status]);
    setCurrentGuess("");

    if (guess === answer) {
      setMessage({ title: "You got it!", text: `🎉 Correct — ${answer}` });
    } else if (guesses.length === MAX_GUESSES - 1) {
      setMessage({
        title: "Out of chances",
        text: `❌ The word was ${answer}`,
      });
    }
  };

  useEffect(() => {
    const handlePhysicalKey = (e) => {
      const key = e.key.toUpperCase();
      if (message) return;
      if (key === "ENTER") handleKey("ENTER");
      else if (key === "BACKSPACE") handleKey("DEL");
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };
    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [currentGuess, guesses, message]);

  return (
    <div className="wordle-app">
      <div className="container">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="main-area">
          <Board
            guesses={guesses}
            statuses={statuses}
            currentGuess={currentGuess}
          />
          <Keyboard handleKey={handleKey} />
        </div>
        {message && <MessageModal message={message} resetGame={resetGame} />}
      </div>
    </div>
  );
}

export default App;
