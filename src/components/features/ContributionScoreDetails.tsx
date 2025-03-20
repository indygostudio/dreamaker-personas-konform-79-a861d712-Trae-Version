import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, BarChart3, Star, TrendingUp } from 'lucide-react';

interface ContributionScoreData {
  id: string;
  contribution_id: string;
  volume_score: number;
  quality_score: number;
  impact_score: number;
  composite_score: number;
  last_updated: string;
  contribution?: {
    content_reference: string;
    contribution_type: 'audio' | 'lyrics' | 'other';
    created_at: string;
  };
}

export const ContributionScoreDetails = () => {
  const { toast } = useToast();
  const [contributions, setContributions] = useState<ContributionScoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  
  // Weights for score calculation
  const weights = {
    volume: 0.3,
    quality: 0.4,
    impact: 0.3
  };

  useEffect(() => {
    loadContributionScores();
  }, []);

  const loadContributionScores = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get user's contributions with their scores
      const { data, error } = await supabase
        .from('user_contributions')
        .select(`
          id,
          content_reference,
          contribution_type,
          created_at,
          contribution_scores (id, volume_score, quality_score, impact_score, composite_score, last_updated)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the data for display
      const formattedData: ContributionScoreData[] = [];
      let calculatedTotalScore = 0;
      
      data?.forEach(contribution => {
        if (contribution.contribution_scores && contribution.contribution_scores.length > 0) {
          const score = contribution.contribution_scores[0];
          formattedData.push({
            ...score,
            contribution: {
              content_reference: contribution.content_reference,
              contribution_type: contribution.contribution_type,
              created_at: contribution.created_at
            }
          });
          calculatedTotalScore += score.composite_score;
        }
      });

      setContributions(formattedData);
      setTotalScore(calculatedTotalScore);
    } catch (error) {
      console.error('Error loading contribution scores:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contribution scores',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    if (score >= 0.3) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-400';
    if (score >= 0.5) return 'bg-yellow-400';
    if (score >= 0.3) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContributionTypeIcon = (type: 'audio' | 'lyrics' | 'other') => {
    switch (type) {
      case 'audio':
        return '🎵';
      case 'lyrics':
        return '📝';
      default:
        return '🔍';
    }
  };

  return (
    <Card className="bg-black/40 border-dreamaker-purple/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Contribution Score Breakdown
        </CardTitle>
        <CardDescription>
          How your contribution scores are calculated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 p-4 bg-black/30 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-400">Volume Score</h3>
              </div>
              <p className="text-xs text-gray-400">
                Based on quantity metrics like duration, word count, or file size
              </p>
              <p className="text-sm text-gray-300">
                Weight: <span className="font-bold">{weights.volume * 100}%</span>
              </p>
            </div>
            
            <div className="space-y-2 p-4 bg-black/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-medium text-yellow-400">Quality Score</h3>
              </div>
              <p className="text-xs text-gray-400">
                Based on peer reviews, expert ratings, and content quality
              </p>
              <p className="text-sm text-gray-300">
                Weight: <span className="font-bold">{weights.quality * 100}%</span>
              </p>
            </div>
            
            <div className="space-y-2 p-4 bg-black/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-medium text-green-400">Impact Score</h3>
              </div>
              <p className="text-xs text-gray-400">
                Based on usage frequency and influence on AI-generated content
              </p>
              <p className="text-sm text-gray-300">
                Weight: <span className="font-bold">{weights.impact * 100}%</span>
              </p>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your Total Contribution Score</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{totalScore.toFixed(2)}</span>
              <span className="text-sm text-gray-400 mb-1">across {contributions.length} contributions</span>
            </div>
            <p className="text-xs text-gray-400">
              Your contribution score determines your equity percentage and royalty distributions in the Hivemind cooperative
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-black/60">
              <TabsTrigger value="all">All Contributions</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            {['all', 'audio', 'lyrics', 'other'].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {isLoading ? (
                      <p className="text-center text-gray-400">Loading contribution scores...</p>
                    ) : contributions.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No scored contributions found</p>
                    ) : (
                      contributions
                        .filter(c => tabValue === 'all' || c.contribution?.contribution_type === tabValue)
                        .map((contribution, index) => (
                          <div key={contribution.id} className="p-4 bg-black/20 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span>{getContributionTypeIcon(contribution.contribution?.contribution_type || 'other')}</span>
                                  <h4 className="font-medium truncate">
                                    {contribution.contribution?.content_reference.split('/').pop() || 'Untitled Contribution'}
                                  </h4>
                                </div>
                                <p className="text-xs text-gray-400">
                                  Added on {formatDate(contribution.contribution?.created_at || '')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${getScoreColor(contribution.composite_score)}`}>
                                  {contribution.composite_score.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-400">Composite Score</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-purple-400">Volume</span>
                                  <span>{contribution.volume_score.toFixed(2)}</span>
                                </div>
                                <Progress 
                                  value={contribution.volume_score * 100} 
                                  className="h-1.5" 
                                  indicatorClassName="bg-purple-400"
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-yellow-400">Quality</span>
                                  <span>{contribution.quality_score.toFixed(2)}</span>
                                </div>
                                <Progress 
                                  value={contribution.quality_score * 100} 
                                  className="h-1.5" 
                                  indicatorClassName="bg-yellow-400"
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-green-400">Impact</span>
                                  <span>{contribution.impact_score.toFixed(2)}</span>
                                </div>
                                <Progress 
                                  value={contribution.impact_score * 100} 
                                  className="h-1.5" 
                                  indicatorClassName="bg-green-400"
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-blue-400">Composite</span>
                                  <span>{contribution.composite_score.toFixed(2)}</span>
                                </div>
                                <Progress 
                                  value={contribution.composite_score * 100} 
                                  className="h-1.5" 
                                  indicatorClassName={getProgressColor(contribution.composite_score)}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};