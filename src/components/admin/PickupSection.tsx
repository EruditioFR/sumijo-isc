import { useEffect, useMemo, useState } from 'react';
import {
  Car, Loader2, MapPin, Clock, MessageCircle, Plus, Trash2, Copy, Check, Settings2, Users, List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PickupRow {
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

interface PickupGroup {
  id: string;
  candidateIds: string[];
  addresses: string[];
  earliestDepartureIso: string | null;
  latestPickupIso: string | null;
}

const FIELDS_KEY = 'admin:pickup:fields:v1';
const DEST_KEY = 'admin:pickup:destination:v1';
const MARGIN_KEY = 'admin:pickup:margin:v1';
const THRESHOLD_KEY = 'admin:pickup:threshold:v1';
const DEFAULT_FIELDS = ['Lundi matin'];
const DEFAULT_DESTINATION = 'Château de La Ferté-Imbault, 41300 La Ferté-Imbault, France';
const DEFAULT_MARGIN = 15;
const DEFAULT_THRESHOLD = 10;

const loadFields = (): string[] => {
  try {
    const raw = localStorage.getItem(FIELDS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.every((x) => typeof x === 'string')) return arr;
    }
  } catch {}
  return DEFAULT_FIELDS;
};

const formatDistance = (m: number | null) => {
  if (m === null) return '—';
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toFixed(1)} km`;
};

const formatDuration = (s: number | null) => {
  if (s === null) return '—';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h${String(mm).padStart(2, '0')}`;
};

const PickupSection = () => {
  const [fields, setFields] = useState<string[]>(loadFields);
  const [selected, setSelected] = useState<string>(() => loadFields()[0] ?? '');
  const [destination, setDestination] = useState<string>(
    () => localStorage.getItem(DEST_KEY) || DEFAULT_DESTINATION,
  );
  const [margin, setMargin] = useState<number>(() => {
    const raw = localStorage.getItem(MARGIN_KEY);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : DEFAULT_MARGIN;
  });
  const [threshold, setThreshold] = useState<number>(() => {
    const raw = localStorage.getItem(THRESHOLD_KEY);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : DEFAULT_THRESHOLD;
  });
  const [rows, setRows] = useState<PickupRow[]>([]);
  const [groups, setGroups] = useState<PickupGroup[]>([]);
  const [view, setView] = useState<'list' | 'groups'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newField, setNewField] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
    if (!fields.includes(selected) && fields.length > 0) setSelected(fields[0]);
  }, [fields]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem(DEST_KEY, destination);
  }, [destination]);

  useEffect(() => {
    localStorage.setItem(MARGIN_KEY, String(margin));
  }, [margin]);

  useEffect(() => {
    localStorage.setItem(THRESHOLD_KEY, String(threshold));
  }, [threshold]);

  const load = async (opts?: { silent?: boolean }) => {
    if (!selected) return;
    if (!opts?.silent) setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-pickup-schedule', {
        body: {
          fieldName: selected,
          destination,
          marginMinutes: margin,
          groupThresholdMinutes: threshold,
        },
      });
      if (error) throw error;
      setRows((data?.rows ?? []) as PickupRow[]);
      setGroups((data?.groups ?? []) as PickupGroup[]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selected) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const addField = () => {
    const v = newField.trim();
    if (!v) return;
    if (fields.includes(v)) {
      toast.error('Cette valeur existe déjà');
      return;
    }
    setFields([...fields, v]);
    setNewField('');
    setSelected(v);
    toast.success(`Ajouté : ${v}`);
  };

  const removeField = (v: string) => {
    const next = fields.filter((f) => f !== v);
    setFields(next.length > 0 ? next : DEFAULT_FIELDS);
  };

  const whatsappLines = useMemo(
    () =>
      rows
        .filter((r) => r.departureDisplay)
        .map((r) => `${r.prenom} ${r.nom} - pickup at ${r.departureDisplay}`)
        .join('\n'),
    [rows],
  );

  const copyPreview = async () => {
    try {
      await navigator.clipboard.writeText(whatsappLines);
      setCopied(true);
      toast.success('Copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  const withDeparture = rows.filter((r) => r.departureDisplay).length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background px-4 sm:px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-lg sm:text-xl font-display text-foreground flex items-center gap-2">
              <Car className="w-5 h-5" />
              Pickup
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Calcul des heures de départ depuis les hébergements
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 className="w-4 h-4 mr-1.5" />
            Paramètres
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Créneau de pickup
            </Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un créneau…" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="default"
            onClick={() => setPreviewOpen(true)}
            disabled={withDeparture === 0}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            Preview WhatsApp
            {withDeparture > 0 && (
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {withDeparture}
              </span>
            )}
          </Button>
          <Button variant="outline" onClick={() => load()} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Clock className="w-4 h-4 mr-1.5" />
            )}
            Recalculer
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">Destination : {destination}</span>
          <span className="ml-2">· Marge : +{margin} min</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading && rows.length === 0 ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Calcul des trajets…</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive font-medium mb-1">Erreur</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Aucun candidat pour ce créneau.
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Heure présence</TableHead>
                <TableHead>Hébergement</TableHead>
                <TableHead className="text-right">Distance</TableHead>
                <TableHead className="text-right">Trajet</TableHead>
                <TableHead className="text-right">Départ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    <span className="uppercase">{r.nom}</span> {r.prenom}
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.pickupTimeDisplay ?? (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[260px]">
                    {r.hoteAdresse ?? (
                      <span className="italic">Non renseigné</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {formatDistance(r.distanceMeters)}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {formatDuration(r.durationSeconds)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.departureDisplay ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary font-mono tabular-nums text-sm font-semibold">
                        {r.departureDisplay}
                      </span>
                    ) : r.error ? (
                      <span className="text-xs text-destructive">{r.error}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Paramètres Pickup</DialogTitle>
            <DialogDescription>
              Les créneaux correspondent aux noms de champs Airtable des candidats.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label className="text-sm mb-2 block">Créneaux disponibles</Label>
              <div className="space-y-1.5">
                {fields.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md border bg-muted/30"
                  >
                    <span className="text-sm">{f}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(f)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="ex : Mardi matin"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addField();
                    }
                  }}
                />
                <Button onClick={addField} variant="outline">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Ajouter
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="pickup-dest" className="text-sm mb-2 block">
                Adresse de destination
              </Label>
              <Input
                id="pickup-dest"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pickup-margin" className="text-sm mb-2 block">
                Marge de sécurité (minutes)
              </Label>
              <Input
                id="pickup-margin"
                type="number"
                min={0}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value) || 0)}
                className="w-32"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(false)}
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setSettingsOpen(false);
                  load();
                }}
              >
                Appliquer et recalculer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Preview WhatsApp
            </DialogTitle>
            <DialogDescription>
              {withDeparture} message(s) prêts à envoyer pour « {selected} ».
            </DialogDescription>
          </DialogHeader>
          <Textarea
            readOnly
            value={whatsappLines}
            className="min-h-[300px] font-mono text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={copyPreview}>
              {copied ? (
                <><Check className="w-4 h-4 mr-1.5" /> Copié</>
              ) : (
                <><Copy className="w-4 h-4 mr-1.5" /> Copier</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PickupSection;
