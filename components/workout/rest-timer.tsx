"use client";
import { useEffect, useState } from "react";
import { X, Timer } from "lucide-react";
import { useGymStore } from "@/store/gym-store";

export function RestTimer() {
  const timer = useGymStore((s) => s.timer);
  const dismiss = useGymStore((s) => s.dismissTimer);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!timer) return;
    setRemaining(timer.seconds);
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          dismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timer, dismiss]);

  if (!timer) return null;

  const total = timer.seconds;
  const pct = remaining / total;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm pb-8">
      <div className="bg-card border border-border rounded-3xl p-6 w-80 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-stretch">
          <Timer size={16} className="text-primary" />
          <p className="text-sm text-muted-foreground flex-1 truncate">
            {timer.exerciseName}
          </p>
          <button
            onPointerDown={dismiss}
            className="text-muted-foreground active:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ring */}
        <div className="relative flex items-center justify-center">
          <svg width={104} height={104} className="-rotate-90">
            <circle
              cx={52}
              cy={52}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              className="text-secondary"
            />
            <circle
              cx={52}
              cy={52}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-3xl font-bold tabular-nums">
            {mins}:{secs}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">Descansando...</p>

        <button
          onPointerDown={dismiss}
          className="w-full rounded-xl bg-secondary text-secondary-foreground py-3 text-sm font-medium active:bg-accent"
        >
          Pular descanso
        </button>
      </div>
    </div>
  );
}
