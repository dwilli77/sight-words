import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { sightWords } from "./words";
import "./reset.scss";
import "./App.scss";

const App = () => {
  const [words, setWords] = useState(sightWords);
  const [currentWord, setCurrentWord] = useState("");
  const [typedWord, setTypedWord] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [failedValidation, setFailedValidation] = useState(false);

  useEffect(() => {
    _getWord();
  }, []);

  useEffect(() => {
    if (words.length === 0) {
      setWords(sightWords);
    }
  }, [words]);

  const _getWord = () => {
    let index = Math.floor(Math.random() * words.length);
    setCurrentWord(words[index]);
    setWords(words.filter(word => word !== currentWord));
  };

  const _checkWord = e => {
    e.preventDefault();
    if (currentWord === typedWord.toLowerCase()) {
      setModalOpen(true);
      setTimeout(_closeModal, 4000);
      setTypedWord("");
      _getWord();
    } else {
      setFailedValidation(true);
      setTimeout(_closeModal, 4000);
      setTypedWord("");
    }
  };

  const _closeModal = () => {
    setModalOpen(false);
    setFailedValidation(false);
  };

  return (
    <div className="App">
      {modalOpen ? (
        <>
          <div className="grey-out" />
          <div className="congrats">
            <Confetti width={400} height={400} />
            <i className="fas fa-check-circle good" />
          </div>
        </>
      ) : null}
      {failedValidation ? (
        <>
          <div className="grey-out" />
          <div className="congrats">
            <i className="fas fa-times-circle bad" />
          </div>
        </>
      ) : null}
      <div className="app-container">
        <p className="prompt">Your word is:</p>
        <h3 className={failedValidation ? "red" : ""}>
          {currentWord === "i" ? currentWord.toUpperCase() : currentWord}
        </h3>
        <form>
          {modalOpen || failedValidation ? null : (
            <input
              type="text"
              value={typedWord}
              onChange={e => setTypedWord(e.target.value)}
              placeholder="type your word here..."
              autoComplete="new-word"
              // disabled={modalOpen || failedValidation}
            />
          )}
          <button className="check-word" onClick={_checkWord}>
            Check my word
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
