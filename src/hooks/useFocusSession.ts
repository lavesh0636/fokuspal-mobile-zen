import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FocusSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  productivity_score?: number;
  created_at: string;
  updated_at: string;
}

export const useFocusSession = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSession = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('start-session', {
        method: 'POST',
      });

      if (error) throw error;

      const session: FocusSession = {
        id: data.session_id,
        user_id: '', // Will be populated by the backend
        start_time: data.start_time,
        created_at: data.start_time,
        updated_at: data.start_time,
      };

      setCurrentSession(session);
      toast({
        title: "Focus Session Started",
        description: "Your productivity session has begun. Stay focused!",
      });

      return session;
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start focus session. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const endSession = useCallback(async (productivityScore?: number) => {
    if (!currentSession) {
      throw new Error('No active session to end');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('end-session', {
        method: 'POST',
        body: {
          session_id: currentSession.id,
          productivity_score: productivityScore,
        },
      });

      if (error) throw error;

      const updatedSession = data.session;
      setCurrentSession(null);

      toast({
        title: "Session Complete!",
        description: `Great job! You focused for ${Math.round(updatedSession.duration_seconds / 60)} minutes.`,
      });

      return updatedSession;
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end focus session. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentSession, toast]);

  const logUsage = useCallback(async (
    sessionId: string,
    sourceType: 'app' | 'domain',
    sourceName: string,
    durationSeconds: number
  ) => {
    try {
      const { error } = await supabase.functions.invoke('log-usage', {
        method: 'POST',
        body: {
          session_id: sessionId,
          source_type: sourceType,
          source_name: sourceName,
          duration_seconds: durationSeconds,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging usage:', error);
      // Don't show toast for usage logging errors as they happen frequently
    }
  }, []);

  return {
    currentSession,
    loading,
    startSession,
    endSession,
    logUsage,
  };
};