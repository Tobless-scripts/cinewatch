"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Star } from "lucide-react";

interface MovieCardProps {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    genre: string;
    vote_average: number;
}

export default function MovieCard({
    title,
    poster_path,
    release_date,
    genre,
    vote_average,
}: MovieCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative w-full flex-shrink-0 cursor-pointer rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Poster */}
            <Image
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                alt={title}
                width={300}
                height={400}
                className="w-full h-[170px] lg:h-[300px] object-cover rounded-xl"
            />

            {/* Hover Overlay */}
            {hovered && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E36] via-[#0B1E36]/80 to-[#0b1e36] text-white flex flex-col justify-end p-4 transition-opacity duration-300 rounded-xl">
                    {/* Top section with rating - positioned absolutely */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/30 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold">
                            {vote_average.toFixed(1)}
                        </span>
                    </div>

                    {/* Bottom stacked content */}
                    <div className="flex flex-col gap-3">
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>2h 46m</span>
                        </div>

                        {/* Watch Now button */}
                        <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-3  sm:px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105 shadow-lg w-full cursor-pointer">
                            Watch Now
                        </button>
                    </div>
                </div>
            )}

            {/* Title & Info */}
            <div className="mt-2 text-center">
                <h3 className="text-white font-semibold truncate">{title}</h3>
                <p className="text-gray-400 text-sm">
                    {new Date(release_date).getFullYear()} • {genre}
                </p>
            </div>
        </div>
    );
}
