"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useContinueWatchingStore from "@/store/continueWatchingStore";
import { WatchingItem } from "@/types/Movie";
import Link from "next/link";

// Define TMDB video type
interface TMDBVideo {
    id: string;
    key: string;
    site: string;
    type: string;
    name: string;
}

const ContinueWatching: React.FC = () => {
    const { continueWatching, lastWatchedTrailer } = useContinueWatchingStore();
    const [trailerUrl, setTrailerUrl] = useState<string>("");

    // Fetch trailer for the most recent movie if not available
    useEffect(() => {
        if (continueWatching.length > 0 && !lastWatchedTrailer) {
            fetchTrailer(continueWatching[0].id);
        }
    }, [continueWatching, lastWatchedTrailer]);

    const fetchTrailer = async (movieId: number) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            const data = await response.json();

            const trailer = data.results.find(
                (video: TMDBVideo) =>
                    video.type === "Trailer" && video.site === "YouTube"
            );

            if (trailer) {
                setTrailerUrl(
                    `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`
                );
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    };

    if (continueWatching.length === 0) {
        return null;
    }

    const mostRecentMovie = continueWatching[0];
    const currentTrailerUrl = lastWatchedTrailer?.embedUrl || trailerUrl;

    return (
        <div className="mb-8 px-6 md:px-18 py-20">
            <h1 className="text-2xl md:text-4xl py-6 font-extrabold">
                Movies Available for Streaming
            </h1>
            <div className="bg-[#071420] p-10 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">
                        Continue Watching
                    </h2>
                    <span className="text-gray-400 text-sm">
                        Last watched from: {mostRecentMovie.clickSource}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Trailer Section */}
                    <div className="lg:col-span-2">
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                            {currentTrailerUrl ? (
                                <div className="aspect-video">
                                    <iframe
                                        src={currentTrailerUrl}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={`${mostRecentMovie.title} Trailer`}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                        <div className="text-gray-400">
                                            Loading trailer...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Movie Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 md:p-6">
                                <h3 className="text-md md:text-2xl font-bold text-white mb-2">
                                    {mostRecentMovie.title}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Watchlist Sidebar */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">
                            Your Watchlist
                        </h3>
                        <div className="space-y-4">
                            {continueWatching.map((movie: WatchingItem) => (
                                <Link
                                    href={`movies/${movie.id}`}
                                    key={movie.id}
                                >
                                    <div className="flex space-x-3 group cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors">
                                        <div className="relative">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                                                alt={movie.title}
                                                width={64}
                                                height={96}
                                                className="object-cover rounded"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-white font-medium md:font-semibold text-xs md:text-sm line-clamp-2 mb-1">
                                                {movie.title}
                                            </h4>

                                            <div className="flex items-center space-x-1 mb-2">
                                                <svg
                                                    className="w-4 h-4 text-yellow-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs text-gray-400">
                                                    {movie.vote_average.toFixed(
                                                        1
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContinueWatching;
