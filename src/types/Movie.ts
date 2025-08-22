export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    genre_ids: number[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface Movies {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
    vote_count: number;
    popularity: number;
    genre_ids: number[];
    original_language: string;
    adult: boolean;
    video: boolean;
}

export type Provider = {
    display_priority: number;
    logo_path: string;
    provider_id: number;
    provider_name: string;
};

export type ProviderRegion = {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
};

export type ProvidersResponse = {
    id: number;
    results: {
        [countryCode: string]: ProviderRegion;
    };
};

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    overview: string;
    runtime?: number;
}

export interface WatchingItem extends Movie {
    progress: number; // 0-100 percentage
    lastWatched: string; // ISO date string
    timestamp: number; // Unix timestamp
    clickSource:
        | "trending"
        | "popular"
        | "search"
        | "genre"
        | "recommendations"
        | "watchlist";
}

export interface TrailerData {
    key: string;
    embedUrl: string;
    movieId: number;
    timestamp: number;
}

export interface ContinueWatchingStore {
    continueWatching: WatchingItem[];
    lastWatchedTrailer: TrailerData | null;
    addToWatching: (movie: Movie, progress?: number, source?: string) => void;
    setTrailer: (
        movieId: number,
        trailerData: Omit<TrailerData, "movieId" | "timestamp">
    ) => void;
    removeFromWatching: (movieId: number) => void;
    updateProgress: (movieId: number, progress: number) => void;
}
