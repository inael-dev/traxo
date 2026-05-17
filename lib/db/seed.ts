import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  exercises as exercisesTable,
  users,
  workoutConfigs,
  weeklySchedule,
  userWorkoutExercises,
} from "./schema";
import { exercises } from "../data/exercises";
import { WORKOUT_META, WEEKLY_SCHEDULE } from "../data/types";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("── Limpando tabelas...");
  await db.delete(userWorkoutExercises);
  await db.delete(weeklySchedule);
  await db.delete(workoutConfigs);
  await db.delete(users);
  await db.delete(exercisesTable);

  // ── 1. Exercícios (biblioteca global) ──────────────────────────────────────
  console.log("── Inserindo exercícios...");
  await db.insert(exercisesTable).values(
    exercises.map((e) => ({
      id:          e.id,
      name:        e.name,
      muscleGroup: e.muscleGroup,
      workoutType: e.workoutType,
      sets:        e.sets,
      repsScheme:  e.repsScheme,
      restSeconds: e.restSeconds,
      weightStep:  String(e.weightStep ?? 2.5),
      weightUnit:  e.weightUnit ?? "placa",
      gifUrl:      e.gifUrl ?? null,
    }))
  );
  console.log(`   ✓ ${exercises.length} exercícios`);

  // ── 2. Usuário Inael ───────────────────────────────────────────────────────
  console.log("── Criando usuário Inael...");
  const [inael] = await db
    .insert(users)
    .values({ name: "Inael", email: "inael@zarc.tech" })
    .returning();
  console.log(`   ✓ id: ${inael.id}`);

  // ── 3. Workout configs (A, B, C) ───────────────────────────────────────────
  console.log("── Inserindo workout configs...");
  await db.insert(workoutConfigs).values(
    (["A", "B", "C"] as const).map((type) => ({
      userId:      inael.id,
      workoutType: type,
      label:       WORKOUT_META[type].label,
      accentColor: WORKOUT_META[type].accentColor,
    }))
  );
  console.log("   ✓ A, B, C");

  // ── 4. Grade semanal ───────────────────────────────────────────────────────
  console.log("── Inserindo grade semanal...");
  await db.insert(weeklySchedule).values(
    Object.entries(WEEKLY_SCHEDULE).map(([day, type]) => ({
      userId:      inael.id,
      dayOfWeek:   Number(day),
      workoutType: type ?? null,
    }))
  );
  console.log("   ✓ Seg=A · Ter=C · Qua=B · Qui=C · Sex=A · Sáb/Dom=descanso");

  // ── 5. Exercícios do usuário por treino ────────────────────────────────────
  console.log("── Mapeando exercícios do usuário...");
  const byType = { A: 0, B: 0, C: 0 } as Record<string, number>;

  await db.insert(userWorkoutExercises).values(
    exercises.map((e) => {
      const idx = byType[e.workoutType]++;
      return {
        userId:      inael.id,
        workoutType: e.workoutType,
        exerciseId:  e.id,
        orderIndex:  idx,
        // sem overrides — usa os defaults da biblioteca
      };
    })
  );
  console.log(`   ✓ ${exercises.length} mapeamentos`);

  console.log("\n✅ Seed concluído!");
  console.log(`   USER ID: ${inael.id}`);
}

seed().catch((e) => { console.error(e); process.exit(1); });
