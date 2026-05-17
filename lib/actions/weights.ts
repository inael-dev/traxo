"use server";
import { db } from "@/lib/db/client";
import { userExerciseWeights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const USER_ID = process.env.INAEL_USER_ID!;

export async function saveWeight(
  exerciseId: string,
  partIndex: number,
  weight: number,
): Promise<void> {
  await db
    .insert(userExerciseWeights)
    .values({ userId: USER_ID, exerciseId, partIndex, weight: String(weight) })
    .onConflictDoUpdate({
      target: [
        userExerciseWeights.userId,
        userExerciseWeights.exerciseId,
        userExerciseWeights.partIndex,
      ],
      set: { weight: String(weight), updatedAt: new Date() },
    });
}

export async function getUserWeights(): Promise<Record<string, number[]>> {
  const rows = await db
    .select({
      exerciseId: userExerciseWeights.exerciseId,
      partIndex:  userExerciseWeights.partIndex,
      weight:     userExerciseWeights.weight,
    })
    .from(userExerciseWeights)
    .where(eq(userExerciseWeights.userId, USER_ID));

  const result: Record<string, number[]> = {};
  for (const row of rows) {
    if (!result[row.exerciseId]) result[row.exerciseId] = [];
    result[row.exerciseId][row.partIndex] = Number(row.weight);
  }
  return result;
}
