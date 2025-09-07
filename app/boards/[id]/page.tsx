"use client";

import React from "react";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { useQuery } from "@tanstack/react-query";
import { getBoardByName } from "./actions";
import Loading from "@/components/Loading";
import { BoardType } from "@/types";
import Columns from "@/components/ui/Columns";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data, isPending, error } = useQuery({
    queryKey: ["get-board", id],
    queryFn: () => getBoardByName(id),
  });

  if (error) return "Error occured while fetching, " + error;

  const board = data?.success ? data.board : undefined;

  const defaultBoard: BoardType = {
    id: "",
    name: "",
    user_id: "",
    slug: "",
    createdAt: "",
    updatedAt: "",
    columns: [],
  };

  return (
    <main className="h-full w-full flex flex-col">
      <Header board={board ?? defaultBoard} />
      <section className="w-full flex-1 flex items-center">
        <SideBar />
        <div className="flex-1 h-full flex gap-6 md:gap-8 p-4">
          {isPending ? (
            <Loading />
          ) : (
            board?.columns.map((column, index: number) => (
              <Columns
                key={`column-${index}`}
                name={column.name}
                tasks={column.tasks}
                columns={board.columns}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
