CREATE TABLE "session_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"exercise_id" varchar NOT NULL,
	"set_index" integer NOT NULL,
	"weight" numeric(6, 2) DEFAULT '0' NOT NULL,
	"reps_completed" integer,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_exercise_weights" (
	"user_id" uuid NOT NULL,
	"exercise_id" varchar NOT NULL,
	"part_index" integer DEFAULT 0 NOT NULL,
	"weight" numeric(6, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_exercise_weights_user_id_exercise_id_part_index_pk" PRIMARY KEY("user_id","exercise_id","part_index")
);
--> statement-breakpoint
CREATE TABLE "user_workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_type" varchar(1) NOT NULL,
	"exercise_id" varchar NOT NULL,
	"order_index" integer NOT NULL,
	"custom_sets" integer,
	"custom_reps_scheme" jsonb,
	"custom_rest_seconds" integer,
	"custom_weight_step" numeric(5, 2),
	"custom_weight_unit" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weekly_schedule" (
	"user_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"workout_type" varchar(1),
	CONSTRAINT "weekly_schedule_user_id_day_of_week_pk" PRIMARY KEY("user_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE "workout_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_type" varchar(1) NOT NULL,
	"label" varchar(100) NOT NULL,
	"accent_color" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_type" varchar(1) NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration_seconds" integer
);
--> statement-breakpoint
ALTER TABLE "session_sets" ADD CONSTRAINT "session_sets_session_id_workout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_sets" ADD CONSTRAINT "session_sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_exercise_weights" ADD CONSTRAINT "user_exercise_weights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_exercise_weights" ADD CONSTRAINT "user_exercise_weights_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workout_exercises" ADD CONSTRAINT "user_workout_exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workout_exercises" ADD CONSTRAINT "user_workout_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_schedule" ADD CONSTRAINT "weekly_schedule_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_configs" ADD CONSTRAINT "workout_configs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;