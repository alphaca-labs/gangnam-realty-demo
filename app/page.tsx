import HeroSearch from "@/components/home/HeroSearch";
import QuickMenu from "@/components/home/QuickMenu";
import TrendCards from "@/components/home/TrendCards";
import ComparisonBanner from "@/components/home/ComparisonBanner";
import MapPreview from "@/components/home/MapPreview";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <QuickMenu />
      <TrendCards />
      <ComparisonBanner />
      <MapPreview />
    </>
  );
}
