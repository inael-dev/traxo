"use client";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGymStore } from "@/store/gym-store";
import { BisetLabel } from "./biset-scheme";
import { WeightInput } from "./weight-input";
import type { Exercise } from "@/lib/data/types";
import { saveSet, removeSet } from "@/lib/actions/sessions";

type Props = { exercise: Exercise; accentColor?: string };

export function ExerciseCard({ exercise, accentColor = "#E08060" }: Props) {
  const toggleSet = useGymStore((s) => s.toggleSet);
  const isCompleted = useGymStore((s) => s.isCompleted);
  const completedCount = useGymStore((s) => s.completedCountForExercise);
  const sessionId = useGymStore((s) => s.sessionId);
  const weights = useGymStore((s) => s.weights);

  const isBiset = exercise.repsScheme.length > 1;
  const done = completedCount(exercise.id);
  const allDone = done === exercise.sets;

  function handleToggle(setIndex: number) {
    const already = isCompleted(exercise.id, setIndex);
    toggleSet(exercise.id, setIndex, exercise.name, exercise.restSeconds);

    if (!sessionId) return;
    if (already) {
      removeSet(sessionId, exercise.id, setIndex);
    } else {
      const w = weights[exercise.id]?.[0] ?? 0;
      const reps = exercise.repsScheme[0]?.reps ?? 0;
      saveSet(sessionId, exercise.id, setIndex, w, reps);
    }
  }

  return (
    <div
      className={cn(
        "rounded-[16px] border bg-card p-4 transition-colors",
        allDone ? "border-white/10" : "border-border"
      )}
      style={allDone ? { backgroundColor: accentColor + "12" } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/workout/${exercise.workoutType}/exercise/${exercise.id}`}
            className="flex items-center gap-1 group"
          >
            <h3
              className={cn(
                "font-semibold text-sm leading-snug",
                allDone ? "text-muted-foreground line-through" : "text-foreground"
              )}
            >
              {exercise.name}
            </h3>
            <ChevronRight size={13} className="text-muted-foreground shrink-0 opacity-50 group-active:opacity-100" />
          </Link>
          <div className="mt-0.5">
            <BisetLabel repsScheme={exercise.repsScheme} sets={exercise.sets} />
          </div>
        </div>
        {allDone && (
          <CheckCircle2
            size={18}
            className="shrink-0 mt-0.5"
            style={{ color: accentColor }}
          />
        )}
      </div>

      {/* Biset detail */}
      {isBiset && (
        <div className="mb-3 pl-1">
          <div className="flex items-stretch gap-2">
            <div className="flex flex-col items-center py-0.5 w-3 shrink-0">
              <div className="w-px flex-1 bg-amber-500/60" />
              <svg width="8" height="8" viewBox="0 0 8 8" className="text-amber-500 shrink-0">
                <path d="M4 8 L0 0 L8 0 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {exercise.repsScheme.map((part, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        i === 0 ? "text-foreground/90" : "text-amber-400"
                      )}
                    >
                      {part.reps} reps
                    </span>
                    {part.note && (
                      <span className="text-[10px] text-amber-500/80 italic">
                        {part.note}
                      </span>
                    )}
                  </div>
                  <WeightInput exerciseId={exercise.id} partIndex={i} step={exercise.weightStep} unit={exercise.weightUnit} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Peso exercício simples */}
      {!isBiset && (
        <div className="flex justify-end mb-3">
          <WeightInput exerciseId={exercise.id} partIndex={0} step={exercise.weightStep} unit={exercise.weightUnit} />
        </div>
      )}

      {/* Botões de série */}
      <div className="flex gap-2">
        {Array.from({ length: exercise.sets }, (_, i) => {
          const setDone = isCompleted(exercise.id, i);
          return (
            <button
              key={i}
              onPointerDown={(e) => {
                e.preventDefault();
                handleToggle(i);
              }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center rounded-xl py-2.5 gap-0.5 transition-colors select-none",
                setDone
                  ? "text-white"
                  : "bg-secondary text-muted-foreground active:bg-accent"
              )}
              style={
                setDone
                  ? { backgroundColor: accentColor + "33", color: accentColor }
                  : undefined
              }
            >
              {setDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              <span className="text-[10px] font-medium">{i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
