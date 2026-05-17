import { BottomNav } from "@/components/bottom-nav";
import { getSessionHistory } from "@/lib/queries/history";
import { WORKOUT_META } from "@/lib/data/types";
import type { WorkoutType } from "@/lib/data/types";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  }).format(d);
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export default async function HistoryPage() {
  const sessions = await getSessionHistory();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Últimos 50 treinos
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Nenhum treino registrado ainda.</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {sessions.map((session) => {
            const meta = WORKOUT_META[session.workoutType as WorkoutType];
            const duration = formatDuration(session.durationSeconds);
            const completed = !!session.completedAt;
            return (
              <div
                key={session.id}
                className="rounded-[16px] border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: type badge + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-lg"
                      style={{ backgroundColor: meta?.accentColor ?? "#666" }}
                    >
                      {session.workoutType}
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">
                        {meta?.label ?? session.workoutType}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(session.startedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: status */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={
                        completed
                          ? { backgroundColor: meta?.accentColor + "22", color: meta?.accentColor }
                          : { backgroundColor: "#ffffff10", color: "#ffffff40" }
                      }
                    >
                      {completed ? "Concluído" : "Incompleto"}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-4 mt-3 pl-[52px]">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Séries</p>
                    <p className="text-sm font-bold tabular-nums">{session.totalSets}</p>
                  </div>
                  {duration && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Duração</p>
                      <p className="text-sm font-bold tabular-nums">{duration}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
