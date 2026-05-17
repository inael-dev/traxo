import Link from "next/link";
import { Dumbbell, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { getTodayWorkout, formatTodayDate } from "@/lib/workout-utils";
import { countByWorkout } from "@/lib/data/exercises";
import { WORKOUT_META } from "@/lib/data/types";
import type { WorkoutType } from "@/lib/data/types";

const ALL_WORKOUTS: WorkoutType[] = ["A", "B", "C"];

export default function HomePage() {
  const todayWorkout = getTodayWorkout();
  const dateStr = formatTodayDate();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="px-5 pt-12 pb-4">
        <p className="text-muted-foreground text-sm">{dateStr}</p>
        <h1 className="text-2xl font-black mt-0.5">Bom treino, Inael!</h1>
      </header>

      {/* Hoje */}
      <section className="px-5 mt-2">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Hoje
        </h2>

        {todayWorkout ? (
          <TodayCard type={todayWorkout} />
        ) : (
          <div className="rounded-[20px] bg-card border border-border p-6 text-center">
            <p className="font-bold text-foreground">Dia de descanso</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aproveita para recuperar.
            </p>
          </div>
        )}
      </section>

      {/* Treinos */}
      <section className="px-5 mt-8">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Fichas
        </h2>

        <div className="flex flex-col gap-3">
          {ALL_WORKOUTS.map((type) => (
            <WorkoutCard key={type} type={type} isToday={type === todayWorkout} />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

function TodayCard({ type }: { type: WorkoutType }) {
  const meta = WORKOUT_META[type];
  const count = countByWorkout(type);

  return (
    <Link href={`/workout/${type}`}>
      <div className="relative rounded-[20px] overflow-hidden h-52 active:scale-[0.98] transition-transform">
        {/* Foto de fundo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />
        {/* Tint da cor do treino */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: meta.accentColor + "55" }}
        />
        {/* Gradiente inferior para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Conteúdo */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              Treino {type} · hoje
            </span>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ChevronRight size={16} className="text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white leading-tight">
              {meta.muscleGroups.join(" & ")}
            </h3>
            <p className="text-white/70 text-sm mt-1.5 flex items-center gap-1.5">
              <Dumbbell size={12} />
              {count} exercícios
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function WorkoutCard({ type, isToday }: { type: WorkoutType; isToday: boolean }) {
  const meta = WORKOUT_META[type];
  const count = countByWorkout(type);

  return (
    <Link href={`/workout/${type}`}>
      <div
        className="relative rounded-[16px] overflow-hidden h-[88px] flex items-stretch active:scale-[0.98] transition-transform border border-white/5"
      >
        {/* Fundo escuro base */}
        <div className="absolute inset-0 bg-card" />

        {/* Foto à direita com fade */}
        <div className="absolute right-0 top-0 bottom-0 w-40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.5)" }}
          />
          {/* Fade esquerda */}
          <div
            className="absolute inset-y-0 left-0 w-20"
            style={{
              background: `linear-gradient(to right, var(--card, #1a1a1a), transparent)`,
            }}
          />
        </div>

        {/* Barra de cor lateral */}
        <div className="relative w-[3px] shrink-0 z-10" style={{ backgroundColor: meta.accentColor }} />

        {/* Texto */}
        <div className="relative flex items-center px-4 flex-1 min-w-0 z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: meta.accentColor }}
              >
                Treino {type}
              </span>
              {isToday && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: meta.accentColor }}
                >
                  Hoje
                </span>
              )}
            </div>
            <h3 className="font-bold text-[15px] text-foreground leading-snug">
              {meta.muscleGroups.join(" & ")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {count} exercícios
            </p>
          </div>
          <ChevronRight size={15} className="text-muted-foreground shrink-0 ml-3" />
        </div>
      </div>
    </Link>
  );
}
