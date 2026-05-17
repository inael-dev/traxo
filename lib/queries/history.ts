import { db } from "@/lib/db/client";
import { workoutSessions, sessionSets } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

const USER_ID = process.env.INAEL_USER_ID!;

export async function getSessionHistory() {
  const rows = await db
    .select({
      id:              workoutSessions.id,
      workoutType:     workoutSessions.workoutType,
      startedAt:       workoutSessions.startedAt,
      completedAt:     workoutSessions.completedAt,
      durationSeconds: workoutSessions.durationSeconds,
      totalSets:       count(sessionSets.id),
    })
    .from(workoutSessions)
    .leftJoin(sessionSets, eq(sessionSets.sessionId, workoutSessions.id))
    .where(eq(workoutSessions.userId, USER_ID))
    .groupBy(workoutSessions.id)
    .orderBy(desc(workoutSessions.startedAt))
    .limit(50);

  return rows;
}

export type SessionHistoryRow = Awaited<ReturnType<typeof getSessionHistory>>[number];
