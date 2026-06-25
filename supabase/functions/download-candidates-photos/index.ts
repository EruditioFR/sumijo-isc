import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Expose-Headers": "Content-Disposition",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/airtable";
const BASE_ID = "app6ahcwamgNeYQfS";
const TABLE_ID = "tblK1a2bpWFt9fkAo";

const computeAge = (iso: string | null): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

const slug = (s: string): string =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extFromUrl = (url: string, filename?: string): string => {
  const src = filename || url.split("?")[0];
  const m = src.match(/\.([a-zA-Z0-9]{2,5})(?:$|\?)/);
  return m ? m[1].toLowerCase() : "jpg";
};

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
    if (!roleRow) {
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
      if (!resp.ok) throw new Error(`Airtable error [${resp.status}]`);
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const zip = new JSZip();
    const usedNames = new Set<string>();
    let added = 0;

    for (const r of records) {
      const f = r.fields ?? {};
      const photo = f["Photo"]?.[0];
      if (!photo?.url) continue;

      const nom = slug(f["Nom"] ?? "").toUpperCase();
      const prenom = slug(f["Prénom"] ?? "");
      const age = computeAge(f["Date de naissance"] ?? null);
      const pays = slug(f["Pays"] ?? "");
      const voix = slug(f["Type de voix"] ?? "");
      const ext = extFromUrl(photo.url, photo.filename);

      const parts = [nom, prenom, age != null ? `${age}ans` : "", pays, voix]
        .filter(Boolean);
      let base = parts.join("-") || `candidat-${r.id}`;
      let name = `${base}.${ext}`;
      let i = 2;
      while (usedNames.has(name)) {
        name = `${base}-${i++}.${ext}`;
      }
      usedNames.add(name);

      try {
        const imgResp = await fetch(photo.url);
        if (!imgResp.ok) continue;
        const buf = await imgResp.arrayBuffer();
        zip.file(name, buf);
        added++;
      } catch (e) {
        console.error("Failed to fetch photo for", r.id, e);
      }
    }

    const blob = await zip.generateAsync({ type: "uint8array" });
    const date = new Date().toISOString().slice(0, 10);

    return new Response(blob, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="photos-candidats-${date}.zip"`,
        "X-Photo-Count": String(added),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("download-candidates-photos error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
