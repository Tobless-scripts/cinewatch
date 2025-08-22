import PopularSection from "@/components/movie/CineWatchPopular";
import ContinueWatching from "@/components/movie/ContinueWatching";
import React from "react";

const Streaming = () => {
    return (
        <div className="bg-[#0a1929]">
            <ContinueWatching />
            <PopularSection />
        </div>
    );
};

export default Streaming;
