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
    const { session_id, source_type, source_name, duration_seconds } = await req.json();

    // Validate required fields
    if (!session_id || !source_type || !source_name || duration_seconds === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'session_id, source_type, source_name, and duration_seconds are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate source_type
    if (!['app', 'domain'].includes(source_type)) {
      return new Response(
        JSON.stringify({ error: 'source_type must be either "app" or "domain"' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabaseClient
      .from('focus_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found or does not belong to user' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create usage log entry
    const { data: usageLog, error } = await supabaseClient
      .from('usage_logs')
      .insert({
        user_id: user.id,
        session_id,
        source_type,
        source_name,
        duration_seconds,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating usage log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log usage' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Usage logged:', usageLog.id, 'for session:', session_id);

    return new Response(
      JSON.stringify({ 
        usage_log: usageLog,
        message: 'Usage logged successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in log-usage function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});