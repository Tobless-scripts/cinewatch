const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

// Generic fetcher
export async function fetchFromTMDB(endpoint: string, query = "") {
    try {
        const res = await fetch(
            `${BASE_URL}${endpoint}?api_key=${API_KEY}&${query}`,
            { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch from TMDB");
        return await res.json();
    } catch (error) {
        console.error("TMDB Fetch Error:", error);
        return null;
    }
}

// Helper to get genres list (once)
export async function getGenres() {
    try {
        const res = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
            { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to fetch genres");
        const data = await res.json();
        return data.genres; // [{id:28, name:"Action"}, ...]
    } catch (error) {
        console.error("TMDB Genre Fetch Error:", error);
        return [];
    }
}
