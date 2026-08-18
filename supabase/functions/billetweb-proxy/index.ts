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

    // Fetch events (include past events: the 2026 edition is over, so the
    // default /events listing returns nothing once the event date has passed)
    const fetchEvents = async (extra: string) => {
      const res = await fetch(`${BILLETWEB_API}/events?${authParams}${extra}`);
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        return { ok: true as const, status: res.status, list: Array.isArray(parsed) ? parsed : [] };
      } catch {
        console.error('Billetweb events non-JSON response:', res.status, text.slice(0, 500));
        return { ok: false as const, status: res.status, list: [] as any[] };
      }
    };

    let eventsResult = await fetchEvents('&past=1');
    if (eventsResult.ok && eventsResult.list.length === 0) {
      eventsResult = await fetchEvents('');
    }

    if (!eventsResult.ok) {
      return new Response(JSON.stringify({ error: `Billetweb a renvoyé une réponse invalide (${eventsResult.status})` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const events = eventsResult.list;
    if (events.length === 0) {
      console.error('Billetweb: aucun événement retourné');
      return new Response(JSON.stringify({ events: [], attendees: [], availability: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prefer the Sumi Jo event, otherwise the most recent one
    const sumiEvent = events.find((e: any) => String(e.name || '').toLowerCase().includes('sumi'));
    const sorted = [...events].sort((a: any, b: any) =>
      new Date(b.start || 0).getTime() - new Date(a.start || 0).getTime()
    );
    const selected = sumiEvent || sorted[0];
    const eventId = selected.id;
    events[0] = selected;


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
