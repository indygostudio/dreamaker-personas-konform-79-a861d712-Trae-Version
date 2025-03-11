
import { Link } from "react-router-dom";
import { GenreGrid } from "./GenreGrid";
import { PersonaSplineSection } from "./PersonaSplineSection";

export const PersonaSection = () => {
  return (
    <div className="relative pt-24 pb-16 bg-black">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-8 text-white">PERSONAS</h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-lg leading-relaxed">
            Clone Voices, Craft Personas. Our voice cloning studio lets you build rich, expressive voice profiles tailored to your artistic needs. Simply upload voice samples, train the AI model, and fine-tune every nuance - from accent and pitch to vocal style and genre. Pair these custom voices with detailed character backstories, visual identities, and persona-driven content to create virtual artists that feel alive.
          </p>
        </div>

        <PersonaSplineSection />

        <Link to="/personas" className="block relative mb-16 group">
          
        </Link>

        <GenreGrid />
      </div>
    </div>
  );
};
