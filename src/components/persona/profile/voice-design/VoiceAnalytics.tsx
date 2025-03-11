
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { VoiceAnalytics as VoiceAnalyticsType } from '@/types/voice';

export const VoiceAnalytics = () => {
  const { data: analytics, isLoading } = useQuery<VoiceAnalyticsType>({
    queryKey: ['voice-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_analytics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = [
    {
      name: 'Conversions',
      value: analytics?.total_conversions || 0,
    },
    {
      name: 'Duration (min)',
      value: (analytics?.total_duration || 0) / 60,
    },
    {
      name: 'Avg Time (s)',
      value: analytics?.avg_conversion_time || 0,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Conversions</p>
          <p className="text-2xl font-bold">{analytics?.total_conversions || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Duration</p>
          <p className="text-2xl font-bold">{((analytics?.total_duration || 0) / 60).toFixed(1)}m</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg Conversion Time</p>
          <p className="text-2xl font-bold">{(analytics?.avg_conversion_time || 0).toFixed(1)}s</p>
        </Card>
      </div>
      <Card className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
