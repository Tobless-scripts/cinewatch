import CategorySelector from "@/components/HomeComp/CategoriesSection";
import HeroSection from "@/components/HomeComp/HeroSection";
import PopularSection from "@/components/HomeComp/PopularSection";
import TrendingSection from "@/components/HomeComp/TrendingSection";
import UpcomingSection from "@/components/HomeComp/Upcoming";

const Homepage = () => {
    return (
        <div>
            <HeroSection />
            <TrendingSection />
            <CategorySelector />
            <UpcomingSection />
            <PopularSection />
        </div>
    );
};

export default Homepage;
