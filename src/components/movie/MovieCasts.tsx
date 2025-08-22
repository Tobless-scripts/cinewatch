"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CastMember = {
    id: number;
    name: string; // real name
    character: string; // name in movie
    profile_path: string | null;
};

export default function Cast({ movieId }: { movieId: number }) {
    const [cast, setCast] = useState<CastMember[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCast = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
                );
                if (!res.ok) throw new Error("Failed to fetch cast");
                const data = await res.json();
                setCast(data.cast || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchCast();
    }, [movieId]);

    if (loading) return <p className="text-center">Loading cast...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="p-4">
            {/* Heading */}
            <h1 className="text-2xl md:text-4xl font-bold my-8">Cast</h1>

            {/* Horizontal scrollable container */}
            <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar">
                {cast.map((member) => (
                    <div
                        key={member.id}
                        className="flex-shrink-0 w-[200px] flex flex-col rounded-xl overflow-hidden h-[300px] shadow-lg bg-[#152130]"
                    >
                        {/* Image takes 70% of card */}
                        <div className="h-[80%] flex justify-center items-center bg-gray-100">
                            {member.profile_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    width={800}
                                    height={500}
                                    quality={100}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Names */}
                        <div className="flex flex-col items-center p-2 bg-[#152130]">
                            <p className="font-semibold text-sm text-center">
                                {member.name}
                            </p>
                            <p className="text-xs text-gray-200 text-center">
                                {member.character}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
