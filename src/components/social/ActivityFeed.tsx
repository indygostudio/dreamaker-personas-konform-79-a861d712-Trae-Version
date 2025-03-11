
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Activity = Database["public"]["Tables"]["activities"]["Row"];

interface ActivityData {
  content: string;
}

const isActivityData = (data: unknown): data is ActivityData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    typeof (data as ActivityData).content === "string"
  );
};

const ActivityFeed = () => {
  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      {activities?.map((activity) => {
        const activityData = isActivityData(activity.data) 
          ? activity.data 
          : { content: "Unknown activity" };

        return (
          <div key={activity.id} className="bg-dreamaker-purple/10 rounded-lg p-4">
            <p className="text-white">{activityData.content}</p>
            <span className="text-sm text-gray-400">
              {new Date(activity.created_at).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
