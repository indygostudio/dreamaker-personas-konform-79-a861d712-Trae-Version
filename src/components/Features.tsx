
import { useState } from "react";
import { FeatureCards } from "./features/FeatureCards";
import { KonformSection } from "./features/KonformSection";
import { PersonaSection } from "./features/PersonaSection";
import { MarketplaceSection } from "./features/MarketplaceSection";
import { DreamakerSection } from "./features/DreamakerSection";
import { FAQ } from "./features/FAQ";
import { PricingPlans } from "./features/PricingPlans";

export const Features = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="pt-4 bg-dreamaker-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white font-syne">Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-syne">
            Create your virtual artist persona with advanced AI technology and produce professional music with our integrated AI DAW
          </p>
        </div>

        <FeatureCards />
        <div id="dreamaker-section">
          <DreamakerSection />
        </div>
        <div id="personas-section">
          <PersonaSection />
        </div>
        <div id="konform-section">
          <KonformSection />
        </div>
        
        {/* Pricing Section */}
        <section className="py-24 bg-black/40">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-syne text-white">
                Choose Your Plan
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Select the perfect plan for your creative journey
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border ${
                    billingInterval === 'monthly'
                      ? 'bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5'
                      : 'bg-transparent border-[#0EA5E9]/20 text-white hover:bg-[#0EA5E9]/10 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border ${
                    billingInterval === 'yearly'
                      ? 'bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5'
                      : 'bg-transparent border-[#0EA5E9]/20 text-white hover:bg-[#0EA5E9]/10 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <PricingPlans billingInterval={billingInterval} />
          </div>
        </section>

        <FAQ />
      </div>
    </div>
  );
};
