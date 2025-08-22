"use client";
import { Movie } from "@/types/Movie";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    genre?: string | string[];
    movie: Movie;
}

export default function UpcomingMovieCard({
    title,
    poster_path,
    release_date,
    genre,
    movie,
}: MovieCardProps) {
    return (
        <Link href={`/movies/${movie.id}`}>
            <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-[#0b1620] cursor-pointer">
                {/* Poster Image */}
                <Image
                    src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                    alt={title}
                    width={500}
                    height={750}
                    className="w-full h-[190px] lg:h-[300px] object-cover rounded-xl"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 p-4 text-white">
                    <span className="bg-cyan-500 text-xs px-2 py-1 rounded-sm font-bold md:text-sm">
                        Coming Soon
                    </span>
                    <h3 className="text-sm md:text-lg font-bold mt-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-300">
                        {new Date(release_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <p className="text-xs md:text-sm mt-1">{genre}</p>
                </div>
            </div>
        </Link>
    );
}
