"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGymStore } from "@/store/gym-store";
import { BisetLabel } from "./biset-scheme";
import { WeightInput } from "./weight-input";
import type { Exercise } from "@/lib/data/types";
import { saveSet, removeSet } from "@/lib/actions/sessions";

const LONG_PRESS_MS = 3000;

type Props = { exercise: Exercise; accentColor?: string };

function LongPressRing({ progress, color }: { progress: number; color: string }) {
  const r = 9;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={22} height={22} className="-rotate-90 shrink-0">
      <circle cx={11} cy={11} r={r} fill="none" stroke={color + "33"} strokeWidth={2.5} />
      <circle
        cx={11} cy={11} r={r}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={`${circ * progress} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExerciseCard({ exercise, accentColor = "#E08060" }: Props) {
  const toggleSet      = useGymStore((s) => s.toggleSet);
  const isCompleted    = useGymStore((s) => s.isCompleted);
  const completedCount = useGymStore((s) => s.completedCountForExercise);
  const openRestTimer  = useGymStore((s) => s.openRestTimer);
  const sessionId      = useGymStore((s) => s.sessionId);
  const weights        = useGymStore((s) => s.weights);

  const done      = completedCount(exercise.id);
  const allDone   = done === exercise.sets;
  const nextIndex = done;

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding]       = useState(false);
  const [justDone, setJustDone]         = useState(false);

  const isHoldingRef   = useRef(false);
  const didCompleteRef = useRef(false);
  const holdRaf        = useRef(0);
  const holdStart      = useRef(0);
  const prevAllDone    = useRef(false);

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      setJustDone(true);
      const t = setTimeout(() => setJustDone(false), 700);
      prevAllDone.current = true;
      return () => clearTimeout(t);
    }
    if (!allDone) prevAllDone.current = false;
  }, [allDone]);

  function markNextSet() {
    if (allDone) return;
    const already = isCompleted(exercise.id, nextIndex);
    toggleSet(exercise.id, nextIndex);
    if (!sessionId) return;
    if (already) {
      removeSet(sessionId, exercise.id, nextIndex);
    } else {
      const w = weights[exercise.id]?.[0] ?? 0;
      const reps = exercise.repsScheme[0]?.reps ?? 0;
      saveSet(sessionId, exercise.id, nextIndex, w, reps);
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    if (allDone) return;
    didCompleteRef.current = false;
    holdStart.current = Date.now();
    isHoldingRef.current = true;
    setIsHolding(true);

    function tick() {
      if (!isHoldingRef.current) return;
      const elapsed = Date.now() - holdStart.current;
      const progress = Math.min(elapsed / LONG_PRESS_MS, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        isHoldingRef.current = false;
        didCompleteRef.current = true;
        setIsHolding(false);
        setHoldProgress(0);
        openRestTimer(exercise.name, exercise.restSeconds);
        return;
      }
      holdRaf.current = requestAnimationFrame(tick);
    }
    holdRaf.current = requestAnimationFrame(tick);
  }

  function endHold() {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    cancelAnimationFrame(holdRaf.current);
    setIsHolding(false);
    setHoldProgress(0);
    if (!didCompleteRef.current) markNextSet();
  }

  function cancelHold() {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    cancelAnimationFrame(holdRaf.current);
    setIsHolding(false);
    setHoldProgress(0);
    didCompleteRef.current = false;
  }

  const isBiset = exercise.repsScheme.length > 1;

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
                    <span className={cn("text-xs font-semibold", i === 0 ? "text-foreground/90" : "text-amber-400")}>
                      {part.reps} reps
                    </span>
                    {part.note && (
                      <span className="text-[10px] text-amber-500/80 italic">{part.note}</span>
                    )}
                  </div>
                  <WeightInput exerciseId={exercise.id} partIndex={i} step={exercise.weightStep} unit={exercise.weightUnit} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Peso simples */}
      {!isBiset && (
        <div className="flex justify-end mb-3">
          <WeightInput exerciseId={exercise.id} partIndex={0} step={exercise.weightStep} unit={exercise.weightUnit} />
        </div>
      )}

      {/* Dashes de progresso */}
      <div className="flex gap-1.5 mb-2.5">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-secondary">
            {i < done && (
              <div
                className="h-full w-full rounded-full"
                style={{
                  backgroundColor: accentColor,
                  animation: i === done - 1 ? "dash-fill 0.25s ease-out" : undefined,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Botão de ação único */}
      <button
        className={cn(
          "relative w-full rounded-2xl overflow-hidden py-3.5 select-none touch-none transition-colors duration-300",
          allDone ? "text-white" : "bg-secondary"
        )}
        style={allDone ? { backgroundColor: accentColor } : undefined}
        onPointerDown={onPointerDown}
        onPointerUp={endHold}
        onPointerCancel={cancelHold}
        onPointerLeave={cancelHold}
      >
        {/* Fill sweep ao concluir todas as séries */}
        {justDone && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: accentColor,
              animation: "fill-slide 0.35s ease-out forwards",
            }}
          />
        )}

        {/* Fundo de progresso do hold */}
        {isHolding && (
          <div
            className="absolute inset-y-0 left-0 transition-none"
            style={{
              width: `${holdProgress * 100}%`,
              backgroundColor: accentColor + "40",
            }}
          />
        )}

        {/* Conteúdo */}
        <div className="relative flex items-center justify-center gap-2">
          {allDone ? (
            <>
              <Check
                size={15}
                className="text-white"
                style={{ animation: justDone ? "check-pop 0.35s ease-out 0.25s both" : undefined }}
              />
              <span className="text-sm font-semibold text-white">Concluído</span>
            </>
          ) : (
            <>
              <span className={cn("text-sm font-medium", isHolding ? "text-foreground" : "text-muted-foreground")}>
                {isHolding ? "Segura para descanso…" : `Série ${done + 1} de ${exercise.sets}`}
              </span>
              {isHolding && <LongPressRing progress={holdProgress} color={accentColor} />}
            </>
          )}
        </div>
      </button>
    </div>
  );
}
