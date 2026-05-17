import type { RepsScheme } from "@/lib/data/types";

type Props = {
  repsScheme: RepsScheme[];
  sets: number;
};

export function BisetScheme({ repsScheme, sets }: Props) {
  if (repsScheme.length === 1) {
    return (
      <span className="text-muted-foreground text-xs">
        {sets}×{repsScheme[0].reps} reps
      </span>
    );
  }

  return (
    <div className="flex items-start gap-2">
      {/* Conector visual: linha + seta em âmbar */}
      <div className="flex flex-col items-center mt-0.5 shrink-0">
        <div className="w-px h-3 bg-amber-500/70" />
        <div className="w-px flex-1 bg-amber-500/70" />
        <div
          className="border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-amber-500/70"
          style={{ width: 0, height: 0 }}
        />
      </div>

      {/* Reps de cada parte */}
      <div className="flex flex-col gap-0.5">
        {repsScheme.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className={
                i === 0
                  ? "text-xs text-foreground/80"
                  : "text-xs text-amber-400 font-medium"
              }
            >
              {r.reps} reps
            </span>
            {r.note && (
              <span className="text-[10px] text-amber-500/80 italic">
                {r.note}
              </span>
            )}
          </div>
        ))}
        <span className="text-[10px] text-muted-foreground">{sets} séries</span>
      </div>
    </div>
  );
}

/* Inline compact — para o header do card */
export function BisetLabel({ repsScheme, sets }: Props) {
  if (repsScheme.length === 1) {
    return (
      <span className="text-muted-foreground text-xs">
        {sets}×{repsScheme[0].reps}
      </span>
    );
  }
  return (
    <span className="text-amber-400 text-xs font-semibold">
      {sets}×{repsScheme.map((r) => r.reps).join("→")} ⚡
    </span>
  );
}
