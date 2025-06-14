import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DailySummary {
  date: string;
  total_sessions: number;
  completed_sessions: number;
  total_focus_time_seconds: number;
  total_focus_time_formatted: string;
  average_session_duration_seconds: number;
  average_session_duration_formatted: string;
  average_productivity_score: number;
  usage_breakdown: Array<{
    source_type: string;
    source_name: string;
    total_duration: number;
    session_count: number;
  }>;
  active_goals: number;
  sessions: Array<any>;
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getDailySummary = useCallback(async (date?: string): Promise<DailySummary | null> => {
    setLoading(true);
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase.functions.invoke('get-summary?' + new URLSearchParams({ date: targetDate }));

      if (error) throw error;

      return data.summary;
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch daily summary.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getWeeklySummary = useCallback(async (): Promise<DailySummary[]> => {
    const summaries: DailySummary[] = [];
    const today = new Date();
    
    // Get summaries for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const summary = await getDailySummary(dateString);
      if (summary) {
        summaries.push(summary);
      }
    }
    
    return summaries;
  }, [getDailySummary]);

  const getMonthlySummary = useCallback(async (): Promise<DailySummary[]> => {
    const summaries: DailySummary[] = [];
    const today = new Date();
    
    // Get summaries for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const summary = await getDailySummary(dateString);
      if (summary) {
        summaries.push(summary);
      }
    }
    
    return summaries;
  }, [getDailySummary]);

  const getFocusSessions = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('focus_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00.000Z`);
      }
      
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59.999Z`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
      return [];
    }
  }, []);

  const getUsageLogs = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('usage_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching usage logs:', error);
      return [];
    }
  }, []);

  return {
    loading,
    getDailySummary,
    getWeeklySummary,
    getMonthlySummary,
    getFocusSessions,
    getUsageLogs,
  };
};