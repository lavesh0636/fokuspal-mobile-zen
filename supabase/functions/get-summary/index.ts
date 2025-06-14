import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get focus sessions for the date
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at', `${date}T23:59:59.999Z`)
      .order('created_at', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sessions' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get usage logs for the date
    const { data: usageLogs, error: usageError } = await supabaseClient
      .from('usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date);

    if (usageError) {
      console.error('Error fetching usage logs:', usageError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch usage logs' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate statistics
    const completedSessions = sessions?.filter(s => s.end_time) || [];
    const totalSessions = sessions?.length || 0;
    const totalFocusTime = completedSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const averageSessionDuration = completedSessions.length > 0 ? totalFocusTime / completedSessions.length : 0;
    const totalProductivityScore = completedSessions.reduce((sum, session) => sum + (session.productivity_score || 0), 0);
    const averageProductivityScore = completedSessions.length > 0 ? totalProductivityScore / completedSessions.length : 0;

    // Group usage logs by source
    const usageBySource = (usageLogs || []).reduce((acc: any, log) => {
      const key = `${log.source_type}:${log.source_name}`;
      if (!acc[key]) {
        acc[key] = {
          source_type: log.source_type,
          source_name: log.source_name,
          total_duration: 0,
          session_count: 0,
        };
      }
      acc[key].total_duration += log.duration_seconds;
      acc[key].session_count += 1;
      return acc;
    }, {});

    // Get goals for context
    const { data: goals, error: goalsError } = await supabaseClient
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .order('created_at', { ascending: true });

    const summary = {
      date,
      total_sessions: totalSessions,
      completed_sessions: completedSessions.length,
      total_focus_time_seconds: totalFocusTime,
      total_focus_time_formatted: formatDuration(totalFocusTime),
      average_session_duration_seconds: Math.round(averageSessionDuration),
      average_session_duration_formatted: formatDuration(averageSessionDuration),
      average_productivity_score: Math.round(averageProductivityScore),
      usage_breakdown: Object.values(usageBySource),
      active_goals: goals?.length || 0,
      sessions: sessions || [],
    };

    console.log('Summary generated for user:', user.id, 'date:', date);

    return new Response(
      JSON.stringify({ 
        summary,
        message: 'Summary generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-summary function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}