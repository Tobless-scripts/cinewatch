"use client";

import { Calendar, Play } from "lucide-react";
import { useEffect, useState } from "react";

type Provider = {
    provider_id: number;
    provider_name: string;
    logo_path: string;
};

const MovieProviders = ({ movieId }: { movieId: number }) => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [providerLink, setProviderLink] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
                );

                if (!res.ok) throw new Error("Failed to fetch providers");

                const data = await res.json();
                console.log("Raw providers response:", data);

                const countryData = data.results?.US;
                if (!countryData) {
                    setError("No providers available");
                    return;
                }

                setProviderLink(countryData.link || null);

                const allProviders: Provider[] = [
                    ...(countryData.flatrate || []),
                    ...(countryData.buy || []),
                    ...(countryData.rent || []),
                ];

                // Remove duplicates
                const uniqueProviders = Array.from(
                    new Map(
                        allProviders.map((p) => [p.provider_id, p])
                    ).values()
                );

                setProviders(uniqueProviders);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error fetching providers:", err.message);
                    setError(err.message);
                } else {
                    console.error("Unexpected error:", err);
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [movieId]);

    if (loading) return <p>Loading providers...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-4 flex flex-col md:flex-row gap-4 mt-8 items-center">
            <div className="flex flex-wrap gap-4">
                {providers.slice(0, 2).map((provider) => (
                    <a
                        key={provider.provider_id}
                        href={providerLink ?? "#"} // TMDB redirect link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 max-w-fit text-sm bg-[#06b6d4] hover:bg-cyan-600 px-6 py-4 rounded-md font-medium text-white transition-colors cursor-pointer"
                    >
                        <Play size={18} fill="white" />
                        Stream on {provider.provider_name}
                    </a>
                ))}
            </div>

            <div>
                {/* If only 1 provider exists, show Book Ticket */}
                {providers.length === 1 && (
                    <button className="flex items-center gap-2 max-w-fit bg-[#1f2937] hover:bg-gray-800/50 px-6 py-4 rounded-md font-medium text-white transition-colors cursor-pointer">
                        <Calendar size={18} />
                        Book Tickets
                    </button>
                )}
            </div>
            {providers.length === 0 && <p>No streaming providers available.</p>}
        </div>
    );
};

export default MovieProviders;
