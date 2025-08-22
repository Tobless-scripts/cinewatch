"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { fetchMovieDetails } from "@/lib/tmdb";
import Link from "next/link";
import { Movie, Movies } from "@/types/Movie";
import { useMovieTracking } from "@/hooks/useMovieTracking";

interface MovieCardProps {
    id: number;
    title: string;
    poster_path: string | null;
    release_date?: string | null;
    genre?: string | string[];
    vote_average?: number | null;
    movie: Movie | Movies;
    source:
        | "trending"
        | "popular"
        | "search"
        | "genre"
        | "category"
        | "watchlist";
}

export default function MovieCard({
    id,
    title,
    poster_path,
    release_date,
    genre,
    movie,
    vote_average,
    source,
}: MovieCardProps) {
    const [hovered, setHovered] = useState(false);
    const [runtime, setRuntime] = useState<string | null>(null);
    const { trackMovieClick } = useMovieTracking({ source });

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        trackMovieClick(movie); // This will handle navigation internally
    };

    // Fetch runtime when card mounts
    useEffect(() => {
        const loadRuntime = async () => {
            try {
                const details = await fetchMovieDetails(id);
                if (details?.runtime) {
                    const hours = Math.floor(details.runtime / 60);
                    const minutes = details.runtime % 60;
                    setRuntime(`${hours}h ${minutes}m`);
                } else {
                    setRuntime("N/A");
                }
            } catch {
                setRuntime("N/A");
            }
        };

        loadRuntime();
    }, [id]);

    return (
        <Link href={`movies/${movie.id}`}>
            <div
                className="relative w-full flex-shrink-0 cursor-pointer rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleClick}
            >
                {/* Poster */}
                {poster_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                        alt={title}
                        width={300}
                        height={400}
                        className="w-full h-[170px] lg:h-[300px] object-cover rounded-xl"
                    />
                ) : (
                    <div className="w-full h-[170px] lg:h-[300px] bg-gray-700 flex items-center justify-center rounded-xl text-gray-400">
                        No Image
                    </div>
                )}

                {/* Hover Overlay */}
                {hovered && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E36] via-[#0B1E36]/80 to-[#0b1e36] text-white flex flex-col justify-end p-4 transition-opacity duration-300 rounded-xl">
                        {/* Rating */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/30 rounded-full px-3 py-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold">
                                {vote_average != null
                                    ? vote_average.toFixed(1)
                                    : "N/A"}
                            </span>
                        </div>

                        {/* Runtime */}
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{runtime ?? "Loading..."}</span>
                        </div>

                        {/* Watch Now button */}
                        <button className="mt-3 bg-cyan-400 hover:bg-cyan-300 text-black px-3 sm:px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105 shadow-lg w-full cursor-pointer">
                            Watch Now
                        </button>
                    </div>
                )}

                {/* Title & Info */}
                <div className="mt-2 text-center">
                    <h3 className="text-white font-semibold truncate">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {release_date
                            ? new Date(release_date).getFullYear()
                            : "N/A"}{" "}
                        • {genre || "Unknown"}
                    </p>
                </div>
            </div>
        </Link>
    );
}
