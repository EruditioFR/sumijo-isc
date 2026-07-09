import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AIRTABLE_RECORD_RE = /^rec[A-Za-z0-9]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    const voterToken = String(body?.voter_token ?? "").trim();
    const candidateId = String(body?.candidate_id ?? "").trim();

    if (!UUID_RE.test(voterToken) || !AIRTABLE_RECORD_RE.test(candidateId)) {
      return new Response(JSON.stringify({ error: "Invalid vote payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing backend credentials");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: settings, error: settingsError } = await supabase
      .from("vote_settings")
      .select("is_open")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (settingsError) throw settingsError;

    if (!settings?.is_open) {
      return new Response(JSON.stringify({ error: "Votes closed" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: voteError } = await supabase
      .from("public_votes")
      .insert({ voter_token: voterToken, candidate_id: candidateId });

    if (voteError) {
      // Duplicate voter_token => already voted
      if ((voteError as any).code === "23505") {
        return new Response(JSON.stringify({ error: "Already voted" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw voteError;
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("cast-vote error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});