import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AIRTABLE_GATEWAY = "https://connector-gateway.lovable.dev/airtable";
const MAPS_GATEWAY = "https://connector-gateway.lovable.dev/google_maps";
const BASE_ID = "app6ahcwamgNeYQfS";
const TABLE_ID = "tblK1a2bpWFt9fkAo";

interface CandidateRow {
  id: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  hoteAdresse: string | null;
  pickupTimeRaw: string | null;
  pickupTimeIso: string | null;
  pickupTimeDisplay: string | null;
  distanceMeters: number | null;
  durationSeconds: number | null;
  departureIso: string | null;
  departureDisplay: string | null;
  error: string | null;
}

const parseTimeToIso = (raw: unknown): { iso: string | null; display: string | null } => {
  if (!raw) return { iso: null, display: null };
  const s = String(raw).trim();
  if (!s) return { iso: null, display: null };
  // ISO date-time (Airtable date+time fields return ISO regardless of display format)
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return {
        iso: d.toISOString(),
        display: d.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }
  }
  // European format: D/M/YYYY [HH:MM] (24h). JS Date interprets "5/7/2026" as May 7 (US),
  // so parse manually. Matches "5/7/2026", "05/07/2026 14:30", "5-7-2026 14h30", etc.
  const eu = s.match(
    /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:[ T]+(\d{1,2})[:hH](\d{2}))?/,
  );
  if (eu) {
    const day = parseInt(eu[1], 10);
    const month = parseInt(eu[2], 10);
    let year = parseInt(eu[3], 10);
    if (year < 100) year += 2000;
    const hour = eu[4] ? parseInt(eu[4], 10) : 0;
    const minute = eu[5] ? parseInt(eu[5], 10) : 0;
    // Build as Europe/Paris local time — subtract offset so toISOString reflects that instant.
    // Simple approach: build UTC then adjust by Paris offset for that date.
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
    // Determine Paris offset for that instant
    const parisStr = utcGuess.toLocaleString("en-US", { timeZone: "Europe/Paris" });
    const parisAsIfLocal = new Date(parisStr);
    const offsetMs = parisAsIfLocal.getTime() - utcGuess.getTime();
    const d = new Date(utcGuess.getTime() - offsetMs);
    if (!isNaN(d.getTime()) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return {
        iso: d.toISOString(),
        display: d.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
    }
  }
  // Generic fallback
  const dFallback = new Date(s);
  if (!isNaN(dFallback.getTime())) {
    return {
      iso: dFallback.toISOString(),
      display: dFallback.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  }
  // "HH:MM" or "HHhMM" — no date, cannot compute departure reliably
  const m = s.match(/(\d{1,2})[:hH](\d{2})/);
  if (m) {
    return { iso: null, display: `${m[1].padStart(2, "0")}:${m[2]}` };
  }
  return { iso: null, display: s };
};

const fmtParisTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });

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

    const body = await req.json().catch(() => ({}));
    const fieldName: string = String(body?.fieldName ?? "").trim();
    const destination: string = String(
      body?.destination ?? "Château de La Ferté-Imbault, 41300 La Ferté-Imbault, France",
    ).trim();
    const marginMinutes: number = Number.isFinite(body?.marginMinutes)
      ? Number(body.marginMinutes)
      : 0;
    if (!fieldName) {
      return new Response(JSON.stringify({ error: "fieldName required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!LOVABLE_API_KEY || !AIRTABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
      throw new Error("Missing connector credentials");
    }

    // --- Fetch Airtable ---
    const records: any[] = [];
    let offset: string | undefined;
    do {
      const url = new URL(`${AIRTABLE_GATEWAY}/v0/${BASE_ID}/${TABLE_ID}`);
      url.searchParams.set("pageSize", "100");
      if (offset) url.searchParams.set("offset", offset);
      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": AIRTABLE_API_KEY,
        },
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(`Airtable [${resp.status}]: ${JSON.stringify(json)}`);
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const flatten = (v: unknown): string | null => {
      if (v === null || v === undefined) return null;
      if (Array.isArray(v)) {
        const s = v.map((x) => String(x).trim()).filter(Boolean).join(", ");
        return s || null;
      }
      const s = String(v).trim();
      return s || null;
    };

    const rows: CandidateRow[] = records.map((r) => {
      const f = r.fields ?? {};
      const raw = f[fieldName];
      const { iso, display } = parseTimeToIso(raw);
      return {
        id: r.id,
        nom: f["Nom"] ?? "",
        prenom: f["Prénom"] ?? "",
        telephone: flatten(f["Tél"] ?? f["Téléphone"] ?? f["Telephone"] ?? f["Tel"]),
        hoteAdresse: flatten(f["Adresse (from Hébergement)"]),
        pickupTimeRaw: raw ? String(raw) : null,
        pickupTimeIso: iso,
        pickupTimeDisplay: display,
        distanceMeters: null,
        durationSeconds: null,
        departureIso: null,
        departureDisplay: null,
        error: null,
      };
    });

    // Only compute routes for rows with address AND pickup time
    const computeIdx = rows
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => r.hoteAdresse && r.pickupTimeIso);

    if (computeIdx.length > 0) {
      // Use computeRouteMatrix: origins = distinct addresses, destinations = 1
      const origins = computeIdx.map(({ r }) => ({
        waypoint: { address: r.hoteAdresse as string },
      }));
      const destParam = [{ waypoint: { address: destination } }];

      const mapsResp = await fetch(
        `${MAPS_GATEWAY}/routes/distanceMatrix/v2:computeRouteMatrix`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
            "Content-Type": "application/json",
            "X-Goog-FieldMask":
              "originIndex,destinationIndex,duration,distanceMeters,status,condition",
          },
          body: JSON.stringify({
            origins,
            destinations: destParam,
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
          }),
        },
      );
      const mapsText = await mapsResp.text();
      if (!mapsResp.ok) {
        console.error("Maps error", mapsResp.status, mapsText);
        throw new Error(`Google Maps [${mapsResp.status}]: ${mapsText.slice(0, 300)}`);
      }
      let elements: any[] = [];
      try {
        elements = JSON.parse(mapsText);
      } catch {
        elements = [];
      }
      for (const el of elements) {
        const oi = el.originIndex ?? 0;
        const target = computeIdx[oi];
        if (!target) continue;
        const row = rows[target.i];
        if (el.condition && el.condition !== "ROUTE_EXISTS") {
          row.error = el.condition;
          continue;
        }
        const durStr: string | undefined = el.duration;
        const durSec = durStr ? Number(String(durStr).replace(/s$/, "")) : NaN;
        const dist: number | undefined = el.distanceMeters;
        if (!Number.isFinite(durSec)) {
          row.error = "No duration";
          continue;
        }
        row.distanceMeters = typeof dist === "number" ? dist : null;
        row.durationSeconds = durSec;
        if (row.pickupTimeIso) {
          const pickupMs = new Date(row.pickupTimeIso).getTime();
          const departMs = pickupMs - durSec * 1000;
          const dep = new Date(departMs);
          row.departureIso = dep.toISOString();
          row.departureDisplay = fmtParisTime(row.departureIso);
        }
      }
    }

    rows.sort((a, b) => {
      const ta = a.departureIso ? new Date(a.departureIso).getTime() : Infinity;
      const tb = b.departureIso ? new Date(b.departureIso).getTime() : Infinity;
      if (ta !== tb) return ta - tb;
      return a.nom.localeCompare(b.nom);
    });

    // --- Grouping candidates by geographic proximity (taxi sharing) ---
    const groupThresholdMinutes: number = Number.isFinite(body?.groupThresholdMinutes)
      ? Number(body.groupThresholdMinutes)
      : 10;
    const groupThresholdSec = groupThresholdMinutes * 60;

    type Group = {
      id: string;
      candidateIds: string[];
      addresses: string[];
      earliestDepartureIso: string | null;
      latestPickupIso: string | null;
    };
    const groups: Group[] = [];

    const groupables = rows.filter(
      (r) => r.hoteAdresse && r.departureIso && r.durationSeconds !== null,
    );

    if (groupables.length > 0) {
      // Deduplicate addresses to keep the matrix small
      const uniqueAddrs: string[] = [];
      const addrIndex = new Map<string, number>();
      for (const r of groupables) {
        const a = r.hoteAdresse as string;
        if (!addrIndex.has(a)) {
          addrIndex.set(a, uniqueAddrs.length);
          uniqueAddrs.push(a);
        }
      }

      // Pairwise driving-time matrix between unique addresses
      const n = uniqueAddrs.length;
      const durMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
      for (let i = 0; i < n; i++) durMatrix[i][i] = 0;

      if (n > 1) {
        const wp = uniqueAddrs.map((a) => ({ waypoint: { address: a } }));
        const pairResp = await fetch(
          `${MAPS_GATEWAY}/routes/distanceMatrix/v2:computeRouteMatrix`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
              "Content-Type": "application/json",
              "X-Goog-FieldMask":
                "originIndex,destinationIndex,duration,status,condition",
            },
            body: JSON.stringify({
              origins: wp,
              destinations: wp,
              travelMode: "DRIVE",
              routingPreference: "TRAFFIC_AWARE",
            }),
          },
        );
        const pairText = await pairResp.text();
        if (pairResp.ok) {
          let els: any[] = [];
          try {
            els = JSON.parse(pairText);
          } catch {}
          for (const el of els) {
            const oi = el.originIndex ?? 0;
            const di = el.destinationIndex ?? 0;
            if (el.condition && el.condition !== "ROUTE_EXISTS") continue;
            const durStr: string | undefined = el.duration;
            const durSec = durStr ? Number(String(durStr).replace(/s$/, "")) : NaN;
            if (Number.isFinite(durSec)) {
              durMatrix[oi][di] = durSec;
            }
          }
        } else {
          console.warn("Pairwise matrix failed", pairResp.status, pairText.slice(0, 200));
        }
      }

      // Union-Find on unique addresses: link i-j when both directions ≤ threshold
      const parent = Array.from({ length: n }, (_, i) => i);
      const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      const union = (a: number, b: number) => {
        const ra = find(a); const rb = find(b);
        if (ra !== rb) parent[ra] = rb;
      };
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const t = Math.max(durMatrix[i][j], durMatrix[j][i]);
          if (t <= groupThresholdSec) union(i, j);
        }
      }

      // Bucket candidates by pickup time (heure présence) then by proximity root.
      // Grouping ONLY unites candidates sharing the same arrival time.
      const timeBuckets = new Map<string, CandidateRow[]>();
      for (const r of groupables) {
        const key = r.pickupTimeIso as string;
        if (!timeBuckets.has(key)) timeBuckets.set(key, []);
        timeBuckets.get(key)!.push(r);
      }

      for (const [timeKey, timeList] of timeBuckets) {
        const proxBuckets = new Map<number, CandidateRow[]>();
        for (const r of timeList) {
          const idx = addrIndex.get(r.hoteAdresse as string)!;
          const root = find(idx);
          if (!proxBuckets.has(root)) proxBuckets.set(root, []);
          proxBuckets.get(root)!.push(r);
        }
        for (const [root, list] of proxBuckets) {
          list.sort((a, b) => {
            const ta = a.pickupTimeIso ? new Date(a.pickupTimeIso).getTime() : Infinity;
            const tb = b.pickupTimeIso ? new Date(b.pickupTimeIso).getTime() : Infinity;
            if (ta !== tb) return ta - tb;
            return a.nom.localeCompare(b.nom);
          });
          const addrs = Array.from(new Set(list.map((r) => r.hoteAdresse as string)));
          const earliest = list
            .map((r) => r.departureIso)
            .filter(Boolean)
            .sort()[0] ?? null;
          groups.push({
            id: `g${root}-${timeKey}`,
            candidateIds: list.map((r) => r.id),
            addresses: addrs,
            earliestDepartureIso: earliest,
            latestPickupIso: timeKey,
          });
        }
      }

      // Sort groups by earliest departure
      groups.sort((a, b) => {
        const ta = a.earliestDepartureIso ? new Date(a.earliestDepartureIso).getTime() : Infinity;
        const tb = b.earliestDepartureIso ? new Date(b.earliestDepartureIso).getTime() : Infinity;
        return ta - tb;
      });
    }

    return new Response(
      JSON.stringify({
        rows,
        groups,
        groupThresholdMinutes,
        fieldName,
        destination,
        marginMinutes,
        count: rows.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("list-pickup-schedule error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
