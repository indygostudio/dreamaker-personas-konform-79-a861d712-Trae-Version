
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[2400px] mx-auto">
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
