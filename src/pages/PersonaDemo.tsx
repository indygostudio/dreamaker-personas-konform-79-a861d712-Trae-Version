
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Persona } from "@/types/persona";
import { transformPersonaData } from "@/lib/utils/personaTransform";

interface PersonaDemoProps {
  id?: string;
}

const PersonaDemo = ({ id: propId }: PersonaDemoProps) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = propId || paramId;

  const { data: persona } = useQuery({
    queryKey: ["persona", id],
    queryFn: async () => {
      if (!id) throw new Error("No persona ID provided");

      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return transformPersonaData(data);
    },
  });

  if (!persona) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[2400px] mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative z-50">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-white hover:text-dreamaker-purple hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="space-y-8 mt-4">
            <div className="flex items-center gap-4">
              {persona.avatar_url && (
                <img 
                  src={persona.avatar_url} 
                  alt={persona.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-white">{persona.name}</h1>
                <p className="text-gray-400">{persona.description}</p>
              </div>
            </div>

            <div className="bg-dreamaker-gray/50 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Featured Tracks</h2>
              <div className="space-y-4">
                {persona.featured_works.map((work, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-black/30 hover:bg-dreamaker-purple/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{work.title}</h3>
                      <p className="text-gray-400 text-sm">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDemo;
