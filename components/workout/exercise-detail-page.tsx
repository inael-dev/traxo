"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGymStore } from "@/store/gym-store";
import { RestTimer } from "./rest-timer";
import { WeightInput } from "./weight-input";
import { BisetLabel } from "./biset-scheme";
import type { Exercise, WorkoutType } from "@/lib/data/types";
import { WORKOUT_META } from "@/lib/data/types";
import { saveSet, removeSet, completeSession } from "@/lib/actions/sessions";

type Props = {
  type: WorkoutType;
  exercises: Exercise[];
  currentIndex: number;
};

export function ExerciseDetailPage({ type, exercises, currentIndex }: Props) {
  const router = useRouter();
  const meta = WORKOUT_META[type];
  const exercise = exercises[currentIndex];
  const prevEx = currentIndex > 0 ? exercises[currentIndex - 1] : null;
  const nextEx = currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;
  const isBiset = exercise.repsScheme.length > 1;

  const toggleSet = useGymStore((s) => s.toggleSet);
  const isCompleted = useGymStore((s) => s.isCompleted);
  const completedCount = useGymStore((s) => s.completedCountForExercise);
  const sessionId = useGymStore((s) => s.sessionId);
  const weights = useGymStore((s) => s.weights);

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

  async function handleFinish() {
    if (sessionId) await completeSession(sessionId);
    router.push("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-12 pb-3">
        <Link
          href={`/workout/${type}`}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 active:bg-accent"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="flex-1 font-bold text-base leading-tight truncate">
          {exercise.name}
        </h1>
        <span className="text-sm text-muted-foreground tabular-nums shrink-0">
          {currentIndex + 1}/{exercises.length}
        </span>
      </header>

      {/* GIF */}
      <div
        className="relative w-full aspect-square bg-card overflow-hidden"
        style={{ maxHeight: 320 }}
      >
        {exercise.gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
            style={{ maxHeight: 320 }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: meta.accentColor + "18" }}
          >
            <span
              className="text-7xl font-black opacity-20"
              style={{ color: meta.accentColor }}
            >
              {type}
            </span>
          </div>
        )}

        {/* Muscle group chip */}
        <div className="absolute bottom-3 left-3">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm"
            style={{
              backgroundColor: meta.accentColor + "33",
              color: meta.accentColor,
            }}
          >
            {exercise.muscleGroup}
          </span>
        </div>

        {allDone && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/50">
            <CheckCircle2 size={18} style={{ color: meta.accentColor }} />
          </div>
        )}
      </div>

      {/* Info + controles */}
      <div className="flex-1 px-5 py-5 space-y-5">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Esquema
          </p>
          <BisetLabel repsScheme={exercise.repsScheme} sets={exercise.sets} />
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            {isBiset ? "Cargas" : "Carga"}
          </p>

          {isBiset ? (
            <div className="space-y-3">
              {exercise.repsScheme.map((part, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i === 0 ? meta.accentColor : "#f59e0b",
                      }}
                    />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        i === 0 ? "text-foreground" : "text-amber-400"
                      )}
                    >
                      {part.reps} reps
                      {part.note && (
                        <span className="text-[11px] text-muted-foreground font-normal ml-1.5 italic">
                          {part.note}
                        </span>
                      )}
                    </span>
                  </div>
                  <WeightInput
                    exerciseId={exercise.id}
                    partIndex={i}
                    step={exercise.weightStep}
                    unit={exercise.weightUnit}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-2">
              <WeightInput
                exerciseId={exercise.id}
                partIndex={0}
                step={exercise.weightStep}
                unit={exercise.weightUnit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 pt-3 pb-6 space-y-3">
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
                  "flex-1 flex flex-col items-center justify-center rounded-xl py-3 gap-0.5 transition-colors select-none",
                  setDone
                    ? "text-white"
                    : "bg-secondary text-muted-foreground active:bg-accent"
                )}
                style={
                  setDone
                    ? { backgroundColor: meta.accentColor + "33", color: meta.accentColor }
                    : undefined
                }
              >
                {setDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <span className="text-[11px] font-semibold">{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Navegação prev / next */}
        <div className="flex gap-2">
          {prevEx ? (
            <Link
              href={`/workout/${type}/exercise/${prevEx.id}`}
              className="flex-1 flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2.5 text-sm text-muted-foreground active:bg-accent overflow-hidden"
            >
              <ChevronLeft size={15} className="shrink-0" />
              <span className="truncate">{prevEx.name}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextEx ? (
            <Link
              href={`/workout/${type}/exercise/${nextEx.id}`}
              className="flex-1 flex items-center justify-end gap-1.5 rounded-xl bg-secondary px-3 py-2.5 text-sm text-muted-foreground active:bg-accent overflow-hidden"
            >
              <span className="truncate text-right">{nextEx.name}</span>
              <ChevronRight size={15} className="shrink-0" />
            </Link>
          ) : (
            <button
              onPointerDown={(e) => e.preventDefault()}
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white active:opacity-80"
              style={{ backgroundColor: meta.accentColor }}
            >
              Concluir treino
            </button>
          )}
        </div>
      </div>

      <RestTimer />
    </div>
  );
}
