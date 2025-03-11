
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export const FAQ = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "What is DREAMAKER?",
      answer: "Create Your Own Virtual Music Stars Unleash your creativity and bring your musical visions to life with our cutting-edge AI-powered platform. Easily build unique virtual artist personas, complete with custom voice clones, stunning visuals, and original music - all without needing a band or recording studio. Our intuitive tools empower you to craft captivating personas that can perform, record, and even tour the digital world."
    },
    {
      question: "How much does DREAMAKER cost?",
      answer: "Our pricing is designed to be flexible and accessible. Contact us for detailed pricing information."
    },
    {
      question: "What features are available on Personas?",
      answer: "Our Personas feature includes voice cloning, style customization, and performance capabilities."
    },
    {
      question: "How can I make income using DREAMAKER?",
      answer: "You can monetize your virtual artists through various channels including streaming, digital performances, and merchandise."
    },
    {
      question: "How do I sign up for DREAMAKER?",
      answer: "Sign up is easy! Just click the register button and follow the simple steps to create your account."
    },
    {
      question: "What is the DREAMAKER free trial?",
      answer: "Our free trial lets you explore the basic features of DREAMAKER for a limited time."
    },
    {
      question: "How do I contact DREAMAKER customer support?",
      answer: "Our support team is available 24/7 through our help center and email support."
    },
    {
      question: "What are the DREAMAKER payment methods?",
      answer: "We accept all major credit cards, PayPal, and various other payment methods."
    }
  ];
  
  return (
    <div className="py-16 bg-dreamaker-bg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-4xl font-bold mb-2 text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400">Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about DREAMAKER</p>
          </div>
          <Button className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5 hover:bg-[#0EA5E9]/20">
            Ask a Question
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 bg-stone-950">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="transform transition-all duration-500 hover:-translate-y-1" 
              onMouseEnter={() => setHoveredIndex(index)} 
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index + 1}`} className="relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-md border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)]">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0EA5E9]/40 to-black/40 opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  
                  <AccordionTrigger className="relative z-10 px-6 py-6 hover:no-underline [&[data-state=open]>div]:text-[#0EA5E9] bg-dreamaker-bg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-[#0EA5E9]/20 group-hover:border-[#0EA5E9]/60">
                        <span className="text-xl text-white">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#0EA5E9] transition-colors">{faq.question}</h3>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="relative z-10 px-6 pb-6 text-gray-300 group-hover:text-white/90 transition-colors">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
