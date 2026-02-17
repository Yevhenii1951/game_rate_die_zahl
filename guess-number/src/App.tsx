// src/App.tsx
import { useEffect, useState } from "react";
import { GameView } from "./components/GameView";
import { WinView } from "./components/WinView";
import { HighscoreList } from "./components/HighscoreList";
import { loadHighscores, saveHighscores, type Highscore } from "./utils/storage";

// Генератор случайного числа от min до max включительно
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN = 1;
const MAX = 20;

export default function App() {
  // 1) Загаданное число
  const [secretNumber, setSecretNumber] = useState<number>(() => randomInt(MIN, MAX));

  // 2) Состояния игры
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // 3) Победа
  const [isWon, setIsWon] = useState<boolean>(false);

  // 4) Highscore
  const [playerName, setPlayerName] = useState<string>("");
  const [highscores, setHighscores] = useState<Highscore[]>([]);

  // Сообщение на экране победы (например "Введите имя")
  const [winMessage, setWinMessage] = useState<string>("");

  // Загружаем highscores один раз при старте
  useEffect(() => {
    setHighscores(loadHighscores());
  }, []);

  function handleSubmitGuess() {
    // Превращаем строку в число
    const numberGuess = Number(guess);

    // Проверка: число ли это и 1..20 ли
    if (!Number.isInteger(numberGuess) || numberGuess < MIN || numberGuess > MAX) {
      setMessage(`Bitte gib eine ganze Zahl von ${MIN} bis ${MAX} ein.`);
      return;
    }

    // Это валидная попытка → увеличиваем счётчик
    setAttempts((prev) => prev + 1);

    // Сравнение с секретом
    if (numberGuess > secretNumber) {
      setMessage("Zu groß");
      return;
    }
    if (numberGuess < secretNumber) {
      setMessage("Zu klein");
      return;
    }

    // Угадал
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

    // Добавляем, сортируем по attempts (меньше лучше), оставляем топ-10
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

  // Рендер
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
  secretNumber={secretNumber} //
  playerName={playerName}
  onNameChange={setPlayerName}
  onSave={handleSaveScore}
  onNewGame={handleNewGame}
  message={winMessage}
/>

          <HighscoreList highscores={highscores} />
        </>
      )}

      {/* маленькая кнопка очистки highscores (по желанию) */}
      <div style={{ textAlign: "center", marginBottom: 24, opacity: 0.7 }}>
        <button
          onClick={() => {
            const empty: Highscore[] = [];
            setHighscores(empty);
            saveHighscores(empty);
          }}
          style={{ padding: "6px 10px" }}
        >
          Clear Highscore
        </button>
      </div>
    </div>
  );
}
