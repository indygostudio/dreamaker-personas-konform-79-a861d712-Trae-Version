
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationData {
  message: string;
}

const isNotificationData = (data: unknown): data is NotificationData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as NotificationData).message === "string"
  );
};

const NotificationList = () => {
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      {notifications?.map((notification) => {
        const notificationData = isNotificationData(notification.data)
          ? notification.data
          : { message: "Unknown notification" };

        return (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              notification.is_read
                ? "bg-dreamaker-purple/10"
                : "bg-dreamaker-purple/20"
            }`}
          >
            <p className="text-white">{notificationData.message}</p>
            <span className="text-sm text-gray-400">
              {new Date(notification.created_at).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
