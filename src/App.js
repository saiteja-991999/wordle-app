import React, { useState, useEffect, useCallback } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Get the "word" query parameter from the URL
  const getWordFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("word");
  };

  // Set the answer based on the URL query parameter or fallback to an API call
  const setGameAnswer = () => {
    const wordFromUrl = getWordFromUrl();
    const encryptedWord = decodeURIComponent(atob(wordFromUrl));
    if (encryptedWord && encryptedWord.length === 6) {
      setAnswer(encryptedWord); // Set answer to the URL word if it's valid
    } else {
      fetchAnswer(); // Fetch a new word if the URL doesn't contain a valid word
    }
  };

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
    window.history.replaceState(null, "", window.location.pathname);
    setGuesses([]);
    setStatuses([]);
    setCurrentGuess("");
    setMessage(null);
    fetchAnswer();
  };

  // Fetch answer and check the URL parameter on initial load
  useEffect(() => {
    setGameAnswer();
  }, []);

  // Use useCallback to memoize submitGuess
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return;

    const guess = currentGuess.toUpperCase();
    const status = Array(WORD_LENGTH).fill("absent");
    const answerArr = answer.split("");

    // First pass: Check for correct letters
    guess.split("").forEach((ch, i) => {
      if (ch === answerArr[i]) {
        status[i] = "correct";
        answerArr[i] = null;
      }
    });

    // Second pass: Check for present letters
    guess.split("").forEach((ch, i) => {
      if (status[i] === "correct") return;
      const idx = answerArr.indexOf(ch);
      if (idx !== -1) {
        status[i] = "present";
        answerArr[idx] = null;
      }
    });

    // Update guesses and statuses using functional setState to ensure latest values
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
    setStatuses((prevStatuses) => [...prevStatuses, status]);
    setCurrentGuess("");

    // Check if the guess is correct or out of chances
    if (guess === answer) {
      setMessage({ title: "You got it!", text: `🎉 Correct — ${answer}` });
    } else if (guesses.length === MAX_GUESSES - 1) {
      setMessage({
        title: "Out of chances",
        text: `❌ The word was ${answer}`,
      });
    }
  }, [currentGuess, guesses, answer]); // Ensure that submitGuess has the latest state values

  // handleKey using useCallback
  const handleKey = useCallback(
    (key) => {
      if (isModalOpen) return;
      if (message) return;
      if (guesses.length >= MAX_GUESSES) return;

      if (key === "ENTER") {
        if (currentGuess.length === WORD_LENGTH) {
          submitGuess(); // Call submitGuess function
        }
      } else if (key === "DEL") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prevGuess) => prevGuess + key);
      }
    },
    [currentGuess, guesses, message, submitGuess, isModalOpen] // Include submitGuess as a dependency
  );

  useEffect(() => {
    const handlePhysicalKey = (e) => {
      if (isModalOpen) return;
      const key = e.key.toUpperCase();
      if (message) return;
      if (key === "ENTER") handleKey("ENTER");
      else if (key === "BACKSPACE") handleKey("DEL");
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };
    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [handleKey, message, isModalOpen]);

  return (
    <div className="wordle-app">
      <div className="container">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
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
