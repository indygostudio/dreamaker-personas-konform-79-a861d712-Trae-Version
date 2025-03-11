import { motion } from 'framer-motion';
import { VideoBackground } from '@/components/dreamaker/VideoBackground';
import { PricingPlans } from '@/components/features/PricingPlans';
import { useState } from 'react';
import { NavigationButton } from '@/components/persona/profile/header/NavigationButton';

export const Pricing = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen relative bg-black">
      {/* Video Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <VideoBackground
          videoUrl="/Videos/KONFORM_BG_04.mp4"
          isHovering={false}
          continuePlayback={true}
          reverseOnEnd={true}
          autoPlay={true}
          darkness={0.7}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 mt-[74px]">
        <div className="absolute top-4 left-4">
          <NavigationButton />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-syne text-white">
              Choose Your Plan
            </h1>
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
                <span className="ml-2 text-sm text-emerald-400">Save 20%</span>
              </button>
            </div>
          </div>

          <PricingPlans billingInterval={billingInterval} />

          {/* Feature Comparison Table */}
          <div className="mt-24 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-6 text-left text-gray-400">Features</th>
                    <th className="py-4 px-6 text-center text-white">Basic</th>
                    <th className="py-4 px-6 text-center text-white">Standard</th>
                    <th className="py-4 px-6 text-center text-white">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">AI Voice Generation</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">Monthly Tokens</td>
                    <td className="py-4 px-6 text-center text-gray-400">1,000</td>
                    <td className="py-4 px-6 text-center text-gray-400">5,000</td>
                    <td className="py-4 px-6 text-center text-gray-400">10,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">Custom Voice Models</td>
                    <td className="py-4 px-6 text-center text-gray-400">1</td>
                    <td className="py-4 px-6 text-center text-gray-400">3</td>
                    <td className="py-4 px-6 text-center text-gray-400">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">AI Music Generation</td>
                    <td className="py-4 px-6 text-center text-gray-400">Basic</td>
                    <td className="py-4 px-6 text-center text-gray-400">Advanced</td>
                    <td className="py-4 px-6 text-center text-gray-400">Professional</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">Collaboration Features</td>
                    <td className="py-4 px-6 text-center text-gray-400">-</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-gray-300">Priority Support</td>
                    <td className="py-4 px-6 text-center text-gray-400">-</td>
                    <td className="py-4 px-6 text-center text-gray-400">-</td>
                    <td className="py-4 px-6 text-center text-gray-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-12 text-white text-center">Frequently Asked Questions</h2>
            <div className="grid gap-8 max-w-4xl mx-auto">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Can I switch between plans?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-white">What happens when I run out of tokens?</h3>
                <p className="text-gray-400">You can purchase additional tokens or wait for your monthly renewal. Unused tokens roll over for up to 3 months.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Is there a free trial available?</h3>
                <p className="text-gray-400">Yes, all plans come with a 14-day free trial. You can explore all features before committing to a subscription.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};