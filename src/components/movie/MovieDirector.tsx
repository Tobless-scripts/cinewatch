import { useEffect, useState } from "react";

interface CrewMember {
    id: number;
    name: string;
    job: string;
}

const MovieDirector = ({ movieId }: { movieId: number }) => {
    const [director, setDirector] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDirector = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
                );

                if (!res.ok) throw new Error("Failed to fetch credits");

                const data = await res.json();
                const crew: CrewMember[] = data.crew;

                const directorInfo = crew.find(
                    (person) => person.job === "Director"
                );

                if (directorInfo) {
                    setDirector(directorInfo.name);
                } else {
                    setDirector("Unknown");
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
        };

        fetchDirector();
    }, [movieId]);

    if (error) return <p>Error: {error}</p>;
    if (!director) return <p>Loading director...</p>;

    return (
        <p>
            <strong>Director:</strong> {director}
        </p>
    );
};

export default MovieDirector;
