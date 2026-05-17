"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, History } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/history", icon: History, label: "Histórico" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-card border-t border-border h-16 px-4 safe-area-pb">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 text-xs transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon
              size={22}
              className={cn(active && "drop-shadow-[0_0_6px_var(--color-primary)]")}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
