import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

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
    const { prompt, context } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ API key not configured' }),
        { 
          status: 500, 
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

    // Prepare system message for focus coaching context
    const systemMessage = `You are FokusPal AI, a productivity and focus coach assistant. You help users stay focused, motivated, and productive. You provide:

1. Practical tips for maintaining focus and avoiding distractions
2. Motivational support and encouragement
3. Strategies for time management and productivity
4. Help with goal setting and achievement
5. Quick advice for overcoming procrastination

Keep your responses concise, actionable, and supportive. Focus on practical advice that users can implement immediately.`;

    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];

    // Add context if provided (like current session info, goals, etc.)
    if (context) {
      messages.splice(1, 0, { 
        role: "system", 
        content: `Additional context: ${JSON.stringify(context)}` 
      });
    }

    // Call GROQ API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('GROQ API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save chat history
    const { error: historyError } = await supabaseClient
      .from('ai_chat_history')
      .insert({
        user_id: user.id,
        user_message: prompt,
        ai_response: aiResponse,
      });

    if (historyError) {
      console.error('Error saving chat history:', historyError);
      // Don't fail the request if history saving fails
    }

    console.log('AI response generated for user:', user.id);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        message: 'AI response generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});