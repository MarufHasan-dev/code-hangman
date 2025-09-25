import React from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getRandomWord, getFarewellText } from "./utils/utils";
import Confetti from "react-confetti";

// To Do
// Add remaining guess count
// Render some kind of anti-confetti if the game is lost
// Set a timer that loses the game if time outs
// Deploy it live online

export default function CodeHangman() {
  // State values
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);
  console.log(currentWord);

  // Derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;

  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetters(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    return (
      <button
        disabled={isGameOver}
        className={clsx(
          "keyboard-keys",
          isCorrect && "correct",
          isWrong && "wrong",
          isGameOver && "faded"
        )}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        key={index}
        onClick={() => addGuessedLetters(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
    return (
      <span
        className={clsx(!guessedLetters.includes(letter) && "missed-letter")}
        key={index}
      >
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const languageElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <p
        className={clsx(wrongGuessCount > index && "lost")}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </p>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect && !isGameWon && !isGameLost) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }
    if (isGameWon && isGameOver) {
      return (
        <>
          <h3>You win!</h3>
          <h4>Well done! 🎉</h4>
        </>
      );
    }
    if (isGameLost && isGameOver) {
      return (
        <>
          <h3>Game over!</h3>
          <h4>You lose! Better start learning Assembly 😭</h4>
        </>
      );
    }
    if (guessedLetters === undefined) {
      return null;
    }
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Code Hangman</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="words">{letterElements}</section>

      {/* {Combined visually-hidden aria-live region for status updates} */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The Letter ${lastGuessedLetter} is in the word`
            : `Sorry! the letter ${lastGuessedLetter} is not in the word`}
          You have {numGuessesLeft} attempts left
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard">
        {keyboardElements}
        {isGameOver ? (
          <button
            onClick={() => {
              setCurrentWord(getRandomWord);
              setGuessedLetters([]);
            }}
            id="new-game"
          >
            New Game
          </button>
        ) : null}
      </section>
    </main>
  );
}
