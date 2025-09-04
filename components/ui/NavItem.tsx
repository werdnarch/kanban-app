import Link from "next/link";
import React, { useEffect, useState } from "react";
import BoardIcon from "../icons/BoardIcon";
import { usePathname } from "next/navigation";

interface NavItemProps {
  name: string;
  link: string;
  index: number;
}

export default function NavItem({ name, link, index }: NavItemProps) {
  const [active, setActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.includes(link)) {
      setActive(true);
    } else if (pathname === "/" && index === 1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [pathname, link, index]);

  return (
    <li
      className={`font-bold w-[90%] max-w-[300px] rounded-r-full  ${
        active ? "bg-[#635fc7] text-white" : "navItem text-grey"
      }  cursor-pointer`}
    >
      <Link
        href={`/boards/${link}`}
        className="flex items-center gap-2 w-full p-4 md:px-8  "
      >
        <BoardIcon />
        <p className="whitespace-nowrap">{name}</p>
      </Link>
    </li>
  );
}
