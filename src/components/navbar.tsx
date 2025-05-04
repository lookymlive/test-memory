"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    href: "/",
    label: "Inicio",
    active: (pathname: string) => pathname === "/",
  },
  {
    href: "/disciplines",
    label: "Disciplinas",
    active: (pathname: string) => pathname.startsWith("/disciplines"),
  },
  {
    href: "/records",
    label: "Récords",
    active: (pathname: string) => pathname.startsWith("/records"),
  },
  {
    href: "/about",
    label: "Acerca de",
    active: (pathname: string) => pathname.startsWith("/about"),
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Speed Memory
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active(pathname)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild className="hidden sm:flex">
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
