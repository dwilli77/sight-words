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
  const [name, setName] = useState("");
  const [nameValidated, setNameValidated] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.mixpanel.track("site visit");
    _getWord();
  }, []);

  useEffect(() => {
    if (words.length === 0) {
      window.mixpanel.track("cycled words: " + name);
      setWords(sightWords);
    }
  }, [words]);

  useEffect(() => {
    if (name) {
      setModalOpen(true);
      setTimeout(_closeModal, 4000);
    }
  }, [score]);

  const _getWord = () => {
    let index = Math.floor(Math.random() * words.length);
    setCurrentWord(words[index]);
    setWords(words.filter(word => word !== words[index]));
  };

  const _checkWord = e => {
    e.preventDefault();
    if (!typedWord) {
      return false;
    }
    if (currentWord === typedWord.toLowerCase()) {
      setScore(score + 1);
      setTypedWord("");
      setTimeout(_getWord, 0);
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

  const _checkName = e => {
    e.preventDefault();
    if (!name) {
      return false;
    } else {
      setNameValidated(true);
      window.mixpanel.track(`logged name: ${name}`);
    }
  };

  return (
    <div className='App'>
      <div className='app-container'>
        {nameValidated ? (
          <>
            <p className='prompt'>{`${name}, your word is:`}</p>
            <h3 className={failedValidation ? "red" : ""}>
              {currentWord === "i" ? currentWord.toUpperCase() : currentWord}
            </h3>
            <form>
              <input
                type='text'
                value={typedWord}
                onChange={e => setTypedWord(e.target.value)}
                placeholder='type your word here...'
                autoComplete='new-word'
                disabled={modalOpen || failedValidation}
              />

              <button className='check-word' onClick={_checkWord}>
                Check my word
              </button>
            </form>
          </>
        ) : (
          <>
            <p className='get-started'>Let's get started!</p>
            <p className='name-prompt'>What's your name?</p>
            <form>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='type your name here...'
                autoComplete='new-name'
                maxLength='15'
              />
              <button className='submit-name' onClick={_checkName}>
                Start
              </button>
            </form>
          </>
        )}
      </div>
      {modalOpen ? (
        score % sightWords.length === 0 ? (
          <>
            <div className='grey-out' />
            <div className='congrats'>
              <p className='congrats-note'>{`Great job ${name}! You finished all the words!`}</p>
              <i className='fas fa-dharmachakra doubloon' />
            </div>
          </>
        ) : (
          <>
            <div className='grey-out' />
            <div className='congrats'>
              <Confetti width={400} height={400} />
              <i className='fas fa-check-circle good' />
            </div>
          </>
        )
      ) : null}
      {failedValidation ? (
        <>
          <div className='grey-out' />
          <div className='congrats'>
            <i className='fas fa-times-circle bad' />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default App;
