import { motion } from 'framer-motion';
import { VideoBackground } from '@/components/dreamaker/VideoBackground';
import { useState } from 'react';
import { NavigationButton } from '@/components/persona/profile/header/NavigationButton';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Music, Mic2, ShoppingBag, Users, Award, ArrowRight } from 'lucide-react';

interface EarningOpportunityProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  earnings: string;
  videoUrl: string;
}

const EarningOpportunity = ({ title, description, icon, earnings, videoUrl }: EarningOpportunityProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Card 
      className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden relative h-[320px] transition-all duration-300 hover:border-[#0EA5E9]/40 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 z-0">
        <VideoBackground
          videoUrl={videoUrl}
          isHovering={isHovering}
          continuePlayback={false}
          darkness={0.7}
        />
      </div>
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] mr-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6 flex-grow">{description}</p>
        <div className="mt-auto">
          <div className="mb-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <p className="text-sm text-gray-400">Potential earnings</p>
            <p className="text-xl font-bold text-[#0EA5E9]">{earnings}</p>
          </div>
          <Button className="w-full bg-[#0EA5E9]/10 text-white border border-[#0EA5E9]/20 hover:bg-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)]">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Testimonial = ({ quote, author, role, imageUrl }: { quote: string, author: string, role: string, imageUrl: string }) => (
  <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-300 hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.2)]">
    <div className="flex items-start mb-4">
      <div className="mr-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={imageUrl} alt={author} className="w-full h-full object-cover" />
        </div>
      </div>
      <div>
        <p className="text-gray-300 italic mb-4">"{quote}"</p>
        <p className="text-white font-semibold">{author}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

export const Earn = () => {
  const earningOpportunities = [
    {
      title: "Voice Model Marketplace",
      description: "Create and sell unique AI voice models. Set your own prices and earn royalties every time your voice is used.",
      icon: <Mic2 className="h-6 w-6" />,
      earnings: "$500 - $5,000 / month",
      videoUrl: "/Videos/Gen-3 Alpha 3499529498, A close-up of a goth, dreammakerstudio_htt, M 5.mp4"
    },
    {
      title: "Music Licensing",
      description: "License your AI-generated music for use in videos, games, and other media. Earn passive income from your creations.",
      icon: <Music className="h-6 w-6" />,
      earnings: "$200 - $2,000 / month",
      videoUrl: "/Videos/MIXER_01.mp4"
    },
    {
      title: "Persona Marketplace",
      description: "Design and sell complete AI personas with unique voices, styles, and visual identities for others to use in their projects.",
      icon: <Users className="h-6 w-6" />,
      earnings: "$1,000 - $10,000 / month",
      videoUrl: "/Videos/Gen-3 Alpha 1425044134, Handsome country sin, image-prompt, M 5.mp4"
    },
    {
      title: "Beat Production",
      description: "Create and sell beats, loops, and samples using our AI tools. Build your reputation as a producer in our community.",
      icon: <ShoppingBag className="h-6 w-6" />,
      earnings: "$300 - $3,000 / month",
      videoUrl: "/Videos/DREAMAKER_01.mp4"
    },
    {
      title: "Creator Program",
      description: "Join our exclusive creator program to get early access to new features, promotional opportunities, and revenue sharing.",
      icon: <Award className="h-6 w-6" />,
      earnings: "$1,500 - $15,000 / month",
      videoUrl: "/Videos/PORTAL_01.mp4"
    },
    {
      title: "Royalty System",
      description: "Earn ongoing royalties from your content through our transparent blockchain-based tracking and distribution system.",
      icon: <DollarSign className="h-6 w-6" />,
      earnings: "Varies based on usage",
      videoUrl: "/Videos/Gen-3 Alpha 2345214770, digital brain on rot, imagepng (8), M 5.mp4"
    }
  ];

  const testimonials = [
    {
      quote: "I've been able to quit my day job thanks to the income from my voice models on DREAMAKER. The platform makes it so easy to create and monetize my work.",
      author: "Sarah Johnson",
      role: "Voice Artist",
      imageUrl: "/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png"
    },
    {
      quote: "The royalty system is incredibly transparent. I can see exactly where my music is being used and how much I'm earning in real-time.",
      author: "Marcus Chen",
      role: "Music Producer",
      imageUrl: "/lovable-uploads/c83df97a-619d-42c9-b61f-d26f2549e849.png"
    },
    {
      quote: "Creating personas has become my full-time business. The demand is incredible, and the tools make it possible to create unique, high-quality personas quickly.",
      author: "Aisha Williams",
      role: "Persona Creator",
      imageUrl: "/lovable-uploads/a4975e49-91b3-4923-85ca-6916aa5bd37e.png"
    }
  ];

  return (
    <div className="min-h-screen relative bg-black flex flex-col">
      {/* Solid black background */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Removed VideoBackground component */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 mt-[74px] flex-grow">
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
              Monetize Your Creativity
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Turn your passion into profit with multiple revenue streams on our platform
            </p>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-300 hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.2)]">
                <div className="p-3 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] inline-block mb-4">1</div>
                <h3 className="text-xl font-bold text-white mb-2">Create</h3>
                <p className="text-gray-300">Use our AI-powered tools to create unique voice models, personas, music, and more.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-300 hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.2)]">
                <div className="p-3 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] inline-block mb-4">2</div>
                <h3 className="text-xl font-bold text-white mb-2">Publish</h3>
                <p className="text-gray-300">List your creations on our marketplace with your own pricing and licensing terms.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-300 hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.2)]">
                <div className="p-3 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] inline-block mb-4">3</div>
                <h3 className="text-xl font-bold text-white mb-2">Earn</h3>
                <p className="text-gray-300">Get paid when others purchase or license your content, with transparent royalty tracking.</p>
              </div>
            </div>
          </div>

          {/* Earning Opportunities Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">Earning Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {earningOpportunities.map((opportunity, index) => (
                <EarningOpportunity
                  key={index}
                  title={opportunity.title}
                  description={opportunity.description}
                  icon={opportunity.icon}
                  earnings={opportunity.earnings}
                  videoUrl={opportunity.videoUrl}
                />
              ))}
            </div>
          </div>

          {/* Success Stories Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">Creator Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  imageUrl={testimonial.imageUrl}
                />
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">How do payouts work?</h3>
                <p className="text-gray-300">Payouts are processed monthly for all earnings above $50. We support multiple payment methods including PayPal, bank transfers, and cryptocurrency.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">What's the revenue split?</h3>
                <p className="text-gray-300">Creators receive 70% of all sales and licensing fees. Our platform fee of 30% covers hosting, promotion, and ongoing development of our tools.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">Do I own my content?</h3>
                <p className="text-gray-300">Yes, you retain full ownership of all content you create. Our terms of service grant us a license to display and distribute your content on our platform only.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">How do I get started?</h3>
                <p className="text-gray-300">Sign up for an account, complete your creator profile, and start uploading your content. Our onboarding process will guide you through setting up your first listing.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">Ready to Start Earning?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of creators who are already monetizing their creativity on our platform.</p>
            <Button className="px-8 py-6 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white rounded-full text-lg font-bold">
              Create Your Creator Account
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};