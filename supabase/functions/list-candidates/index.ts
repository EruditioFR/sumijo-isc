import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/airtable";
const BASE_ID = "app6ahcwamgNeYQfS";
const TABLE_ID = "tblK1a2bpWFt9fkAo"; // "candidats 2026"

interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  type?: string;
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
    // --- Auth + admin check ---
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

    // --- Airtable fetch ---
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
        throw new Error(
          `Airtable error [${resp.status}]: ${JSON.stringify(json)}`,
        );
      }
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const extractVideo = (val: any): string | null => {
      if (!val) return null;
      if (typeof val === "string") return val.trim() || null;
      if (Array.isArray(val) && val.length > 0) {
        const first = val[0];
        if (typeof first === "string") return first.trim() || null;
        if (first?.url) return first.url;
      }
      if (typeof val === "object" && val?.url) return val.url;
      return null;
    };
    const pickVideo = (f: any, ...keys: string[]): string | null => {
      for (const k of keys) {
        const v = extractVideo(f[k]);
        if (v) return v;
      }
      return null;
    };

    const candidates = records.map((r) => {
      const f = r.fields ?? {};
      const photo: AirtableAttachment | undefined = f["Photo"]?.[0];
      const cv: AirtableAttachment | undefined = f["CV"]?.[0];
      const id: AirtableAttachment | undefined = f["Carte identité"]?.[0];
      return {
        id: r.id,
        nom: f["Nom"] ?? "",
        prenom: f["Prénom"] ?? "",
        dateNaissance: f["Date de naissance"] ?? null,
        pays: f["Pays"] ?? "",
        typeVoix: f["Type de voix"] ?? "",
        videoUrl: f["Vidéo présentation"] ?? null,
        photoUrl: photo?.thumbnails?.large?.url ?? photo?.url ?? null,
        photoFullUrl: photo?.url ?? null,
        cvUrl: cv?.url ?? null,
        idUrl: id?.url ?? null,
        status: f["Status"] ?? null,
        email: f["E-mail"] ?? f["Email"] ?? f["Mail"] ?? null,
        telephone: f["Tél"] ?? f["Téléphone"] ?? f["Telephone"] ?? f["Tel"] ?? null,
        bio: f["Bio"] ?? f["Biographie"] ?? f["Bio artistique"] ?? null,
        motivation: f["Pourquoi je participe"] ?? f["Pourquoi je souhaite participer"] ?? f["Motivation"] ?? null,
        infosUtiles: f["Infos utiles"] ?? f["Informations complémentaires"] ?? f["Informations utiles"] ?? null,
        videoSelection1: pickVideo(f, "Vidéo1 sélection", "Vidéo 1 sélection", "Video1 selection", "Vidéo1 selection"),
        videoSelection2: pickVideo(f, "Vidéo2 sélection", "Vidéo 2 sélection", "Video2 selection", "Vidéo2 selection"),
        videoSelection3: pickVideo(f, "Vidéo3 sélection", "Vidéo 3 sélection", "Video3 selection", "Vidéo3 selection"),
        langues: (() => {
          const v = f["Langues parlées"] ?? f["Langues"] ?? f["Langues parlees"] ?? f["Languages"] ?? f["Langue"] ?? null;
          if (!v) return [];
          if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
          return String(v).split(/[,;/]+/).map((s) => s.trim()).filter(Boolean);
        })(),
        airsDemieFinale: (() => {
          const v = f["Aria Demie-Finale"] ?? f["Aria Demi-Finale"] ?? f["Airs Demie-Finale"] ?? f["Airs Demi-Finale"] ?? f["Aria Demie Finale"] ?? null;
          if (!v) return [];
          if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
          return String(v).split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
        })(),
      };
    });

    if (records[0]) {
      console.log("First record field keys:", Object.keys(records[0].fields ?? {}));
    }

    // Sort by name
    candidates.sort((a, b) => a.nom.localeCompare(b.nom));

    return new Response(
      JSON.stringify({ candidates, count: candidates.length }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("list-candidates error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
