// src/App.tsx
import { useEffect, useState } from "react";
import { GameView } from "./components/GameView";
import { WinView } from "./components/WinView";
import { HighscoreList } from "./components/HighscoreList";
import { loadHighscores, saveHighscores, type Highscore } from "./utils/storage";

// Generator für Zufallszahl von min bis max einschließlich
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN = 1;
const MAX = 20;

export default function App() {
  // 1) Geheime Zahl
  const [secretNumber, setSecretNumber] = useState<number>(() => randomInt(MIN, MAX));

  // 2) Spielstatus
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // 3) Gewinn
  const [isWon, setIsWon] = useState<boolean>(false);

  // 4) Highscore
  const [playerName, setPlayerName] = useState<string>("");
  const [highscores, setHighscores] = useState<Highscore[]>([]);

  // Nachricht auf dem Gewinnbildschirm (z.B. "Geben Sie Ihren Namen ein")
  const [winMessage, setWinMessage] = useState<string>("");

  // Laden Sie Highscores einmal beim Start
  useEffect(() => {
    setHighscores(loadHighscores());
  }, []);

  function handleSubmitGuess() {
    // String in Zahl umwandeln
    const numberGuess = Number(guess);

    // Überprüfung: Ist dies eine Zahl und zwischen 1..20?
    if (!Number.isInteger(numberGuess) || numberGuess < MIN || numberGuess > MAX) {
      setMessage(`Bitte gib eine ganze Zahl von ${MIN} bis ${MAX} ein.`);
      return;
    }

    // Dies ist ein gültiger Versuch → Zähler erhöhen
    setAttempts((prev) => prev + 1);

    // Vergleich mit dem Geheimnis
    if (numberGuess > secretNumber) {
      setMessage("Zu groß");
      return;
    }
    if (numberGuess < secretNumber) {
      setMessage("Zu klein");
      return;
    }

    // Richtig geraten
    setMessage("Gewonnen!");
    setIsWon(true);
    setWinMessage("");
  }

  function handleSaveScore() {
    const name = playerName.trim();

    if (name.length === 0) {
      setWinMessage("Bitte gib deinen Namen ein.");
      return;
    }

    const newEntry: Highscore = { name, attempts };

    // Hinzufügen, nach Versuchen sortieren (weniger ist besser), Top-10 behalten
    const updated = [...highscores, newEntry]
      .sort((a, b) => a.attempts - b.attempts)
      .slice(0, 10);

    setHighscores(updated);
    saveHighscores(updated);

    setWinMessage("Gespeichert ✅");
  }

  function handleNewGame() {
    setSecretNumber(randomInt(MIN, MAX));
    setGuess("");
    setAttempts(0);
    setMessage("");
    setIsWon(false);
    setPlayerName("");
    setWinMessage("");
  }

  // Render
  return (
    <div>
      {!isWon ? (
        <GameView
          attempts={attempts}
          guess={guess}
          message={message}
          onGuessChange={setGuess}
          onSubmit={handleSubmitGuess}
        />
      ) : (
        <>
          <WinView
            attempts={attempts}
            secretNumber={secretNumber}
            playerName={playerName}
            onNameChange={setPlayerName}
            onSave={handleSaveScore}
            onNewGame={handleNewGame}
            message={winMessage}
          />

          <HighscoreList highscores={highscores} />
        </>
      )}

      {/* Kleine Schaltfläche zum Löschen der Highscores (optional) */}
      <div style={{ textAlign: "center", marginBottom: 24, opacity: 0.7 }}>
        <button
          onClick={() => {
            const empty: Highscore[] = [];
            setHighscores(empty);
            saveHighscores(empty);
          }}
          style={{ padding: "6px 10px" }}
        >
          Highscores löschen
        </button>
      </div>
    </div>
  );
}
