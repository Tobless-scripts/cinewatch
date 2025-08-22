import { Genre, Movie } from "@/types/Movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

type TMDBVideo = {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string; // YouTube video key
    name: string; // Trailer name
    site: string; // e.g., "YouTube"
    size: number; // 720, 1080
    type: string; // "Trailer", "Teaser", "Clip", etc.
    official: boolean;
    published_at: string;
};

// Generic fetcher (with revalidate option)
export async function fetchFromTMDB(
    endpoint: string,
    query = "",
    revalidate = 3600
) {
    try {
        const res = await fetch(
            `${BASE_URL}${endpoint}?api_key=${API_KEY}&${query}`,
            { next: { revalidate } } // ✅ cache for X seconds
        );
        if (!res.ok) throw new Error("Failed to fetch from TMDB");
        return await res.json();
    } catch (error) {
        console.error("TMDB Fetch Error:", error);
        return null;
    }
}

// Get genres (can be cached longer)
export async function getGenres() {
    try {
        const res = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
            { next: { revalidate: 86400 } } // ✅ cache for 1 day
        );
        if (!res.ok) throw new Error("Failed to fetch genres");
        const data = await res.json();
        return data.genres;
    } catch (error) {
        console.error("TMDB Genre Fetch Error:", error);
        return [];
    }
}

// Discover movies by genre (can revalidate every hour)
export async function fetchMoviesByGenre(genreId: number) {
    const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`,
        { next: { revalidate: 3600 } } // ✅ 1 hour cache
    );
    if (!res.ok) throw new Error("Failed to fetch movies by genre");
    const data = await res.json();
    return data.results || [];
}

// Movie details (useful for dynamic movie pages -> no-store or short revalidate)
export async function fetchMovieDetails(movieId: number) {
    return fetchFromTMDB(`/movie/${movieId}`, "", 600); // ✅ revalidate every 10 minutes
}

// Trailers (dynamic, but can cache for a bit)
export async function fetchMovieTrailer(movieId: number) {
    const data = await fetchFromTMDB(`/movie/${movieId}/videos`, "", 600);
    if (!data || !data.results) return null;

    const trailer = data.results.find(
        (vid: TMDBVideo) => vid.type === "Trailer" && vid.site === "YouTube"
    );
    return trailer ? trailer.key : null;
}

// Providers (keep no-store since it depends on region/account availability)
export async function fetchMovieProviders(movieId: number) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
                },
                cache: "no-store", // ✅ keep dynamic
            }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching providers:", error);
        return null;
    }
}

// Similar movies (revalidate every 30 minutes)
export async function fetchSimilarMovies(movieId: number) {
    const res = await fetch(
        `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 1800 } } // ✅ 30 min cache
    );
    if (!res.ok) throw new Error("Failed to fetch similar movies");
    const data = await res.json();
    return data.results.slice(0, 5);
}

// Unique most popular by genre (revalidate every 6 hours)
export async function fetchUniqueMostPopularByGenre(): Promise<
    { genre: Genre; movie: Movie | null }[]
> {
    try {
        const genresRes = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
            { next: { revalidate: 86400 } } // ✅ 1 day cache
        );
        if (!genresRes.ok) throw new Error("Failed to fetch genres");
        const { genres }: { genres: Genre[] } = await genresRes.json();

        const usedMovieIds = new Set<number>();

        const moviesByGenre = await Promise.all(
            genres.map(async (genre) => {
                const res = await fetch(
                    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&language=en-US&page=1`,
                    { next: { revalidate: 21600 } } // ✅ 6 hours cache
                );
                if (!res.ok) return { genre, movie: null };

                const data = await res.json();
                const movies: Movie[] = data.results ?? [];

                const uniqueMovie =
                    movies.find((m) => !usedMovieIds.has(m.id)) ?? null;
                if (uniqueMovie) usedMovieIds.add(uniqueMovie.id);

                return { genre, movie: uniqueMovie };
            })
        );

        return moviesByGenre;
    } catch (err) {
        console.error("Error fetching unique popular movies by genre:", err);
        return [];
    }
}
