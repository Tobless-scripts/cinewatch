"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchFromTMDB, getGenres } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import UpcomingMovieCard from "@/components/movie/UpcomingMovieCard";
import { ChevronLeft, Loader } from "lucide-react";
import { Movie, Movies } from "@/types/Movie";
import Link from "next/link";

interface Genre {
    id: number;
    name: string;
}

// ✅ Wrapper: Suspense at the page level
export default function MoviesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
                    <p className="mt-4 text-lg">Loading search…</p>
                </div>
            }
        >
            <MoviesContent />
        </Suspense>
    );
}

// ✅ Inner component: actually uses useSearchParams
function MoviesContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const loadGenres = async () => {
            const genreList = await getGenres();
            setGenres(genreList);
        };
        loadGenres();
    }, []);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                let data;

                if (query) {
                    data = await fetchFromTMDB(
                        "/search/movie",
                        `query=${query}`
                    );
                } else {
                    data = await fetchFromTMDB("/movie/popular", "page=1");
                }

                if (data?.results) {
                    const mappedMovies = data.results.map((m: Movie) => ({
                        ...m,
                        genre:
                            m.genre_ids
                                ?.map(
                                    (id: number) =>
                                        genres.find((g) => g.id === id)?.name
                                )
                                .filter(Boolean)
                                .slice(0, 2)
                                .join(", ") || "Unknown",
                    }));
                    setMovies(mappedMovies);
                } else {
                    setMovies([]);
                }
            } finally {
                setLoading(false);
            }
        };

        if (genres.length > 0) loadMovies();
    }, [query, genres]);

    return (
        <div className="w-full py-22 px-6 md:px-18">
            <Link href="/">
                <h2 className="inline-flex gap-1 text-sm">
                    <ChevronLeft className="w-5 h-5 text-[#8f96a0]" /> Back to
                    home
                </h2>
            </Link>
            <h1 className="text-3xl font-bold text-white my-12">
                {query ? `Results for "${query}"` : "Browse Movies"}
            </h1>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
                    <p className="mt-4 text-lg">Loading...</p>
                </div>
            )}

            {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                    {movies.map((m) => {
                        const isUpcoming =
                            m.release_date &&
                            new Date(m.release_date) > new Date();

                        return isUpcoming ? (
                            <UpcomingMovieCard key={m.id} {...m} movie={m} />
                        ) : (
                            <MovieCard
                                key={m.id}
                                {...m}
                                movie={m}
                                source="search"
                            />
                        );
                    })}
                </div>
            )}

            {!loading && movies.length === 0 && (
                <p className="text-center text-gray-400 mt-10">
                    No movies found.
                </p>
            )}
        </div>
    );
}
