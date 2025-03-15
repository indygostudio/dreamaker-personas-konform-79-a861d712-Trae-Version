import { Database } from "lucide-react";

export const SupabaseView = () => {
  return (
    <div className="h-full bg-black/20 p-2">
      <div className="flex flex-col items-center justify-center h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 p-6">
        <Database className="w-16 h-16 text-konform-neon-blue mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Subase Database</h2>
        <p className="text-gray-400 text-center max-w-md">
          Connect and manage your Subase database, tables, and queries.
        </p>
      </div>
    </div>
  );
};