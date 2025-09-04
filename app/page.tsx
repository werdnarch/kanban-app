import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import React from "react";
import { BoardType } from "@/types";

export default function Page() {
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
      <Header board={defaultBoard} />
      <section className="w-full flex-1 flex items-center">
        <SideBar />
        <div className="flex-1 h-full">
          <p>test</p>
        </div>
      </section>
    </main>
  );
}
