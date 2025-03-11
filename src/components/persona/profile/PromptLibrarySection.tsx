
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PromptLibraryProps {
  personaId: string;
}

interface PromptItem {
  id: string;
  title?: string;
  prompt?: string;
  generated_content?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  persona_id?: string;
  generation_type: string;
  params?: any;
  result?: any;
}

export const PromptLibrarySection = ({ personaId }: PromptLibraryProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  const { data: prompts, isLoading, refetch } = useQuery({
    queryKey: ['ai-prompts', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('persona_id', personaId)
        .eq('generation_type', 'text')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (prompts && prompts.length > 0 && !selectedPrompt) {
      setSelectedPrompt(prompts[0]);
    }
  }, [prompts, selectedPrompt]);

  const handleDeletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Prompt deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading prompts...</div>;
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">No generated prompts yet.</p>
        <p>Create text in the AI Studio tab to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {selectedPrompt ? (
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">{selectedPrompt.title || 'Generated Text'}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopyToClipboard(selectedPrompt.generated_content || '')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-300">
                {selectedPrompt.generated_content}
              </p>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Generated on {new Date(selectedPrompt.created_at).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-black/40 rounded-lg">
            <p className="text-gray-400">Select a prompt to view</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Generated Prompts</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {prompts.map((prompt: PromptItem) => (
            <Card 
              key={prompt.id} 
              className={`p-4 cursor-pointer transition-all ${
                selectedPrompt?.id === prompt.id ? 'ring-2 ring-dreamaker-purple bg-black/40' : 'bg-black/20 hover:bg-black/30'
              }`}
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm line-clamp-1">
                  {prompt.title || 'Generated Text'}
                </h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePrompt(prompt.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                {prompt.prompt || (prompt.generated_content?.substring(0, 100) + '...')}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(prompt.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
