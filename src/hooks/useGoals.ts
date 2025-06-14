import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  user_id: string;
  goal_text: string;
  target_date?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        method: 'GET',
      });

      if (error) throw error;

      setGoals(data.goals || []);
      return data.goals || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch goals.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createGoal = useCallback(async (goalText: string, targetDate?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        method: 'POST',
        body: {
          goal_text: goalText,
          target_date: targetDate,
        },
      });

      if (error) throw error;

      const newGoal = data.goal;
      setGoals(prev => [newGoal, ...prev]);

      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully.",
      });

      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-goals?' + new URLSearchParams({ id: goalId }), {
        method: 'PUT',
        body: updates,
      });

      if (error) throw error;

      const updatedGoal = data.goal;
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      ));

      toast({
        title: "Goal Updated",
        description: "Your goal has been updated successfully.",
      });

      return updatedGoal;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteGoal = useCallback(async (goalId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('manage-goals?' + new URLSearchParams({ id: goalId }), {
        method: 'DELETE',
      });

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));

      toast({
        title: "Goal Deleted",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleGoalCompletion = useCallback(async (goalId: string, isCompleted: boolean) => {
    return updateGoal(goalId, { is_completed: isCompleted });
  }, [updateGoal]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleGoalCompletion,
  };
};