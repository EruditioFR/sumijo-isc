const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/airtable";
const BASE_ID = "app6ahcwamgNeYQfS";
const TABLE_ID = "tblK1a2bpWFt9fkAo";

interface AirtableAttachment {
  id: string;
  url: string;
  thumbnails?: {
    small?: { url: string };
    large?: { url: string };
    full?: { url: string };
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
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
      const fields = ["Nom", "Prénom", "Pays", "Type de voix", "Photo", "Laureat", "Prix"];
      fields.forEach((f) => url.searchParams.append("fields[]", f));
      if (offset) url.searchParams.set("offset", offset);

      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": AIRTABLE_API_KEY,
        },
      });
      const text = await resp.text();
      if (!resp.ok) {
        throw new Error(`Airtable gateway error [${resp.status}]: ${text.slice(0, 300)}`);
      }
      const json = JSON.parse(text);
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const prixRank = (p: string) => {
      const s = (p || "").toLowerCase();
      if (s.includes("1")) return 1;
      if (s.includes("2")) return 2;
      if (s.includes("3")) return 3;
      if (s.includes("4")) return 4;
      if (s.includes("5")) return 5;
      return 99;
    };

    const finalists = records
      .filter((r) => r.fields?.["Laureat"] === true)
      .map((r) => {
        const f = r.fields ?? {};
        const photo: AirtableAttachment | undefined = f["Photo"]?.[0];
        return {
          id: r.id,
          nom: f["Nom"] ?? "",
          prenom: f["Prénom"] ?? "",
          pays: f["Pays"] ?? "",
          typeVoix: f["Type de voix"] ?? "",
          prix: f["Prix"] ?? "",
          photoUrl: photo?.thumbnails?.large?.url ?? photo?.url ?? null,
        };
      });

    finalists.sort((a, b) => prixRank(a.prix) - prixRank(b.prix) || a.nom.localeCompare(b.nom));

    return new Response(
      JSON.stringify({ finalists, count: finalists.length }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("list-finalists error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
