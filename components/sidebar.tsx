"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { PlusSquare, Newspaper } from "lucide-react";
const montserrate = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Create Recapp",
    icon: PlusSquare,
    href: "/dashboard",
    color: "text-green-200",
  },
  {
    label: "My Recappd",
    icon: Newspaper,
    href: "/dashboard/recappd",
    color: "text-green-200",
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-10 w-10 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1
            className={cn(
              "text-2xl font-bold text-green-400",
              montserrate.className
            )}
          >
            Recappd
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
