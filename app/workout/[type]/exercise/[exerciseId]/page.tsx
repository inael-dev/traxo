import { notFound } from "next/navigation";
import { WORKOUT_META } from "@/lib/data/types";
import { exercises, getExercisesByWorkout } from "@/lib/data/exercises";
import { ExerciseDetailPage } from "@/components/workout/exercise-detail-page";
import type { WorkoutType } from "@/lib/data/types";

type Props = { params: Promise<{ type: string; exerciseId: string }> };

export default async function ExerciseDetailRoute({ params }: Props) {
  const { type, exerciseId } = await params;
  const meta = WORKOUT_META[type as WorkoutType];
  if (!meta) notFound();

  const list = getExercisesByWorkout(type as WorkoutType);
  const index = list.findIndex((e) => e.id === exerciseId);
  if (index === -1) notFound();

  return (
    <ExerciseDetailPage
      type={type as WorkoutType}
      exercises={list}
      currentIndex={index}
    />
  );
}

export function generateStaticParams() {
  return exercises.map((e) => ({ type: e.workoutType, exerciseId: e.id }));
}
