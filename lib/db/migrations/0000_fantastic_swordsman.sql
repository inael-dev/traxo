CREATE TABLE "exercises" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"muscle_group" varchar(100) NOT NULL,
	"workout_type" varchar(1) NOT NULL,
	"sets" integer NOT NULL,
	"reps_scheme" jsonb NOT NULL,
	"rest_seconds" integer NOT NULL,
	"weight_step" numeric(5, 2) DEFAULT '2.5',
	"weight_unit" varchar(20) DEFAULT 'placa',
	"gif_url" varchar(500)
);
