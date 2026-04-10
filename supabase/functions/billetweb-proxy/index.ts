import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BILLETWEB_API = 'https://www.billetweb.fr/api';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Verify admin auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const userId = claimsData.claims.sub as string;

  // Check admin role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
  }

  const billetwebUser = Deno.env.get('BILLETWEB_USER');
  const billetwebKey = Deno.env.get('BILLETWEB_KEY');

  if (!billetwebUser || !billetwebKey) {
    return new Response(JSON.stringify({ error: 'Billetweb credentials not configured' }), { status: 500, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'attendees';

  try {
    const authParams = `user=${billetwebUser}&key=${billetwebKey}&version=1`;

    // Fetch events first to get event ID
    const eventsRes = await fetch(`${BILLETWEB_API}/events?${authParams}`);
    const events = await eventsRes.json();

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ events: [], attendees: [], availability: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const eventId = events[0].id;

    if (action === 'attendees') {
      const res = await fetch(`${BILLETWEB_API}/event/${eventId}/attendees?${authParams}`);
      const attendees = await res.json();
      return new Response(JSON.stringify({ event: events[0], attendees }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'availability') {
      const res = await fetch(`${BILLETWEB_API}/event/${eventId}/avail?${authParams}`);
      const availability = await res.json();
      return new Response(JSON.stringify({ event: events[0], availability }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'all') {
      const [attendeesRes, availRes] = await Promise.all([
        fetch(`${BILLETWEB_API}/event/${eventId}/attendees?${authParams}`),
        fetch(`${BILLETWEB_API}/event/${eventId}/avail?${authParams}`),
      ]);
      const [attendees, availability] = await Promise.all([
        attendeesRes.json(),
        availRes.json(),
      ]);
      return new Response(JSON.stringify({ event: events[0], attendees, availability }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('Billetweb API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch from Billetweb' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
