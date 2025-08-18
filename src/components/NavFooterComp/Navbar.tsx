"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search, User, Bell } from "lucide-react";

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/upcoming-movies", label: "Upcoming" },
    { href: "/streaming", label: "Streaming" },
];

function Logo() {
    return (
        <span className="flex items-baseline font-extrabold">
            <span className="text-2xl md:text-3xl text-cyan-400">Cine</span>
            <span className="text-2xl md:text-3xl text-white">Watch</span>
        </span>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // Close menu on Escape and when resizing to desktop
    useEffect(() => {
        const onKey = (e: KeyboardEvent) =>
            e.key === "Escape" && setOpen(false);
        const onResize = () => window.innerWidth >= 768 && setOpen(false);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 px-6 md:px-19 z-50 bg-[#0B1E36] text-white shadow-md">
            <div className="flex h-16 items-center justify-between">
                {/* Logo (always visible) */}
                <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                >
                    <Logo />
                </Link>

                {/* Desktop nav */}
                <nav className="ml-10 hidden items-center gap-8 md:flex">
                    {LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="font-medium transition-colors hover:text-cyan-400"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop right icons */}
                <div className="hidden items-center gap-6 md:flex">
                    <Search className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400" />
                    <Bell className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400" />
                    <User className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400" />
                </div>

                {/* Mobile toggle — the ONLY hamburger */}
                <button
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center p-2 md:hidden"
                >
                    {open ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile dropdown (no extra header/icons inside) */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ${
                    open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="space-y-3 pb-4 pt-3">
                    {LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block py-1 font-medium transition-colors hover:text-cyan-400"
                        >
                            {l.label}
                        </Link>
                    ))}

                    {/* Optional mobile search action */}
                    <button className="flex items-center gap-2 py-1">
                        <Search className="h-5 w-5" />
                        <span className="font-medium">Search</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
