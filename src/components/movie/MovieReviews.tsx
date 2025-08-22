"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface AuthorDetails {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
}

interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    content: string;
    created_at: string;
    author_details: AuthorDetails;
}

export default function MovieReviews({ movieId }: { movieId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                );
                const data = await res.json();
                setReviews(data.results || []);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }

        fetchReviews();
    }, [movieId]);

    if (!reviews || reviews.length === 0) {
        return (
            <p className="text-center text-gray-400">No reviews available</p>
        );
    }

    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    return (
        <div className="bg-[#071420] px-6 md:px-18 py-8">
            <h1 className="text-2xl md:text-4xl font-bold my-6">Reviews</h1>

            <div className="w-full space-y-6">
                {displayedReviews.map((review) => (
                    <div
                        key={review.id}
                        className="w-full bg-[#131f2c] rounded-xl p-4 relative"
                    >
                        <div className="flex justify-between items-center">
                            {/* Reviewer info */}
                            <div className="flex items-center gap-3">
                                <div>
                                    <Image
                                        src={
                                            review.avatar ||
                                            "/default-avatar.png"
                                        }
                                        alt={review.author}
                                        className="w-12 h-12 rounded-full object-cover"
                                        quality={100}
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <div className="block space-y-1">
                                    <span className="font-semibold">
                                        {review.author}
                                    </span>
                                    {/* Rating */}
                                    <p className="mt-2 text-sm text-yellow-400">
                                        ⭐{" "}
                                        {review.author_details?.rating ?? "N/A"}
                                        /10{" "}
                                        <span className="text-gray-400">
                                            Rated
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Date top-right */}
                            <p className="text-gray-400 text-sm">
                                {new Date(review.created_at).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        </div>

                        {/* Review Content with clamp */}
                        <p
                            className={`mt-3 text-gray-300 text-sm ${
                                expanded[review.id] ? "" : "line-clamp-3"
                            }`}
                        >
                            {review.content}
                        </p>

                        {/* Read more toggle */}
                        {review.content.length > 150 && (
                            <button
                                onClick={() =>
                                    setExpanded((prev) => ({
                                        ...prev,
                                        [review.id]: !prev[review.id],
                                    }))
                                }
                                className="mt-1 text-blue-400 text-xs  hover:underline cursor-pointer"
                            >
                                {expanded[review.id]
                                    ? "Read less"
                                    : "Read more"}
                            </button>
                        )}
                    </div>
                ))}

                {/* Show all reviews button */}
                <div className="w-full flex justify-center items-center">
                    {reviews.length > 4 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="bg-[#131f2c] hover:bg-[#192634] text-white px-8 py-3 rounded-lg mt-4 cursor-pointer"
                        >
                            {showAll ? "Show less" : "Load More Reviews"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
