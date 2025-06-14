import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  user_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

export const useAIAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const askAI = useCallback(async (prompt: string, context?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        method: 'POST',
        body: {
          prompt,
          context,
        },
      });

      if (error) throw error;

      return data.response;
    } catch (error) {
      console.error('Error asking AI:', error);
      toast({
        title: "AI Assistant Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getChatHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setChatHistory(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }, []);

  const clearChatHistory = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('ai_chat_history')
        .delete()
        .not('id', 'is', null); // Delete all user's chat history

      if (error) throw error;

      setChatHistory([]);
      toast({
        title: "Chat History Cleared",
        description: "Your conversation history has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast({
        title: "Error",
        description: "Failed to clear chat history.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    loading,
    chatHistory,
    askAI,
    getChatHistory,
    clearChatHistory,
  };
};