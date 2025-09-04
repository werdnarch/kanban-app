ALTER TABLE "boards" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_slug_unique" UNIQUE("slug");