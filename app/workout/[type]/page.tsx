import { notFound } from "next/navigation";
import { WORKOUT_META } from "@/lib/data/types";
import { getExercisesByWorkout } from "@/lib/data/exercises";
import { WorkoutSession } from "@/components/workout/workout-session";
import type { WorkoutType } from "@/lib/data/types";

type Props = { params: Promise<{ type: string }> };

export default async function WorkoutPage({ params }: Props) {
  const { type } = await params;
  const meta = WORKOUT_META[type as WorkoutType];
  if (!meta) notFound();

  const exercises = getExercisesByWorkout(type as WorkoutType);

  return (
    <WorkoutSession
      type={type as WorkoutType}
      exercises={exercises}
      muscleGroups={meta.muscleGroups}
    />
  );
}

export function generateStaticParams() {
  return [{ type: "A" }, { type: "B" }, { type: "C" }];
}
