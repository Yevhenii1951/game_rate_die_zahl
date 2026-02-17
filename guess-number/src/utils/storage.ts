// src/utils/storage.ts
export type Highscore = {
  name: string;
  attempts: number;
};

const STORAGE_KEY = "guess_number_highscores_v1";

export function loadHighscores(): Highscore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // Простая проверка на массив
    if (!Array.isArray(parsed)) return [];

    // Фильтруем только корректные записи
    return parsed
      .filter(
        (x) =>
          x &&
          typeof x.name === "string" &&
          typeof x.attempts === "number" &&
          Number.isFinite(x.attempts)
      )
      .map((x) => ({ name: x.name, attempts: x.attempts }));
  } catch {
    return [];
  }
}

export function saveHighscores(scores: Highscore[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}
