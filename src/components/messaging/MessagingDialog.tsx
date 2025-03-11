
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface MessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  initialMessage?: string;
}

export const MessagingDialog = ({ 
  open, 
  onOpenChange, 
  recipientId,
  recipientName,
  initialMessage
}: MessagingDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  
  useEffect(() => {
    // Set initial message if provided
    if (initialMessage && open) {
      setNewMessage(initialMessage);
    }
    
    // Load existing messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error loading messages:', error);
        return;
      }
      
      setMessages(data || []);
    };

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${recipientId},recipient_id=eq.${user?.id}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    if (open) {
      loadMessages();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, user?.id, recipientId, initialMessage]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('direct_messages')
      .insert({
        content: newMessage,
        sender_id: user.id,
        recipient_id: recipientId
      });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage("");
  };

  const clearMessages = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('direct_messages')
      .delete()
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

    if (error) {
      console.error('Error clearing messages:', error);
      toast.error("Failed to clear messages");
      return;
    }

    setMessages([]);
    toast.success("Messages cleared successfully");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col gap-0 p-0">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Message {recipientName}</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearMessages}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender_id === user?.id
                      ? 'bg-dreamaker-purple text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-50">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
