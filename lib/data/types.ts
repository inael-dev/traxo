export type WorkoutType = "A" | "B" | "C";

export type RepsScheme = {
  reps: number;
  note?: string; // "aumentar carga", "+10", etc.
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  workoutType: WorkoutType;
  sets: number;
  repsScheme: RepsScheme[]; // 1 item = normal, 2+ items = biset/drop
  restSeconds: number;
  defaultWeight?: number;
  weightStep?: number;  // incremento em kg, default 2.5
  weightUnit?: string;  // sufixo exibido: "placa" | "total" | "kg/l" | "kg", default "placa"
  gifUrl?: string;      // GIF de execução (ExerciseDB CDN, substituir pela API própria futuramente)
};

export type WorkoutMeta = {
  type: WorkoutType;
  label: string;
  muscleGroups: string[];
  accentColor: string;
};

// Maps day of week (0=Sun) to workout type, null = rest
export const WEEKLY_SCHEDULE: Record<number, WorkoutType | null> = {
  0: null,   // Dom
  1: "A",    // Seg
  2: "C",    // Ter
  3: "B",    // Qua
  4: "C",    // Qui
  5: "A",    // Sex
  6: null,   // Sáb
};

export const WORKOUT_META: Record<WorkoutType, WorkoutMeta> = {
  A: {
    type: "A",
    label: "Treino A",
    muscleGroups: ["Costas", "Bíceps"],
    accentColor: "#C97070",
  },
  B: {
    type: "B",
    label: "Treino B",
    muscleGroups: ["Peitoral", "Tríceps", "Ombro"],
    accentColor: "#E8A060",
  },
  C: {
    type: "C",
    label: "Treino C",
    muscleGroups: ["Quadríceps", "Posterior"],
    accentColor: "#9080C8",
  },
};
