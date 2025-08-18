import { fetchFromTMDB, getGenres } from "@/lib/tmdb";
import { Movie } from "@/types/Movie";
import Link from "next/link";
import MovieCard from "../movie/UpcomingMovieCard";

interface Genre {
    id: number;
    name: string;
}

export default async function UpcomingSection() {
    const data = await fetchFromTMDB("/movie/upcoming");
    const genres: Genre[] = await getGenres();

    const movies = data?.results || [];

    const previewMovies = movies.slice(0, 8);

    const genreMap = genres.reduce(
        (map, g) => ({ ...map, [g.id]: g.name }),
        {} as Record<number, string>
    );

    return (
        <section className="bg-[#0b1620] px-6 md:px-18 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                    Coming Soon
                </h2>
                <Link
                    href="/upcoming-movies"
                    className="text-sm text-cyan-400 hover:underline"
                >
                    Show More →
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar scrollbar-hide mx-auto">
                {previewMovies.map((movie: Movie) => (
                    <div
                        key={movie.id}
                        className="w-64 flex-shrink-0 cursor-pointer"
                    >
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
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
