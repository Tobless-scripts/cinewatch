import { fetchFromTMDB, getGenres } from "@/lib/tmdb";
import { Movie } from "@/types/Movie";
import MovieCard from "../movie/MovieCard";

interface Genre {
    id: number;
    name: string;
}

export default async function PopularSection() {
    const data = await fetchFromTMDB("/trending/movie/week");
    const genres: Genre[] = await getGenres();

    const movies = data?.results || [];
    const previewMovies = movies.slice(0, 16); // Show only 8

    const genreMap = genres.reduce(
        (map, g) => ({ ...map, [g.id]: g.name }),
        {} as Record<number, string>
    );

    return (
        <section className="bg-[#08275b] px-6 md:px-18 py-8">
            <div className="mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                    Popular This Week
                </h2>
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar scrollbar-hide mx-auto">
                {previewMovies.map((movie: Movie) => (
                    <div key={movie.id} className="w-44 flex-shrink-0">
                        <MovieCard
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
                    </div>
                ))}
            </div>
        </section>
    );
}
