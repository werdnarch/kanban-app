ALTER TABLE "boards" DROP CONSTRAINT "boards_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "columns" DROP CONSTRAINT "columns_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "subtasks" DROP CONSTRAINT "subtasks_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_column_id_columns_id_fk";
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "columns" ADD CONSTRAINT "columns_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_column_id_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."columns"("id") ON DELETE cascade ON UPDATE no action;