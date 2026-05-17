"use client";
import { useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { useGymStore } from "@/store/gym-store";
import { saveWeight } from "@/lib/actions/weights";

type Props = {
  exerciseId: string;
  partIndex: number;
  partsCount?: number;
  step?: number;
  unit?: string;
};

export function WeightInput({ exerciseId, partIndex, step = 2.5, unit = "placa" }: Props) {
  const kg = useGymStore((s) => s.weights[exerciseId]?.[partIndex] ?? 0);
  const setWeight = useGymStore((s) => s.setWeight);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function change(next: number) {
    setWeight(exerciseId, partIndex, next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveWeight(exerciseId, partIndex, next);
    }, 600);
  }

  const dec = () => change(Math.max(0, +(kg - step).toFixed(2)));
  const inc = () => change(+(kg + step).toFixed(2));

  return (
    <div className="flex items-center gap-1">
      <button
        onPointerDown={(e) => { e.preventDefault(); dec(); }}
        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center active:bg-accent"
      >
        <Minus size={12} />
      </button>
      <span className="text-sm font-semibold w-16 text-center tabular-nums">
        {kg === 0 ? `— ${unit}` : `${kg} ${unit}`}
      </span>
      <button
        onPointerDown={(e) => { e.preventDefault(); inc(); }}
        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center active:bg-accent"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
