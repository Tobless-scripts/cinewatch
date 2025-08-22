"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMovieDetails, fetchMovieTrailer } from "@/lib/tmdb";
import { Genre, Movie } from "@/types/Movie";
import { Clock, VideoOff } from "lucide-react";
import MovieProviders from "@/components/movie/MovieProviders";
import MovieDirector from "@/components/movie/MovieDirector";
import Cast from "@/components/movie/MovieCasts";
import MovieReviews from "@/components/movie/MovieReviews";
import PopularCategoryMovies from "@/components/movie/SimilarMovies";

const MovieDetailsPage = () => {
    const { slug } = useParams();
    const movieId = parseInt(slug as string, 10);
    const [movie, setMovie] = useState<Movie>();
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [runtime, setRuntime] = useState<string | null>(null);
    const [tagline, setTagline] = useState<string>(""); // <-- tagline state

    useEffect(() => {
        if (!movieId) return;

        const loadMovie = async () => {
            const movieData = await fetchMovieDetails(movieId);
            setMovie(movieData);

            const trailer = await fetchMovieTrailer(movieId);
            setTrailerKey(trailer);
        };

        loadMovie();
    }, [movieId]);

    // Fetch runtime and tagline whenever current movie changes
    useEffect(() => {
        const loadMovieDetails = async (): Promise<void> => {
            try {
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
    }, [movie, movieId]);

    if (!movie) return <p>Loading...</p>;

    return (
        <div className="bg-[#0c1929]">
            <div className="px-6 md:px-18 py-18">
                <h1 className="text-2xl md:text-5xl font-extrabold my-7">
                    {movie.title}
                </h1>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-full md:w-[60%]">
                        {trailerKey ? (
                            <div className="aspect-video w-full md:h-full bg-black rounded-xl">
                                <iframe
                                    className="w-full h-full rounded-xl"
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    title={`${movie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video w-full max-w-3xl bg-white relative rounded-xl">
                                <iframe
                                    className="w-full h-full rounded-xl"
                                    title={`${movie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
                                    <VideoOff className="w-10 h-10 text-black mx-auto mb-2" />
                                    <p className="text-black text-center">
                                        No trailer Available
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-[40%] h-full">
                        {/* ✅ Use dynamic tagline */}
                        {tagline && (
                            <p className="italic text-lg text-gray-300 mt-2">
                                {tagline}
                            </p>
                        )}
                        <div className="block space-y-2 my-4">
                            <h2 className="text-white font-bold text-xl md:text-3xl">
                                Overview
                            </h2>
                            <p className="text-white font-normal text-sm md:text-base">
                                {movie.overview}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-cyan-400">⭐</span>
                                <span className="text-white font-medium">
                                    {movie.vote_average.toFixed(1)} / 10
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{runtime ?? "Loading..."}</span>
                            </div>
                            <span className="text-gray-300">
                                {movie.release_date?.slice(0, 4)}
                            </span>
                        </div>

                        <div className="flex gap-2 mt-3 flex-wrap">
                            {movie.genres?.slice(0, 3).map((genre: Genre) => (
                                <span
                                    key={genre.id}
                                    className="bg-gray-700 px-2 py-1 rounded text-xs text-white"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <MovieProviders movieId={movieId} />
                        <MovieDirector movieId={movieId} />
                    </div>
                </div>

                {/* Casts  */}
                <Cast movieId={movieId} />
            </div>
            {/* Reviews */}
            <MovieReviews movieId={movieId} />

            {/* You may also like */}
            <PopularCategoryMovies movieId={movieId} />
        </div>
    );
};

export default MovieDetailsPage;
