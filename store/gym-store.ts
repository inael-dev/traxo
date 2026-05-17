import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WorkoutType } from "@/lib/data/types";

type CompletedSet = {
  exerciseId: string;
  setIndex: number;
  timestamp: number;
};

type GymState = {
  // Persisted across sessions
  weights: Record<string, number[]>; // exerciseId -> [kg per biset part]

  // Current session (reset on new workout)
  activeWorkout: WorkoutType | null;
  completedSets: CompletedSet[];
  sessionId: string | null;

  // Rest timer
  timer: { exerciseName: string; seconds: number } | null;

  // Actions
  startWorkout: (type: WorkoutType) => void;
  setSessionId: (id: string) => void;
  initWeights: (weights: Record<string, number[]>) => void;
  toggleSet: (exerciseId: string, setIndex: number, exerciseName: string, restSeconds: number) => void;
  isCompleted: (exerciseId: string, setIndex: number) => boolean;
  completedCountForExercise: (exerciseId: string) => number;
  totalCompletedInSession: () => number;
  setWeight: (exerciseId: string, partIndex: number, kg: number) => void;
  getWeights: (exerciseId: string, partsCount: number) => number[];
  dismissTimer: () => void;
};

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      weights: {},
      activeWorkout: null,
      completedSets: [],
      sessionId: null,
      timer: null,

      startWorkout: (type) =>
        set({ activeWorkout: type, completedSets: [], timer: null, sessionId: null }),

      setSessionId: (id) => set({ sessionId: id }),

      initWeights: (weights) =>
        set((s) => ({ weights: { ...weights, ...s.weights } })),

      toggleSet: (exerciseId, setIndex, exerciseName, restSeconds) => {
        const already = get().isCompleted(exerciseId, setIndex);
        if (already) {
          set((s) => ({
            completedSets: s.completedSets.filter(
              (c) => !(c.exerciseId === exerciseId && c.setIndex === setIndex)
            ),
            timer: null,
          }));
        } else {
          set((s) => ({
            completedSets: [
              ...s.completedSets,
              { exerciseId, setIndex, timestamp: Date.now() },
            ],
            timer: { exerciseName, seconds: restSeconds },
          }));
        }
      },

      isCompleted: (exerciseId, setIndex) =>
        get().completedSets.some(
          (c) => c.exerciseId === exerciseId && c.setIndex === setIndex
        ),

      completedCountForExercise: (exerciseId) =>
        get().completedSets.filter((c) => c.exerciseId === exerciseId).length,

      totalCompletedInSession: () => get().completedSets.length,

      setWeight: (exerciseId, partIndex, kg) =>
        set((s) => {
          const current = s.weights[exerciseId] ?? [];
          const next = [...current];
          next[partIndex] = kg;
          return { weights: { ...s.weights, [exerciseId]: next } };
        }),

      getWeights: (exerciseId, partsCount) => {
        const saved = get().weights[exerciseId] ?? [];
        return Array.from({ length: partsCount }, (_, i) => saved[i] ?? 0);
      },

      dismissTimer: () => set({ timer: null }),
    }),
    {
      name: "gym-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ weights: s.weights }),
    }
  )
);
