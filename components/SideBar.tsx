"use client";
import { Eye, EyeClosed, EyeClosedIcon, EyeOff, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import NavItem from "./ui/NavItem";
import LogOut from "./logout";
import AddBoardModal from "./modals/AddBoardModal";
import { useQuery } from "@tanstack/react-query";
import { getSidebarBoards } from "@/app/actions";
import { BoardType } from "@/types";

export default function SideBar() {
  const [isMini, setIsMini] = useState(false);
  const [active, setActive] = useState(false);
  const [boards, setBoards] = useState<BoardType[]>([]);

  const { data, isPending, error } = useQuery({
    queryKey: ["sidebar-boards"],
    queryFn: getSidebarBoards,
  });

  useEffect(() => {
    if (!data) return;
    setBoards(data.data.boards);
  }, [data]);

  return (
    <aside
      className={`w-[20%] h-full relative ${
        isMini ? "max-w-[0px] w-[0%]" : "max-w-[300px]"
      } containers transition-all duration-300 ease-in-out flex flex-col justify-between gap-6 pb-12`}
    >
      <nav
        className={`text-sm ${
          isMini ? "opacity-0 pointer-events-none" : "opacity-100 delay-300"
        } transition-all duration-200 ease-in-out`}
      >
        <div className="p-4">
          <p className="tracking-[0.2rem] font-bold text-grey whitespace-nowrap">
            ALL BOARDS ({boards?.length})
          </p>
        </div>

        <ul className="flex flex-col w-full">
          {boards?.map((board, index: number) => (
            <NavItem
              key={`sidebar-board-${index}`}
              name={board.name}
              index={index + 1}
              link={board.name.trim().replace(/\s+/g, "-").toLowerCase()}
            />
          ))}
          <li className="font-bold w-[90%] max-w-[300px] rounded-r-full text-grey navItem cursor-pointer">
            <button
              onClick={() => setActive(true)}
              className="flex items-center gap-2 w-full p-4 md:px-8 cursor-pointer"
            >
              <Plus className="size-5" />
              <p className="whitespace-nowrap">Create New Board</p>
            </button>
          </li>
        </ul>
      </nav>
      <div className="w-full flex flex-col gap-4">
        <button
          onClick={() => setIsMini((prev) => !prev)}
          className={`group  min-w-fit max-w-fit text-sm cursor-pointer  ${
            isMini
              ? "w-[20%] bg-[#2b2c37] hover:bg-[#a3a0f8]"
              : "w-[90%] px-8 hover:bg-white hover:text-[#635fc7]"
          } transition-all duration-150 rounded-r-full ease-in-out p-3 flex items-center gap-2`}
        >
          {isMini ? (
            <Eye className="size-4 transition-all  duration-300 ease-in-out" />
          ) : (
            <EyeOff className="size-4 transition-all  duration-300 ease-in-out" />
          )}
          <p
            className={` ${
              isMini
                ? "opacity-0 pointer-events-none w-0 "
                : "opacity-100 w-fit"
            } transition-all whitespace-nowrap duration-300 ease-in-out`}
          >
            Hide Sidebar
          </p>
        </button>

        <div
          className={`mx-auto ${
            isMini ? "opacity-0 pointer-events-none" : "opacity-100"
          } transition-all duration-200 ease-in-out`}
        >
          <LogOut />
        </div>
      </div>

      <AddBoardModal active={active} setActive={setActive} />
    </aside>
  );
}
