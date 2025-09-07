"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import React, { useState } from "react";
import { BoardType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getHomePageBoard } from "./actions";
import Loading from "@/components/Loading";
import Columns from "@/components/ui/Columns";

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-home-data"],
    queryFn: getHomePageBoard,
  });

  const defaultBoard: BoardType = {
    id: "",
    name: "",
    user_id: "",
    slug: "",
    createdAt: "",
    updatedAt: "",
    columns: [],
  };

  const board: BoardType = data?.data.board;

  return (
    <main className="h-full w-full flex flex-col">
      <Header board={board ?? defaultBoard} />
      <section className="w-full flex-1 flex items-center">
        <SideBar />
        <div className="flex-1 h-full flex gap-6 md:gap-8 p-4">
          {isPending ? (
            <Loading />
          ) : board ? (
            board?.columns.map((column, index: number) => (
              <Columns
                key={`column-${index}`}
                name={column.name}
                tasks={column.tasks}
                columns={board.columns}
              />
            ))
          ) : (
            <div className="w-full  h-full flex flex-col gap-5 items-center justify-center">
              <p>
                There are no boards available. Create a new board to get started
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
