import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/airtable";
const BASE_ID = "app6ahcwamgNeYQfS";
const TABLE_ID = "tbll7MNCjMl4ghWIV";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { id, statutJourJ } = body as { id?: string; statutJourJ?: boolean };
    if (!id || typeof statutJourJ !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing id or statutJourJ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    if (!LOVABLE_API_KEY || !AIRTABLE_API_KEY) {
      throw new Error("Missing connector credentials");
    }

    const resp = await fetch(`${GATEWAY_URL}/v0/${BASE_ID}/${TABLE_ID}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": AIRTABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { "Statut Jour J": statutJourJ } }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      throw new Error(`Airtable error [${resp.status}]: ${JSON.stringify(json)}`);
    }

    return new Response(
      JSON.stringify({ ok: true, statutJourJ: Boolean(json?.fields?.["Statut Jour J"]) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("update-cortot-guest error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
