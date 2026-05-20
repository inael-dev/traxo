"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ExerciseCard } from "./exercise-card";
import { RestTimer } from "./rest-timer";
import { useGymStore } from "@/store/gym-store";
import type { Exercise, WorkoutType } from "@/lib/data/types";
import { WORKOUT_META } from "@/lib/data/types";
import { createSession, completeSession } from "@/lib/actions/sessions";
import { getUserWeights } from "@/lib/actions/weights";

type Props = {
  type: WorkoutType;
  exercises: Exercise[];
  muscleGroups: string[];
};


export function WorkoutSession({ type, exercises, muscleGroups }: Props) {
  const router = useRouter();
  const startWorkout = useGymStore((s) => s.startWorkout);
  const setSessionId = useGymStore((s) => s.setSessionId);
  const initWeights = useGymStore((s) => s.initWeights);
  const sessionId = useGymStore((s) => s.sessionId);
  const activeWorkout = useGymStore((s) => s.activeWorkout);
  const completedSets = useGymStore((s) => s.completedSets.length);

  const meta = WORKOUT_META[type];

  useEffect(() => {
    getUserWeights().then(initWeights);
    if (activeWorkout === type) return;
    startWorkout(type);
    createSession(type).then(setSessionId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const groups = muscleGroups.map((group) => ({
    group,
    exercises: exercises.filter((e) => e.muscleGroup === group),
  }));

  async function handleFinish() {
    if (sessionId) await completeSession(sessionId);
    router.push("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8 px-5">
        <Image
          src={meta.imageUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.3)" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

        <div className="relative flex items-center justify-between mb-6">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25"
          >
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <span className="text-white/70 text-sm font-medium tabular-nums">
            {completedSets}/{totalSets} séries
          </span>
        </div>

        <div className="relative">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: meta.accentColor }}
          >
            {meta.label}
          </span>
          <h1 className="text-3xl font-black text-white leading-tight mt-0.5">
            {meta.muscleGroups.join(" & ")}
          </h1>
        </div>
      </div>

      {/* Progress bar sticky */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-5 py-3 border-b border-border">
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Lista de exercícios */}
      <div className="flex-1 px-4 py-5 space-y-7 pb-6">
        {groups.map(({ group, exercises: groupExercises }) => (
          <section key={group}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-3 w-[3px] rounded-full"
                style={{ backgroundColor: meta.accentColor }}
              />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {group}
              </h2>
            </div>
            <div className="space-y-3">
              {groupExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} accentColor={meta.accentColor} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Finalizar treino */}
      <div className="px-4 pb-8 pt-2">
        <button
          onPointerDown={(e) => e.preventDefault()}
          onClick={handleFinish}
          className="w-full rounded-2xl py-4 text-sm font-bold text-white active:opacity-80 transition-opacity"
          style={{ backgroundColor: meta.accentColor }}
        >
          Finalizar Treino
        </button>
      </div>

      <RestTimer />
    </div>
  );
}
