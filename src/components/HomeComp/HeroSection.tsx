"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { fetchFromTMDB, fetchMovieDetails } from "@/lib/tmdb";
import { Genre, Movie } from "@/types/Movie";
import Link from "next/link";

export default function HeroSection() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Record<number, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [runtime, setRuntime] = useState<string | null>(null);
    const [tagline, setTagline] = useState<string>(""); // <-- tagline state

    // Fetch runtime and tagline whenever current movie changes
    useEffect(() => {
        if (!movies.length) return;

        const loadMovieDetails = async (): Promise<void> => {
            try {
                const movieId = movies[currentIndex].id;
                const details = await fetchMovieDetails(movieId);

                // runtime
                if (details?.runtime) {
                    const hours = Math.floor(details.runtime / 60);
                    const minutes = details.runtime % 60;
                    setRuntime(`${hours}h ${minutes}m`);
                } else setRuntime("N/A");

                // tagline
                setTagline(details?.tagline || ""); // <-- set tagline dynamically
            } catch {
                setRuntime("N/A");
                setTagline("");
            }
        };

        loadMovieDetails();
    }, [movies, currentIndex]);

    // Fetch trending movies and genres
    useEffect(() => {
        const getMovies = async () => {
            const data = await fetchFromTMDB(
                "/trending/movie/day",
                "language=en-US&page=1"
            );
            if (data?.results) setMovies(data.results.slice(0, 6));
        };

        const getGenreList = async () => {
            const g = await fetchFromTMDB(
                "/genre/movie/list",
                "language=en-US"
            );
            if (g?.genres) {
                const mapped = g.genres.reduce(
                    (map: Record<number, string>, genre: Genre) => {
                        map[genre.id] = genre.name;
                        return map;
                    },
                    {}
                );
                setGenres(mapped);
            }
        };

        getMovies();
        getGenreList();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, [movies.length]);

    // Auto slide every 10s
    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => nextSlide(), 10000);
        return () => clearInterval(interval);
    }, [movies, nextSlide]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const newScale = Math.min(1 + scrollY / 1000, 1.3);
            setScale(newScale);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    if (movies.length === 0)
        return <p className="text-center text-white">Loading...</p>;

    const movie = movies[currentIndex];

    return (
        <div className="w-full bg-[#0B1E36] h-[50vh] md:h-[40vh] lg:h-[80vh]">
            <div className="relative w-full h-full overflow-hidden">
                {/* Background Image */}
                <Image
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    width={1600}
                    height={600}
                    className="w-full h-full object-center transition-transform duration-300"
                    style={{ transform: `scale(${scale})` }}
                    priority
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E36] via-[#0B1E36]/80 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 px-6 md:px-18 flex items-center">
                    <div className=" text-white pt-12 lg:pt-10">
                        <span className="max-lg:hidden bg-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                        </span>

                        <h1 className="text-md md:text-base lg:text-5xl font-bold mt-4 leading-tight">
                            {movie.title}
                        </h1>

                        {/* ✅ Use dynamic tagline */}
                        {tagline && (
                            <p className="max-sxs:hidden italic text-xs md:text-sm lg:text-lg text-gray-300 mt-2">
                                {tagline}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-4 text-xs md:text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-cyan-400">⭐</span>
                                <span className="text-white font-medium">
                                    {movie.vote_average.toFixed(1)} / 10
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{runtime ?? "Loading..."}</span>
                            </div>
                            <span className="text-gray-300">
                                {movie.release_date?.slice(0, 4)}
                            </span>
                        </div>

                        <div className="flex gap-2 mt-2 md:mt-3 flex-wrap">
                            {movie.genre_ids?.slice(0, 3).map((id: number) => (
                                <span
                                    key={id}
                                    className="bg-gray-700 px-2 py-1 rounded text-xs"
                                >
                                    {genres[id] || "Unknown"}
                                </span>
                            ))}
                        </div>

                        <p className="max-sxs:hidden mt-2 md:mt-6 text-gray-200 text-xs leading-relaxed max-w-lg line-clamp-2">
                            {movie.overview}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-2 md:mt-4 lg:mt-8">
                            <Link href={`movies/${movie.id}`}>
                                <button className="flex items-center max-sm:text-xs max-md:text-sm gap-2 max-w-fit bg-[#06b6d4] hover:bg-cyan-600 px-6 py-2 lg:py-3 rounded-md font-medium text-white transition-colors cursor-pointer">
                                    <Play size={18} fill="white" />
                                    Watch Trailer
                                </button>
                            </Link>
                            <button className="flex items-center max-sm:text-xs max-md:text-sm gap-2 max-w-fit bg-[#1f2937] hover:bg-gray-800/50 px-6 py-2 lg:py-3  rounded-md font-medium text-white transition-colors cursor-pointer">
                                <Calendar size={18} />
                                Book Tickets
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition-colors flex cursor-pointer"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition-colors flex cursor-pointer"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
