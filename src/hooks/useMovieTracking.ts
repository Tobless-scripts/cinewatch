"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router import
import useContinueWatchingStore from "../store/continueWatchingStore";
import { Movie } from "@/types/Movie";

// Define TMDB video type
interface TMDBVideo {
    id: string;
    key: string;
    site: string;
    type: string;
    name: string;
}

interface UseMovieTrackingProps {
    source:
        | "trending"
        | "popular"
        | "search"
        | "genre"
        | "category"
        | "watchlist";
}

export const useMovieTracking = ({ source }: UseMovieTrackingProps) => {
    const router = useRouter();
    const { addToWatching, setTrailer } = useContinueWatchingStore();

    const trackMovieClick = useCallback(
        async (movie: Movie) => {
            // Add to continue watching with source tracking
            addToWatching(movie, 0, source);

            try {
                // Fetch trailer data
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                );
                const data: { results: TMDBVideo[] } = await response.json();

                const trailer = data.results.find(
                    (video: TMDBVideo) =>
                        video.type === "Trailer" && video.site === "YouTube"
                );

                if (trailer) {
                    setTrailer(movie.id, {
                        key: trailer.key,
                        embedUrl: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`,
                    });
                }
            } catch (error) {
                console.error("Error fetching trailer:", error);
            }

            // Navigate to movie page
            router.push(`/movies/${movie.id}`);
        },
        [addToWatching, setTrailer, router, source]
    );

    return { trackMovieClick };
};
