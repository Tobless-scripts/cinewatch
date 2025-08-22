"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchFromTMDB, getGenres } from "@/lib/tmdb";
import { Movie } from "@/types/Movie";
import MovieCard from "../movie/MovieCard";
import { Loader } from "lucide-react";

const categories = [
    { name: "Action", emoji: "🔥" },
    { name: "Adventure", emoji: "🗺️" },
    { name: "Animation", emoji: "🎨" },
    { name: "Comedy", emoji: "😆" },
    { name: "Crime", emoji: "🕵️" },
    { name: "Documentary", emoji: "🎥" },
    { name: "Drama", emoji: "🎭" },
    { name: "Family", emoji: "👨‍👩‍👧‍👦" },
    { name: "Fantasy", emoji: "🧙" },
    { name: "History", emoji: "🏰" },
    { name: "Horror", emoji: "👻" },
    { name: "Music", emoji: "🎶" },
    { name: "Mystery", emoji: "🕵️‍♀️" },
    { name: "Romance", emoji: "❤️" },
    { name: "Thriller", emoji: "🔪" },
    { name: "War", emoji: "⚔️" },
];

interface Genre {
    id: number;
    name: string;
}

export default function CategorySelector() {
    const [active, setActive] = useState<string>("Action");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genreMap, setGenreMap] = useState<Record<string, number>>({});
    const [idToNameMap, setIdToNameMap] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);

    // Fetch TMDB genres once and map them
    useEffect(() => {
        const loadGenres = async () => {
            const genres: Genre[] = await getGenres();
            const nameToId: Record<string, number> = {};
            const idToName: Record<number, string> = {};

            genres.forEach((g) => {
                nameToId[g.name.toLowerCase()] = g.id;
                idToName[g.id] = g.name;
            });

            setGenreMap(nameToId);
            setIdToNameMap(idToName);
        };
        loadGenres();
    }, []);

    // Fetch movies for a category
    const fetchMovies = useCallback(
        async (cat: string) => {
            setActive(cat);
            setLoading(true);
            try {
                const genreId = genreMap[cat.toLowerCase()];
                if (!genreId) return;

                const data = await fetchFromTMDB(
                    "/discover/movie",
                    `with_genres=${genreId}&sort_by=popularity.desc&page=1`
                );
                setMovies(data?.results?.slice(0, 15) || []);
            } catch (error) {
                console.error("Failed fetching movies:", error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        },
        [genreMap]
    ); // depends on genreMap only

    // Load Action by default once genres are ready
    useEffect(() => {
        if (genreMap["action"] && active === "Action" && movies.length === 0) {
            fetchMovies("Action");
        }
    }, [genreMap, active, movies.length, fetchMovies]);

    return (
        <div className="w-full px-6 md:px-18 py-8">
            {/* Category Bar */}
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                    Browse Categories
                </h2>
            </div>

            <div className="flex md:grid md:grid-cols-8 gap-3 mb-6 overflow-x-auto md:overflow-x-visible scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => fetchMovies(cat.name)}
                        className={`flex-shrink-0 md:flex-shrink md:w-full flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer
              ${
                  active === cat.name
                      ? "bg-[#06b6d4] text-white"
                      : "bg-[#1a1f2c] text-white/90 hover:bg-[#2a2f3c]"
              }`}
                    >
                        <span className="text-2xl mb-1">{cat.emoji}</span>
                        <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Movies Grid */}
            {loading && (
                <div className="flex flex-col space-y-12 justify-center items-center max-h-3/4">
                    <Loader className="text-[#06b6d4] w-20 h-20" />
                    <p className="text-2xl md:text-4xl">Loading...</p>
                </div>
            )}

            {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((movie: Movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                            release_date={movie.release_date}
                            genre={
                                movie.genre_ids?.length
                                    ? idToNameMap[movie.genre_ids[0]]
                                    : "N/A"
                            }
                            vote_average={movie.vote_average}
                            movie={movie}
                            source="category"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
