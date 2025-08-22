// store/continueWatchingStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    Movie,
    WatchingItem,
    TrailerData,
    ContinueWatchingStore,
} from "@/types/Movie";

const useContinueWatchingStore = create<ContinueWatchingStore>()(
    persist(
        (set) => ({
            continueWatching: [],
            lastWatchedTrailer: null,

            addToWatching: (movie: Movie, progress = 0, source = "unknown") => {
                set((state) => {
                    const watchingItem: WatchingItem = {
                        ...movie,
                        progress,
                        lastWatched: new Date().toISOString(),
                        timestamp: Date.now(),
                        clickSource: source as WatchingItem["clickSource"],
                    };

                    // Remove if already exists, add to beginning, keep only last 3
                    const filtered = state.continueWatching.filter(
                        (item) => item.id !== movie.id
                    );
                    const updated = [watchingItem, ...filtered].slice(0, 3);

                    return { continueWatching: updated };
                });
            },

            setTrailer: (
                movieId: number,
                trailerData: Omit<TrailerData, "movieId" | "timestamp">
            ) => {
                set({
                    lastWatchedTrailer: {
                        ...trailerData,
                        movieId,
                        timestamp: Date.now(),
                    },
                });
            },

            removeFromWatching: (movieId: number) => {
                set((state) => ({
                    continueWatching: state.continueWatching.filter(
                        (item) => item.id !== movieId
                    ),
                }));
            },

            updateProgress: (movieId: number, progress: number) => {
                set((state) => ({
                    continueWatching: state.continueWatching.map((item) =>
                        item.id === movieId
                            ? {
                                  ...item,
                                  progress,
                                  lastWatched: new Date().toISOString(),
                                  timestamp: Date.now(),
                              }
                            : item
                    ),
                }));
            },
        }),
        {
            name: "continue-watching-storage",
            version: 1,
            migrate: (
                persistedState: unknown,
                version: number
            ): ContinueWatchingStore | undefined => {
                const state = persistedState as
                    | ContinueWatchingStore
                    | undefined;

                if (version < 1) {
                    // Migration logic for older versions
                    return state;
                }

                return state;
            },
        }
    )
);

export default useContinueWatchingStore;
