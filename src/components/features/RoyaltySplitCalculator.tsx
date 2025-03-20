import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Calculator, Users, Percent, DollarSign, Award } from 'lucide-react';
import { contributionService } from '@/services/contributionService';

interface ContributorData {
  id: string;
  name: string;
  avatar_url?: string;
  contribution_score: number;
  equity_percentage: number;
  royalty_share: number;
}

interface RoyaltyCalculation {
  totalRevenue: number;
  contributors: ContributorData[];
  calculationDate: string;
}

export const RoyaltySplitCalculator = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(1000); // Default $1000 for simulation
  const [calculations, setCalculations] = useState<RoyaltyCalculation[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');
  
  // Color scheme for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    loadContributors();
    loadPreviousCalculations();
  }, []);
  
  const loadContributors = async () => {
    try {
      setIsLoading(true);
      
      // Get all users with contribution scores
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, contribution_score')
        .gt('contribution_score', 0)
        .order('contribution_score', { ascending: false });
      
      if (error) throw error;
      
      // Get equity data for each user
      const contributorsWithEquity = await Promise.all(users.map(async (user) => {
        const { data: equity } = await supabase
          .from('user_equity')
          .select('equity_percentage')
          .eq('user_id', user.id)
          .single();
        
        return {
          id: user.id,
          name: user.full_name || 'Anonymous Contributor',
          avatar_url: user.avatar_url,
          contribution_score: user.contribution_score || 0,
          equity_percentage: equity?.equity_percentage || 0,
          royalty_share: 0 // Will be calculated when revenue is set
        };
      }));
      
      setContributors(contributorsWithEquity);
      calculateRoyalties(contributorsWithEquity, totalRevenue);
    } catch (error) {
      console.error('Error loading contributors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contributor data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadPreviousCalculations = async () => {
    try {
      // In a real implementation, you would load previous calculations from the database
      // For now, we'll just use a placeholder
      const mockCalculations: RoyaltyCalculation[] = [
        {
          totalRevenue: 5000,
          calculationDate: '2024-06-01',
          contributors: []
        },
        {
          totalRevenue: 7500,
          calculationDate: '2024-05-01',
          contributors: []
        }
      ];
      
      setCalculations(mockCalculations);
    } catch (error) {
      console.error('Error loading previous calculations:', error);
    }
  };
  
  const calculateRoyalties = (contributorList: ContributorData[], revenue: number) => {
    // Calculate total contribution score
    const totalScore = contributorList.reduce((sum, contributor) => sum + contributor.contribution_score, 0) || 1;
    
    // Calculate royalty share for each contributor
    const contributorsWithRoyalties = contributorList.map(contributor => {
      const sharePercentage = contributor.contribution_score / totalScore;
      return {
        ...contributor,
        royalty_share: revenue * sharePercentage
      };
    });
    
    setContributors(contributorsWithRoyalties);
  };
  
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTotalRevenue(value);
    calculateRoyalties(contributors, value);
  };
  
  const saveCalculation = async () => {
    try {
      // In a real implementation, you would save the calculation to the database
      // For now, we'll just add it to the local state
      const newCalculation: RoyaltyCalculation = {
        totalRevenue,
        contributors: [...contributors],
        calculationDate: new Date().toISOString().split('T')[0]
      };
      
      setCalculations([newCalculation, ...calculations]);
      
      toast({
        title: 'Calculation Saved',
        description: 'Royalty calculation has been saved successfully',
      });
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save calculation',
        variant: 'destructive'
      });
    }
  };
  
  const distributeRoyalties = async () => {
    try {
      setIsLoading(true);
      
      // Get current month in YYYY-MM format
      const currentMonth = new Date().toISOString().substring(0, 7);
      
      // Call the contribution service to calculate and distribute royalties
      await contributionService.calculateRoyaltyDistribution(currentMonth, totalRevenue);
      
      toast({
        title: 'Royalties Distributed',
        description: `$${totalRevenue.toFixed(2)} has been distributed to contributors for ${currentMonth}`,
      });
      
      // Save the calculation
      saveCalculation();
    } catch (error) {
      console.error('Error distributing royalties:', error);
      toast({
        title: 'Error',
        description: 'Failed to distribute royalties',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const pieChartData = contributors.map(contributor => ({
    name: contributor.name,
    value: contributor.royalty_share
  }));
  
  return (
    <Card className="bg-black/40 border-dreamaker-purple/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Royalty Split Calculator
        </CardTitle>
        <CardDescription>
          Calculate and distribute royalties based on contribution scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/60">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Total Revenue to Distribute ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={totalRevenue}
                    onChange={handleRevenueChange}
                    className="bg-black/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Contributors ({contributors.length})</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                    {isLoading ? (
                      <p className="text-center text-gray-400">Loading contributors...</p>
                    ) : contributors.length === 0 ? (
                      <p className="text-center text-gray-400">No contributors found</p>
                    ) : (
                      contributors.map((contributor, index) => (
                        <div key={contributor.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{contributor.name}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>Score: {contributor.contribution_score.toFixed(2)}</span>
                                <span>Equity: {contributor.equity_percentage.toFixed(2)}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${contributor.royalty_share.toFixed(2)}</p>
                              <p className="text-xs text-gray-400">
                                {(contributor.contribution_score / contributors.reduce((sum, c) => sum + c.contribution_score, 0) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          <Progress 
                            value={contributor.royalty_share / totalRevenue * 100} 
                            className="h-2" 
                            indicatorClassName={`bg-[${COLORS[index % COLORS.length]}]`}
                          />
                          {index < contributors.length - 1 && <Separator className="bg-gray-800 my-2" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={saveCalculation}
                    disabled={isLoading || contributors.length === 0}
                  >
                    Save Calculation
                  </Button>
                  <Button 
                    className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
                    onClick={distributeRoyalties}
                    disabled={isLoading || contributors.length === 0}
                  >
                    Distribute Royalties
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium mb-4">Royalty Distribution</h3>
                <div className="h-[300px] w-full">
                  {contributors.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Royalty Amount']}
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No data to display
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Royalties are calculated based on each contributor's score relative to the total score.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Previous Calculations</h3>
              
              {calculations.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No previous calculations found</p>
              ) : (
                calculations.map((calc, index) => (
                  <Card key={index} className="bg-black/30 border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md">{calc.calculationDate}</CardTitle>
                        <p className="text-lg font-bold">${calc.totalRevenue.toFixed(2)}</p>
                      </div>
                      <CardDescription>
                        Distributed to {calc.contributors.length} contributors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}