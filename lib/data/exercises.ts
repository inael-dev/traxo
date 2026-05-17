import type { Exercise } from "./types";

const GIF = (id: string) => `https://static.exercisedb.dev/media/${id}.gif`;

export const exercises: Exercise[] = [
  // ─── TREINO A — COSTAS ───────────────────────────────────────────────────
  {
    id: "a-costas-1",
    name: "Puxador Frente Pronado",
    muscleGroup: "Costas",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    gifUrl: GIF("eYnzaCm"),
  },
  {
    id: "a-costas-2",
    name: "Puxador Frente Supinado",
    muscleGroup: "Costas",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    gifUrl: GIF("xBYcQHj"),
  },
  {
    id: "a-costas-3",
    name: "Remada Curvada",
    muscleGroup: "Costas",
    workoutType: "A",
    sets: 3,
    repsScheme: [{ reps: 15 }, { reps: 15, note: "manter carga" }],
    restSeconds: 60,
    weightUnit: "total",
    gifUrl: GIF("eZyBC3j"),
  },
  {
    id: "a-costas-4",
    name: "Extensão de Ombro",
    muscleGroup: "Costas",
    workoutType: "A",
    sets: 3,
    repsScheme: [{ reps: 15 }],
    restSeconds: 60,
    gifUrl: GIF("x69MAlq"),
  },
  {
    id: "a-costas-5",
    name: "Peck Deck Inverso",
    muscleGroup: "Costas",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 15 }],
    restSeconds: 60,
    gifUrl: GIF("myfUsKf"),
  },

  // ─── TREINO A — BÍCEPS ───────────────────────────────────────────────────
  {
    id: "a-biceps-1",
    name: "Rosca Direta Barra",
    muscleGroup: "Bíceps",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 12 }],
    restSeconds: 60,
    weightUnit: "total",
    gifUrl: GIF("25GPyDY"),
  },
  {
    id: "a-biceps-2",
    name: "Rosca Martelo",
    muscleGroup: "Bíceps",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 12 }],
    restSeconds: 60,
    weightStep: 2,
    weightUnit: "kg/l",
    gifUrl: GIF("slDvUAU"),
  },
  {
    id: "a-biceps-3",
    name: "Rosca Inversa",
    muscleGroup: "Bíceps",
    workoutType: "A",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    weightUnit: "total",
    gifUrl: GIF("xNrS20v"),
  },

  // ─── TREINO B — PEITORAL ─────────────────────────────────────────────────
  {
    id: "b-peitoral-1",
    name: "Supino Inclinado 45° Articulado",
    muscleGroup: "Peitoral",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 90,
    gifUrl: GIF("jHAnWmT"),
  },
  {
    id: "b-peitoral-2",
    name: "Crucifixo",
    muscleGroup: "Peitoral",
    workoutType: "B",
    sets: 3,
    repsScheme: [{ reps: 15 }],
    restSeconds: 60,
    weightStep: 2,
    weightUnit: "kg/l",
    gifUrl: GIF("yz9nUhF"),
  },
  {
    id: "b-peitoral-3",
    name: "Peck Deck",
    muscleGroup: "Peitoral",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 12 }, { reps: 10, note: "drop set" }],
    restSeconds: 60,
    gifUrl: GIF("v3xmPAR"),
  },

  // ─── TREINO B — TRÍCEPS ──────────────────────────────────────────────────
  {
    id: "b-triceps-1",
    name: "Tríceps Puxador",
    muscleGroup: "Tríceps",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    gifUrl: GIF("gAwDzB3"),
  },
  {
    id: "b-triceps-2",
    name: "Tríceps Francês Bilateral",
    muscleGroup: "Tríceps",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    weightUnit: "total",
    gifUrl: GIF("h8LFzo9"),
  },
  {
    id: "b-triceps-3",
    name: "Tríceps Corda",
    muscleGroup: "Tríceps",
    workoutType: "B",
    sets: 3,
    repsScheme: [{ reps: 15 }],
    restSeconds: 60,
    gifUrl: GIF("dU605di"),
  },

  // ─── TREINO B — OMBRO ────────────────────────────────────────────────────
  {
    id: "b-ombro-1",
    name: "Abdução de Ombro",
    muscleGroup: "Ombro",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 12 }],
    restSeconds: 60,
    weightStep: 2,
    weightUnit: "kg/l",
    gifUrl: GIF("DsgkuIt"),
  },
  {
    id: "b-ombro-2",
    name: "Desenvolvimento Máquina",
    muscleGroup: "Ombro",
    workoutType: "B",
    sets: 4,
    repsScheme: [{ reps: 10 }],
    restSeconds: 60,
    gifUrl: GIF("67n3r98"),
  },

  // ─── TREINO C — QUADRÍCEPS ───────────────────────────────────────────────
  {
    id: "c-quad-1",
    name: "Leg Press 45°",
    muscleGroup: "Quadríceps",
    workoutType: "C",
    sets: 4,
    repsScheme: [{ reps: 12 }],
    restSeconds: 90,
    weightStep: 5,
    gifUrl: GIF("10Z2DXU"),
  },
  {
    id: "c-quad-2",
    name: "Leg Horizontal + Agachamento",
    muscleGroup: "Quadríceps",
    workoutType: "C",
    sets: 4,
    repsScheme: [{ reps: 15 }, { reps: 15, note: "agachamento" }],
    restSeconds: 90,
    weightStep: 5,
    gifUrl: GIF("V07qpXy"),
  },
  {
    id: "c-quad-3",
    name: "Cadeira Extensora",
    muscleGroup: "Quadríceps",
    workoutType: "C",
    sets: 3,
    repsScheme: [{ reps: 12 }, { reps: 8, note: "aumentar carga" }],
    restSeconds: 60,
    gifUrl: GIF("my33uHU"),
  },
  {
    id: "c-quad-4",
    name: "Panturrilha Sentada",
    muscleGroup: "Quadríceps",
    workoutType: "C",
    sets: 4,
    repsScheme: [{ reps: 15 }],
    restSeconds: 45,
    gifUrl: GIF("ykUOVze"),
  },

  // ─── TREINO C — POSTERIOR ────────────────────────────────────────────────
  {
    id: "c-post-1",
    name: "Mesa Flexora",
    muscleGroup: "Posterior",
    workoutType: "C",
    sets: 3,
    repsScheme: [{ reps: 12 }],
    restSeconds: 60,
    gifUrl: GIF("17lJ1kr"),
  },
  {
    id: "c-post-2",
    name: "Flexora Vertical",
    muscleGroup: "Posterior",
    workoutType: "C",
    sets: 4,
    repsScheme: [{ reps: 12 }],
    restSeconds: 60,
    gifUrl: GIF("Zg3XY7P"),
  },
  {
    id: "c-post-3",
    name: "Abdução Máquina",
    muscleGroup: "Posterior",
    workoutType: "C",
    sets: 4,
    repsScheme: [{ reps: 15 }, { reps: 10, note: "drop set" }],
    restSeconds: 60,
    gifUrl: GIF("CHpahtl"),
  },
];

export function getExercisesByWorkout(type: "A" | "B" | "C"): Exercise[] {
  return exercises.filter((e) => e.workoutType === type);
}

export function getExercisesByGroup(
  type: "A" | "B" | "C",
  group: string
): Exercise[] {
  return exercises.filter(
    (e) => e.workoutType === type && e.muscleGroup === group
  );
}

export function countByWorkout(type: "A" | "B" | "C"): number {
  return exercises.filter((e) => e.workoutType === type).length;
}
