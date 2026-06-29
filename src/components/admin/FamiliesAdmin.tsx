import { useEffect, useMemo, useState } from 'react';
import { Home, Loader2, RefreshCw, Mail, Phone, MapPin, ExternalLink, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { countryNameToFlagUrl } from '@/lib/countryFlags';
import { useIsMobile } from '@/hooks/use-mobile';

const CountryFlag = ({ name }: { name: string }) => {
  const url = countryNameToFlagUrl(name);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      className="inline-block w-5 h-[15px] object-cover rounded-[2px] shadow-sm"
      loading="lazy"
    />
  );
};

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  typeVoix: string;
  dateNaissance: string | null;
  photoUrl: string | null;
  photoFullUrl: string | null;
  email: string | null;
  telephone: string | null;
  allergies: string | null;
  hote: string | null;
  hoteAdresse: string | null;
  hoteEmail: string | null;
  hoteTelephone: string | null;
  hoteOrdre: number | null;
}

const calcAge = (date: string | null): string => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const diff = Date.now() - d.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  return String(age);
};

const telHref = (raw: string) => 'tel:' + raw.replace(/[^\d+]/g, '');
const splitMulti = (s: string | null): string[] =>
  s ? s.split(/[,;]\s*/).map((x) => x.trim()).filter(Boolean) : [];

