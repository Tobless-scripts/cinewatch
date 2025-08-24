"use client";

import Image from "next/image";
import { Star } from "lucide-react";
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
    title,
    poster_path,
    movie,
    vote_average,
    source,
}: MovieCardProps) {
    const { trackMovieClick } = useMovieTracking({ source });

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        trackMovieClick(movie);
    };

    return (
        <Link href={`movies/${movie.id}`} onClick={handleClick}>
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-xl group cursor-pointer transition-transform duration-300">
                {/* Poster */}
                {poster_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info at bottom */}
                <div className="absolute bottom-0 w-full p-4 text-white">
                    {/* Rating */}
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">
                            {vote_average != null
                                ? vote_average.toFixed(1)
                                : "N/A"}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs md:text-base font-normal md:font-bold line-clamp-2">
                        {title}
                    </h3>

                    {/* Watch button */}
                    <button className="mt-3 w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 rounded-lg text-sm transition-all duration-200 transform cursor-pointer">
                        Watch Now
                    </button>
                </div>
            </div>
        </Link>
    );
}
