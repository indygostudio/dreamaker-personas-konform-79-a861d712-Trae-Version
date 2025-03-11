import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
interface PricingPlan {
  name: string;
  price: string;
  interval: string;
  description: string;
  priceId: string;
  color: string;
  bgColor: string;
  video?: string;
  icon: React.ReactNode;
}
interface PricingPlansProps {
  billingInterval: 'monthly' | 'yearly';
}
export const PricingPlans = ({
  billingInterval
}: PricingPlansProps) => {
  const {
    toast
  } = useToast();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const handleSubscribe = async (priceId: string) => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe to a plan.",
          variant: "destructive"
        });
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId
        }
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to start subscription process. Please try again.",
        variant: "destructive"
      });
    }
  };
  const plans: PricingPlan[] = [{
    name: "Basic Plan",
    price: billingInterval === 'monthly' ? '$9.99' : '$99.99',
    interval: billingInterval === 'monthly' ? '/month' : '/year',
    description: "Enjoy an extensive library of Artists, featuring a range of content, including recently released titles.",
    priceId: "price_1Qhnh7B1FpKQEw9IpghDAPOG",
    color: 'border-purple-500/20 group-hover:border-purple-500/60',
    bgColor: 'from-purple-900/40 to-black/40',
    video: '/Videos/Wormhole.gif',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 20V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" /></svg>
  }, {
    name: "Standard Plan",
    price: billingInterval === 'monthly' ? '$29.99' : '$299.99',
    interval: billingInterval === 'monthly' ? '/month' : '/year',
    description: "Access to a wider selection of features, including most new releases and exclusive content 5000 Tokens",
    priceId: "price_1Qhnh7B1FpKQEw9IpghDAPOG",
    color: 'border-blue-500/20 group-hover:border-blue-500/60',
    bgColor: 'from-blue-900/40 to-black/40',
    video: '/Videos/Wormhole.gif',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
  }, {
    name: "Premium Plan",
    price: billingInterval === 'monthly' ? '$59.99' : '$599.99',
    interval: billingInterval === 'monthly' ? '/month' : '/year',
    description: "Access to a widest selection of features, including all new releases and Collabs and 10,000 Tokens.",
    priceId: "price_1Qhnh7B1FpKQEw9IpghDAPOG",
    color: 'border-emerald-500/20 group-hover:border-emerald-500/60',
    bgColor: 'from-emerald-900/40 to-black/40',
    video: '/Videos/Wormhole.gif',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2 12h20" /><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m19.07 4.93-14.14 14.14" /></svg>
  }];
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => <div key={index} className="group transform transition-all duration-500 hover:-translate-y-1" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
          <div className={`relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-md border ${plan.color} transition-all duration-500 hover:shadow-lg h-[300px]`}>
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {plan.video && <VideoBackground videoUrl={plan.video} isHovering={hoveredIndex === index} fallbackImage="/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png" continuePlayback={false} reverseOnEnd={true} />}
              <div className={`absolute inset-0 bg-gradient-to-b ${plan.bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
            </div>
            
            <div className="absolute inset-0 flex flex-col p-6 bg-zinc-950">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full bg-black/60 backdrop-blur-sm ${plan.color}`}>
                  {plan.icon}
                </div>
                
                <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <span className="text-xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.interval}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-2 font-syne tracking-wide group-hover:text-dreamaker-purple transition-colors">
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-2 group-hover:text-white transition-colors">
                  {plan.description}
                </p>
                
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex gap-2">
                  <Button variant="outline" size="sm" className={`bg-black/50 text-white hover:bg-black/70 border-0 hover:border hover:${plan.color}`} onClick={() => handleSubscribe(plan.priceId)}>
                    Free Trial
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm" onClick={() => handleSubscribe(plan.priceId)}>
                    Choose Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};