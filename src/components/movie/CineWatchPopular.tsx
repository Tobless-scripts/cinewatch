import { fetchUniqueMostPopularByGenre } from "@/lib/tmdb";
import MovieCard from "../movie/MovieCard";

export default async function PopularSection() {
    const moviesByGenre = await fetchUniqueMostPopularByGenre();

    return (
        <section className="bg-[#0a1929] px-6 md:px-18 py-8">
            <div className="mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                    Popular on CineWatch
                </h2>
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar scrollbar-hide mx-auto">
                {moviesByGenre.map(
                    ({ genre, movie }) =>
                        movie && (
                            <div
                                key={`${genre.id}-${movie.id}`}
                                className="w-48 flex-shrink-0"
                            >
                                <MovieCard
                                    id={movie.id}
                                    title={movie.title}
                                    poster_path={movie.poster_path}
                                    release_date={movie.release_date}
                                    genre={genre.name}
                                    vote_average={movie.vote_average}
                                    movie={movie}
                                    source="popular"
                                />
                            </div>
                        )
                )}
            </div>
        </section>
    );
}
