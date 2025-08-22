import MovieCard from "@/components/movie/UpcomingMovieCard";
import { fetchFromTMDB, getGenres } from "@/lib/tmdb";
import { Movie } from "@/types/Movie";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Genre {
    id: number;
    name: string;
}

export default async function MoviesPage() {
    const data = await fetchFromTMDB("/movie/upcoming");
    const genres: Genre[] = await getGenres();

    const movies = data?.results || [];

    const genreMap = genres.reduce(
        (map, g) => ({ ...map, [g.id]: g.name }),
        {} as Record<number, string>
    );

    return (
        <section className="bg-[#0b1620] min-h-screen px-6 lg:px-18 py-22">
            <div className="py-10">
                <Link href="/">
                    <h2 className="inline-flex gap-1 text-sm">
                        <ChevronLeft className="w-5 h-5 text-[#8f96a0]" /> Back
                        to home
                    </h2>
                </Link>
                <h1 className="text-2xl md:text-5xl font-bold mt-4 leading-tight">
                    Upcoming Movies
                </h1>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 xs:gap-4 md:gap-6 mx-auto">
                {movies.map((movie: Movie) => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster_path={movie.poster_path}
                        release_date={movie.release_date}
                        genre={
                            movie.genre_ids?.length
                                ? genreMap[movie.genre_ids[0]]
                                : "N/A"
                        }
                        movie={movie}
                    />
                ))}
            </div>
        </section>
    );
}
