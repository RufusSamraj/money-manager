CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"initial_balance" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(10) NOT NULL,
	"amount" numeric NOT NULL,
	"category" text NOT NULL,
	"account" text NOT NULL,
	"to_account" text,
	"note" text,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now()
);
