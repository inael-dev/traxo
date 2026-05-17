import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  jsonb,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export type RepsSchemeEntry = { reps: number; note?: string };

// ─── Exercise library (global) ────────────────────────────────────────────────

export const exercises = pgTable("exercises", {
  id:          varchar("id").primaryKey(),
  name:        varchar("name", { length: 255 }).notNull(),
  muscleGroup: varchar("muscle_group", { length: 100 }).notNull(),
  workoutType: varchar("workout_type", { length: 1 }).notNull(),
  sets:        integer("sets").notNull(),
  repsScheme:  jsonb("reps_scheme").$type<RepsSchemeEntry[]>().notNull(),
  restSeconds: integer("rest_seconds").notNull(),
  weightStep:  numeric("weight_step", { precision: 5, scale: 2 }).default("2.5"),
  weightUnit:  varchar("weight_unit", { length: 20 }).default("placa"),
  gifUrl:      varchar("gif_url", { length: 500 }),
});

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      varchar("name", { length: 100 }).notNull(),
  email:     varchar("email", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Workout config por usuário (substitui WORKOUT_META hardcoded) ────────────

export const workoutConfigs = pgTable("workout_configs", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutType: varchar("workout_type", { length: 1 }).notNull(), // A | B | C
  label:       varchar("label", { length: 100 }).notNull(),
  accentColor: varchar("accent_color", { length: 20 }).notNull(),
});

// ─── Grade semanal por usuário (substitui WEEKLY_SCHEDULE hardcoded) ──────────

export const weeklySchedule = pgTable("weekly_schedule", {
  userId:      uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dayOfWeek:   integer("day_of_week").notNull(), // 0 = Dom … 6 = Sáb
  workoutType: varchar("workout_type", { length: 1 }), // null = descanso
}, (t) => [
  primaryKey({ columns: [t.userId, t.dayOfWeek] }),
]);

// ─── Exercícios do usuário por treino ─────────────────────────────────────────
// Referencia a biblioteca global e permite overrides individuais

export const userWorkoutExercises = pgTable("user_workout_exercises", {
  id:                uuid("id").primaryKey().defaultRandom(),
  userId:            uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutType:       varchar("workout_type", { length: 1 }).notNull(),
  exerciseId:        varchar("exercise_id").notNull().references(() => exercises.id),
  orderIndex:        integer("order_index").notNull(),
  // Overrides — null = usar o padrão da biblioteca
  customSets:        integer("custom_sets"),
  customRepsScheme:  jsonb("custom_reps_scheme").$type<RepsSchemeEntry[]>(),
  customRestSeconds: integer("custom_rest_seconds"),
  customWeightStep:  numeric("custom_weight_step", { precision: 5, scale: 2 }),
  customWeightUnit:  varchar("custom_weight_unit", { length: 20 }),
});

// ─── Pesos salvos por exercício / parte ───────────────────────────────────────
// Migra o que hoje fica no localStorage (Zustand)

export const userExerciseWeights = pgTable("user_exercise_weights", {
  userId:     uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: varchar("exercise_id").notNull().references(() => exercises.id),
  partIndex:  integer("part_index").notNull().default(0),
  weight:     numeric("weight", { precision: 6, scale: 2 }).notNull().default("0"),
  updatedAt:  timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.exerciseId, t.partIndex] }),
]);

// ─── Sessões de treino (histórico) ────────────────────────────────────────────

export const workoutSessions = pgTable("workout_sessions", {
  id:              uuid("id").primaryKey().defaultRandom(),
  userId:          uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutType:     varchar("workout_type", { length: 1 }).notNull(),
  startedAt:       timestamp("started_at").defaultNow().notNull(),
  completedAt:     timestamp("completed_at"),
  durationSeconds: integer("duration_seconds"),
});

// ─── Séries concluídas em cada sessão ────────────────────────────────────────

export const sessionSets = pgTable("session_sets", {
  id:             uuid("id").primaryKey().defaultRandom(),
  sessionId:      uuid("session_id").notNull().references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId:     varchar("exercise_id").notNull().references(() => exercises.id),
  setIndex:       integer("set_index").notNull(),
  weight:         numeric("weight", { precision: 6, scale: 2 }).notNull().default("0"),
  repsCompleted:  integer("reps_completed"),
  completedAt:    timestamp("completed_at").defaultNow().notNull(),
});

// ─── Types inferidos ──────────────────────────────────────────────────────────

export type Exercise          = typeof exercises.$inferSelect;
export type NewExercise       = typeof exercises.$inferInsert;
export type User              = typeof users.$inferSelect;
export type WorkoutSession    = typeof workoutSessions.$inferSelect;
export type SessionSet        = typeof sessionSets.$inferSelect;
