import React, { useState, useEffect, useCallback, useRef } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import MessageModal from "./components/MessageModal";
import Header from "./components/Header";

const MAX_GUESSES = 6;

function App() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const answerRef = useRef("Wordle");

  // 🔹 word length state (default 6)
  const [wordLength, setWordLength] = useState(6);

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

  const fetchAnswer = useCallback(async () => {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?length=${wordLength}`
      );
      const data = await response.json();
      setAnswer(data[0].toUpperCase());
    } catch (error) {
      console.error("Error fetching word:", error);
      setAnswer("PLANET".slice(0, wordLength)); // fallback
    }
  }, [wordLength]);

  // Get the "word" query parameter from the URL
  const getWordFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("word");
  }, []);

  // Set the answer based on the URL query parameter or fallback to an API call
  // Set the answer based on the URL query parameter or fallback to an API call
  const setGameAnswer = useCallback(() => {
    const wordFromUrl = getWordFromUrl();
    try {
      if (wordFromUrl) {
        const encryptedWord = decodeURIComponent(atob(wordFromUrl));
        if (encryptedWord) {
          answerRef.current = "Custom Wordle";
          setWordLength(encryptedWord.length); // 🔹 dynamically update wordLength
          setAnswer(encryptedWord.toUpperCase());
          return;
        }
      }
    } catch (e) {
      console.warn("Invalid word param");
    }
    fetchAnswer(); // fallback to random API word
  }, [getWordFromUrl, fetchAnswer]);

  const resetGame = useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname);
    answerRef.current = "Wordle";
    setGuesses([]);
    setStatuses([]);
    setCurrentGuess("");
    setMessage(null);
    fetchAnswer();
  }, [fetchAnswer]);

  // 🔹 Fetch answer and reset game whenever wordLength changes
  useEffect(() => {
    setGameAnswer();
    setGuesses([]);
    setStatuses([]);
    setCurrentGuess("");
    setMessage(null);
  }, [wordLength, setGameAnswer]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) return;

    const guess = currentGuess.toUpperCase();
    const status = Array(wordLength).fill("absent");
    const answerArr = answer.split("");

    // First pass: correct letters
    guess.split("").forEach((ch, i) => {
      if (ch === answerArr[i]) {
        status[i] = "correct";
        answerArr[i] = null;
      }
    });

    // Second pass: present letters
    guess.split("").forEach((ch, i) => {
      if (status[i] === "correct") return;
      const idx = answerArr.indexOf(ch);
      if (idx !== -1) {
        status[i] = "present";
        answerArr[idx] = null;
      }
    });

    setGuesses((prevGuesses) => [...prevGuesses, guess]);
    setStatuses((prevStatuses) => [...prevStatuses, status]);
    setCurrentGuess("");

    if (guess === answer) {
      setMessage({ title: "You got it!", text: `🎉 Correct — ${answer}` });
    } else if (guesses.length === MAX_GUESSES - 1) {
      setMessage({
        title: "Out of chances",
        text: `❌ The word was ${answer}`,
      });
    }
  }, [currentGuess, guesses, answer, wordLength]);

  const handleKey = useCallback(
    (key) => {
      if (isModalOpen || message || guesses.length >= MAX_GUESSES) return;

      if (key === "ENTER") {
        if (currentGuess.length === wordLength) submitGuess();
      } else if (key === "DEL") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, guesses, message, submitGuess, isModalOpen, wordLength]
  );

  useEffect(() => {
    const handlePhysicalKey = (e) => {
      if (isModalOpen || message) return;
      const key = e.key.toUpperCase();
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
          heading={answerRef.current}
          wordLength={wordLength}
          setWordLength={setWordLength}
        />
        <div className="main-area">
          <Board
            guesses={guesses}
            statuses={statuses}
            currentGuess={currentGuess}
            wordLength={wordLength}
          />
          <Keyboard handleKey={handleKey} />
        </div>
        {message && <MessageModal message={message} resetGame={resetGame} />}
      </div>
    </div>
  );
}

export default App;
