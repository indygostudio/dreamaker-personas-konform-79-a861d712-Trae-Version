
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export const CollaborationSection = () => {
  const { data: collaborations, isLoading } = useQuery({
    queryKey: ["public-collaborations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_collaborations")
        .select(`
          *,
          personas:personas(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-white">Loading collaborations...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collaborations?.map((collab) => (
        <Card key={collab.id} className="bg-black/40 backdrop-blur-sm border-dreamaker-purple/20 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-dreamaker-purple/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-dreamaker-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{collab.name}</h3>
              <p className="text-sm text-gray-400">
                {collab.personas?.length || 0} Personas Involved
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Status</span>
              <span className="capitalize">{collab.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Created</span>
              <span>{new Date(collab.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
