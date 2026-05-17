"use server";
import { db } from "@/lib/db/client";
import { workoutSessions, sessionSets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const USER_ID = process.env.INAEL_USER_ID!;

export async function createSession(workoutType: string): Promise<string> {
  const [session] = await db
    .insert(workoutSessions)
    .values({ userId: USER_ID, workoutType })
    .returning({ id: workoutSessions.id });
  return session.id;
}

export async function completeSession(sessionId: string): Promise<void> {
  const [session] = await db
    .select({ startedAt: workoutSessions.startedAt })
    .from(workoutSessions)
    .where(eq(workoutSessions.id, sessionId));
  if (!session) return;
  const duration = Math.round((Date.now() - session.startedAt.getTime()) / 1000);
  await db
    .update(workoutSessions)
    .set({ completedAt: new Date(), durationSeconds: duration })
    .where(eq(workoutSessions.id, sessionId));
}

export async function saveSet(
  sessionId: string,
  exerciseId: string,
  setIndex: number,
  weight: number,
  repsCompleted: number,
): Promise<void> {
  // Remove duplicata, depois insere
  await db
    .delete(sessionSets)
    .where(
      and(
        eq(sessionSets.sessionId, sessionId),
        eq(sessionSets.exerciseId, exerciseId),
        eq(sessionSets.setIndex, setIndex),
      )
    );
  await db.insert(sessionSets).values({
    sessionId,
    exerciseId,
    setIndex,
    weight: String(weight),
    repsCompleted,
  });
}

export async function removeSet(
  sessionId: string,
  exerciseId: string,
  setIndex: number,
): Promise<void> {
  await db
    .delete(sessionSets)
    .where(
      and(
        eq(sessionSets.sessionId, sessionId),
        eq(sessionSets.exerciseId, exerciseId),
        eq(sessionSets.setIndex, setIndex),
      )
    );
}