const FamiliesAdmin = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapAddress, setMapAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPays, setSelectedPays] = useState<string>('all');
  const [selectedTypeVoix, setSelectedTypeVoix] = useState<string>('all');
  const isMobile = useIsMobile();

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-candidates');
      if (error) throw error;
      setCandidates(data?.candidates ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      setError(msg);
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchesSearch = !q ||
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        (c.pays && c.pays.toLowerCase().includes(q)) ||
        (c.typeVoix && c.typeVoix.toLowerCase().includes(q)) ||
        (c.allergies && c.allergies.toLowerCase().includes(q)) ||
        (c.hote && c.hote.toLowerCase().includes(q)) ||
        (c.hoteAdresse && c.hoteAdresse.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.telephone && c.telephone.toLowerCase().includes(q));
      const matchesPays = selectedPays === 'all' || c.pays === selectedPays;
      const matchesTypeVoix = selectedTypeVoix === 'all' || c.typeVoix === selectedTypeVoix;
      return matchesSearch && matchesPays && matchesTypeVoix;
    });
  }, [candidates, searchQuery, selectedPays, selectedTypeVoix]);

  const paysOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of candidates) if (c.pays) set.add(c.pays);
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [candidates]);

  const typeVoixOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of candidates) if (c.typeVoix) set.add(c.typeVoix);
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [candidates]);

  const groups = useMemo(() => {
    const map = new Map<string, Candidate[]>();
    for (const c of filteredCandidates) {
      const key = c.hote && c.hote.trim() ? c.hote.trim() : 'Sans hôte attribué';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries())
      .map(([host, list]) => ({ host, list, sample: list[0] }))
      .sort((a, b) => {
        const oa = a.sample.hoteOrdre;
        const ob = b.sample.hoteOrdre;
        if (oa != null && ob != null && oa !== ob) return oa - ob;
        if (oa != null && ob == null) return -1;
        if (oa == null && ob != null) return 1;
        return a.host.localeCompare(b.host, 'fr');
      });
  }, [filteredCandidates]);

  const ContactBlock = ({ c }: { c: Candidate }) => (
    <div className="space-y-1 text-xs">
      {c.telephone && (
        <a href={telHref(c.telephone)} className="flex items-center gap-1.5 text-foreground hover:text-primary">
          <Phone className="w-3 h-3 shrink-0" />
          <span className="truncate">{c.telephone}</span>
        </a>
      )}
      {c.email && (
        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-foreground hover:text-primary">
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate">{c.email}</span>
        </a>
      )}
      {!c.telephone && !c.email && <span className="text-muted-foreground">-</span>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-display text-foreground mb-2 flex items-center gap-3">
            <Home className="w-8 h-8" />
            Familles d'accueil
          </h2>
          <p className="text-muted-foreground">
            {groups.length > 0
              ? `${groups.length} hôte${groups.length > 1 ? 's' : ''} · ${candidates.length} candidat${candidates.length > 1 ? 's' : ''}`
              : 'Regroupement des candidats par famille d\'accueil'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCandidates} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Chargement…</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-8 text-center">
          <p className="text-destructive font-medium mb-2">Impossible de charger</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Select value={selectedPays} onValueChange={setSelectedPays}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {paysOptions.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTypeVoix} onValueChange={setSelectedTypeVoix}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type de voix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les voix</SelectItem>
                {typeVoixOptions.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {groups.length === 0 ? (
            <div className="bg-background border rounded-xl p-12 text-center">
              <p className="text-muted-foreground">Aucun candidat ne correspond aux filtres sélectionnés.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map(({ host, list, sample }) => {
            const hostEmails = splitMulti(sample.hoteEmail);
            const hostPhones = splitMulti(sample.hoteTelephone);
            return (
              <section key={host} className="bg-background border rounded-xl overflow-hidden">
                <header className="bg-muted/40 px-5 py-4 border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {host}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({list.length} candidat{list.length > 1 ? 's' : ''})
                      </span>
                    </h3>
                  </div>
                  {(sample.hoteAdresse || hostEmails.length > 0 || hostPhones.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      {sample.hoteAdresse && (
                        <button
                          type="button"
                          onClick={() => setMapAddress(sample.hoteAdresse)}
                          className="inline-flex items-center gap-1.5 hover:text-primary underline-offset-2 hover:underline cursor-pointer"
                          title="Voir sur la carte"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {sample.hoteAdresse}
                        </button>
                      )}
                      {hostPhones.map((p, i) => (
                        <a key={`p${i}`} href={telHref(p)} className="inline-flex items-center gap-1.5 hover:text-primary">
                          <Phone className="w-3.5 h-3.5" />
                          {p}
                        </a>
                      ))}
                      {hostEmails.map((m, i) => (
                        <a key={`m${i}`} href={`mailto:${m}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                          <Mail className="w-3.5 h-3.5" />
                          {m}
                        </a>
                      ))}
                    </div>
                  )}
                </header>

                {isMobile ? (
                  <ul className="divide-y">
                    {list.map((c) => (
                      <li key={c.id} className="p-4">
                        <div className="flex items-start gap-3">
                          {c.photoUrl ? (
                            <img
                              src={c.photoUrl}
                              alt={`${c.prenom} ${c.nom}`}
                              className="w-14 h-14 rounded-full object-cover border shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              {c.prenom?.[0]}{c.nom?.[0]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground leading-tight">
                              {c.nom.toUpperCase()} {c.prenom}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                              {c.pays && <CountryFlag name={c.pays} />}
                              <span>{c.pays || '-'}</span>
                              <span>·</span>
                              <span className="capitalize">{c.typeVoix || '-'}</span>
                              <span>·</span>
                              <span>{calcAge(c.dateNaissance)} ans</span>
                            </div>
                            {c.allergies && (
                              <div className="mt-1.5 text-xs">
                                <span className="text-muted-foreground">Allergies : </span>
                                <span className="text-foreground">{c.allergies}</span>
                              </div>
                            )}
                            <div className="mt-2">
                              <ContactBlock c={c} />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Photo</TableHead>
                          <TableHead>Candidat</TableHead>
                          <TableHead className="w-16">Âge</TableHead>
                          <TableHead>Pays</TableHead>
                          <TableHead>Type de voix</TableHead>
                          <TableHead>Allergies</TableHead>
                          <TableHead>Contact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="align-top">
                              {c.photoUrl ? (
                                <a href={c.photoFullUrl ?? c.photoUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={c.photoUrl}
                                    alt={`${c.prenom} ${c.nom}`}
                                    className="w-12 h-12 rounded-full object-cover border"
                                  />
                                </a>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                  {c.prenom?.[0]}{c.nom?.[0]}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="font-medium text-foreground">{c.nom.toUpperCase()} {c.prenom}</div>
                            </TableCell>
                            <TableCell className="align-top tabular-nums">{calcAge(c.dateNaissance)}</TableCell>
                            <TableCell className="align-top">
                              {c.pays ? (
                                <span className="inline-flex items-center gap-2">
                                  <CountryFlag name={c.pays} />
                                  <span>{c.pays}</span>
                                </span>
                              ) : '-'}
                            </TableCell>
                            <TableCell className="align-top capitalize">{c.typeVoix || '-'}</TableCell>
                            <TableCell className="align-top text-sm max-w-[200px]">
                              {c.allergies || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="align-top">
                              <ContactBlock c={c} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <Dialog open={!!mapAddress} onOpenChange={(o) => !o && setMapAddress(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2 pr-8">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="break-words">{mapAddress}</span>
            </DialogTitle>
          </DialogHeader>
          {mapAddress && (
            <div className="space-y-3">
              <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted">
                <iframe
                  title={`Carte : ${mapAddress}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex justify-end">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamiliesAdmin;
