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

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    if (!LOVABLE_API_KEY || !AIRTABLE_API_KEY) {
      throw new Error("Missing connector credentials");
    }

    const records: any[] = [];
    let offset: string | undefined;
    do {
      const url = new URL(`${GATEWAY_URL}/v0/${BASE_ID}/${TABLE_ID}`);
      url.searchParams.set("pageSize", "100");
      if (offset) url.searchParams.set("offset", offset);

      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": AIRTABLE_API_KEY,
        },
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(`Airtable error [${resp.status}]: ${JSON.stringify(json)}`);
      }
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const guests = records.map((r) => {
      const f = r.fields ?? {};
      return {
        id: r.id,
        firstName: f["First Name"] ?? "",
        lastName: f["Last Name"] ?? "",
        company: f["Company"] ?? "",
        pax: f["Pax"] ?? "",
        category: f["Category"] ?? "",
        contactForInvitation: f["Contact for invitation"] ?? "",
        confirmed: f["Confirmed ?"] ?? "",
        invited: f["Invited ?"] ?? "",
        seatNumber: f["Seat Number"] ?? "",
        seatNumberPlus1: f["Seat Number +1"] ?? "",
        seatNumberPlus2: f["Seat Number +2"] ?? "",
        statutJourJ: Boolean(f["Statut Jour J"]),
        paxArrived: typeof f["Pax Arrivés"] === "number" ? f["Pax Arrivés"] : null,
        priority: f["Priority"] ?? "",
      };
    });

    guests.sort((a, b) =>
      (a.lastName || a.firstName).localeCompare(b.lastName || b.firstName),
    );

    return new Response(
      JSON.stringify({ guests, count: guests.length }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("list-cortot-guests error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
