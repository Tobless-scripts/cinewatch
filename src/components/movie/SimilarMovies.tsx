"use client";

import { useEffect, useState } from "react";
import { getGenres, fetchMovieDetails, fetchMoviesByGenre } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/Movie";

interface Genre {
    id: number;
    name: string;
}

const PopularCategoryMovies = ({ movieId }: { movieId: number }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                // 1. Get genres for lookup
                const allGenres = await getGenres();
                setGenres(allGenres);

                // 2. Get the movie’s details (to know its genres)
                const movie = await fetchMovieDetails(movieId);
                const firstGenreId = movie.genres?.[0]?.id;

                if (!firstGenreId) return;

                // 3. Fetch popular movies from the same genre
                const genreMovies = await fetchMoviesByGenre(firstGenreId);

                // 4. Exclude the current movie
                const filteredMovies = genreMovies.filter(
                    (m: Movie) => m.id !== movieId
                );

                // 5. Keep only 5 movies
                setMovies(filteredMovies.slice(0, 5));
            } catch (err) {
                console.error("Error loading category movies:", err);
            }
        };

        loadMovies();
    }, [movieId]);

    // Map genre ids to names
    const genreMap = genres.reduce(
        (map, g) => ({ ...map, [g.id]: g.name }),
        {} as Record<number, string>
    );

    return (
        <div className="bg-[#071420] px-6 md:px-18 py-8">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
                You may also like
            </h2>
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
                                ? genreMap[movie.genre_ids[0]]
                                : "N/A"
                        }
                        vote_average={movie.vote_average}
                        movie={movie}
                        source="popular"
                    />
                ))}
            </div>
        </div>
    );
};

export default PopularCategoryMovies;
