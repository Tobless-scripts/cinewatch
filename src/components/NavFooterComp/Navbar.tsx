"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchFromTMDB } from "@/lib/tmdb";
import { Movies } from "@/types/Movie";

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
    const [openSearch, setOpenSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Movies[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Auto focus when search opens
    useEffect(() => {
        if (openSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [openSearch]);

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

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.trim().length > 1) {
                const data = await fetchFromTMDB(
                    "/search/movie",
                    `query=${query}`
                );
                setSuggestions(data?.results?.slice(0, 8) || []);
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    const handleSubmit = (movieTitle?: string) => {
        const searchTerm = movieTitle || query;
        if (!searchTerm) return;
        setOpenSearch(false);
        setQuery("");
        setSuggestions([]);
        setOpen(false); // close mobile nav
        router.push(`/movies?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <header className="fixed inset-x-0 top-0 px-6 md:px-18 z-50 bg-[#08275b] text-white shadow-md">
            <div className="flex h-16 items-center justify-between">
                {/* Logo */}
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
                <div className="hidden items-center gap-6 md:flex relative">
                    {/* Expanding Search */}
                    <div className="relative">
                        <div
                            className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden border border-[#1f2937] focus-within:border-cyan-400 rounded-full bg-[#1f2937] ${
                                openSearch ? "w-64 px-2" : "w-0 px-0 border-0"
                            }`}
                        >
                            {/* Icon inside */}
                            {openSearch && (
                                <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                            )}

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSubmit()
                                }
                                placeholder="Search Movies..."
                                className={`bg-[#1f2937] text-sm outline-none flex-1 py-2 rounded-full ${
                                    openSearch ? "opacity-100" : "opacity-0"
                                }`}
                            />

                            {/* Cancel */}
                            {openSearch && (
                                <button
                                    onClick={() => {
                                        setOpenSearch(false);
                                        setQuery("");
                                        setSuggestions([]);
                                    }}
                                    className="ml-2 text-xs font-medium text-gray-400 hover:text-white cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Suggestions dropdown */}
                        {openSearch && suggestions.length > 0 && (
                            <ul className="absolute top-12 left-0 w-64 bg-[#1f2937] rounded-lg shadow-lg text-sm z-50">
                                {suggestions.map((movie) => (
                                    <li
                                        key={movie.id}
                                        onClick={() =>
                                            handleSubmit(movie.title)
                                        }
                                        className="px-3 py-2 hover:bg-[#2a2f3c] cursor-pointer"
                                    >
                                        {movie.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Outside Icon */}
                    {!openSearch && (
                        <Search
                            className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400"
                            onClick={() => setOpenSearch(true)}
                        />
                    )}

                    {/* Other icons */}
                    <Bell className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400" />
                    <User className="h-5 w-5 cursor-pointer transition-colors hover:text-cyan-400" />
                </div>

                {/* Mobile toggle */}
                <button
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center md:hidden cursor-pointer"
                >
                    {open ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            <div className="md:hidden relative">
                {/* Mobile dropdown */}
                <div
                    id="mobile-menu"
                    className={`overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ${
                        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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

                        {/* Mobile Search Input */}
                        <div className="relative mt-3 px-1">
                            <div className="flex items-center rounded-full bg-[#1f2937] border border-[#1f2937] focus-within:border-cyan-400 px-3">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSubmit()
                                    }
                                    placeholder="Search Movies..."
                                    className="bg-[#1f2937] text-sm outline-none flex-1 py-2 rounded-full"
                                />
                                {query && (
                                    <button
                                        onClick={() => {
                                            setQuery("");
                                            setSuggestions([]);
                                        }}
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-[#1f2937] rounded-lg shadow-lg text-sm z-50">
                        {suggestions.map((movie) => (
                            <li
                                key={movie.id}
                                onClick={() => handleSubmit(movie.title)}
                                className="px-3 py-2 hover:bg-[#2a2f3c] cursor-pointer"
                            >
                                {movie.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </header>
    );
}
