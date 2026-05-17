import { WEEKLY_SCHEDULE } from "./data/types";
import type { WorkoutType } from "./data/types";

export function getTodayWorkout(): WorkoutType | null {
  const day = new Date().getDay();
  return WEEKLY_SCHEDULE[day] ?? null;
}

export function formatRepsScheme(
  repsScheme: { reps: number; note?: string }[],
  sets: number
): string {
  if (repsScheme.length === 1) {
    return `${sets}x${repsScheme[0].reps}`;
  }
  const repsStr = repsScheme.map((r) => r.reps).join("+");
  return `${sets}x${repsStr}`;
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function formatTodayDate(): string {
  const now = new Date();
  const day = DAY_NAMES[now.getDay()];
  const date = now.getDate();
  const month = MONTH_NAMES[now.getMonth()];
  return `${day}, ${date} ${month}`;
}
