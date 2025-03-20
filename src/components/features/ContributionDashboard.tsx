import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RoyaltySplitCalculator } from './RoyaltySplitCalculator';
import { ContributionScoreDetails } from './ContributionScoreDetails';

interface ContributionStats {
  totalContributions: number;
  audioContributions: number;
  lyricsContributions: number;
  otherContributions: number;
  contributionScore: number;
  equityPercentage: number;
  monthlyRoyalties: number;
  totalRoyalties: number;
  creditsEarned: number;
}

interface ContributionHistory {
  month: string;
  contributions: number;
  royalties: number;
}

export const ContributionDashboard = () => {
  const [stats, setStats] = useState<ContributionStats>({
    totalContributions: 0,
    audioContributions: 0,
    lyricsContributions: 0,
    otherContributions: 0,
    contributionScore: 0,
    equityPercentage: 0,
    monthlyRoyalties: 0,
    totalRoyalties: 0,
    creditsEarned: 0
  });
  
  const [history, setHistory] = useState<ContributionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContributionData();
  }, []);

  const loadContributionData = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('contribution_score, credits_earned_from_contributions')
        .eq('id', session.user.id)
        .single();

      // Get user equity data
      const { data: equity } = await supabase
        .from('user_equity')
        .select('equity_percentage')
        .eq('user_id', session.user.id)
        .single();

      // Get contribution counts
      const { data: contributions, error: contribError } = await supabase
        .from('user_contributions')
        .select('contribution_type')
        .eq('user_id', session.user.id);

      if (contribError) throw contribError;

      // Get royalty distribution data
      const { data: royalties, error: royaltyError } = await supabase
        .from('royalty_distributions')
        .select('distribution_period, royalty_amount')
        .eq('user_id', session.user.id)
        .order('distribution_period', { ascending: false });

      if (royaltyError) throw royaltyError;

      // Calculate contribution stats
      const audioCount = contributions?.filter(c => c.contribution_type === 'audio').length || 0;
      const lyricsCount = contributions?.filter(c => c.contribution_type === 'lyrics').length || 0;
      const otherCount = contributions?.filter(c => c.contribution_type === 'other').length || 0;
      const totalCount = audioCount + lyricsCount + otherCount;

      // Calculate total and monthly royalties
      const totalRoyalties = royalties?.reduce((sum, r) => sum + r.royalty_amount, 0) || 0;
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
      const monthlyRoyalties = royalties?.find(r => r.distribution_period === currentMonth)?.royalty_amount || 0;

      // Prepare history data for chart
      const historyData = royalties?.map(r => ({
        month: r.distribution_period,
        royalties: r.royalty_amount,
        contributions: 0 // We'll need to fetch this separately in a real implementation
      })) || [];

      setStats({
        totalContributions: totalCount,
        audioContributions: audioCount,
        lyricsContributions: lyricsCount,
        otherContributions: otherCount,
        contributionScore: profile?.contribution_score || 0,
        equityPercentage: equity?.equity_percentage || 0,
        monthlyRoyalties,
        totalRoyalties,
        creditsEarned: profile?.credits_earned_from_contributions || 0
      });

      setHistory(historyData);
    } catch (error) {
      console.error('Error loading contribution data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contribution data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contribution Score</CardTitle>
            <CardDescription>Your overall contribution rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contributionScore.toFixed(2)}</div>
            <Progress value={Math.min(stats.contributionScore * 10, 100)} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Equity Share</CardTitle>
            <CardDescription>Your stake in Hivemind</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.equityPercentage.toFixed(4)}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Royalties</CardTitle>
            <CardDescription>Current month earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.monthlyRoyalties.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Credits Earned</CardTitle>
            <CardDescription>From your contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.creditsEarned}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="royalties">Royalties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card className="bg-black/40 border-dreamaker-purple/20">
            <CardHeader>
              <CardTitle>Contribution Summary</CardTitle>
              <CardDescription>Your contribution activity and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="contributions" name="Contributions" fill="#8884d8" />
                    <Bar dataKey="royalties" name="Royalties ($)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Total Contributions</h4>
                  <p className="text-2xl font-bold">{stats.totalContributions}</p>
                  <div className="text-xs text-gray-400">
                    <span className="text-purple-400">{stats.audioContributions} Audio</span> • 
                    <span className="text-blue-400"> {stats.lyricsContributions} Lyrics</span> • 
                    <span className="text-green-400"> {stats.otherContributions} Other</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Total Royalties Earned</h4>
                  <p className="text-2xl font-bold">${stats.totalRoyalties.toFixed(2)}</p>
                  <div className="text-xs text-gray-400">Lifetime earnings from your contributions</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Contributor Status</h4>
                  <p className="text-2xl font-bold capitalize">Active</p>
                  <div className="text-xs text-gray-400">Keep contributing to increase your equity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contributions" className="mt-4">
          <div className="space-y-6">
            <Card className="bg-black/40 border-dreamaker-purple/20">
              <CardHeader>
                <CardTitle>Your Contributions</CardTitle>
                <CardDescription>All content you've contributed to Hivemind</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {isLoading ? (
                      <p className="text-center text-gray-400">Loading your contributions...</p>
                    ) : stats.totalContributions === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">You haven't made any contributions yet.</p>
                        <Button className="bg-dreamaker-purple hover:bg-dreamaker-purple-light">
                          Start Contributing
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400">Your contribution history will appear here.</p>
                      // In a real implementation, we would map through actual contribution data
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <ContributionScoreDetails />
          </div>
        </TabsContent>
        
        <TabsContent value="royalties" className="mt-4">
          <div className="space-y-6">
            <Card className="bg-black/40 border-dreamaker-purple/20">
              <CardHeader>
                <CardTitle>Royalty Distributions</CardTitle>
                <CardDescription>Your earnings from the Hivemind cooperative</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {isLoading ? (
                      <p className="text-center text-gray-400">Loading royalty data...</p>
                    ) : history.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No royalty distributions yet.</p>
                    ) : (
                      history.map((item, index) => (
                        <div key={index} className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{item.month}</h4>
                              <p className="text-sm text-gray-400">Monthly distribution</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${item.royalties.toFixed(2)}</p>
                              <p className="text-xs text-gray-400">Based on {item.contributions} contributions</p>
                            </div>
                          </div>
                          {index < history.length - 1 && <Separator className="mt-3 bg-gray-800" />}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <RoyaltySplitCalculator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};