import { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, FileText, IdCard, Video, Loader2, RefreshCw,
  ChevronRight, Mail, Phone, Sparkles, Quote, Info, Eye, Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { countryNameToFlagUrl } from '@/lib/countryFlags';

const CountryFlag = ({ name, className = '' }: { name: string; className?: string }) => {
  const url = countryNameToFlagUrl(name);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      className={`inline-block w-5 h-[15px] object-cover rounded-[2px] shadow-sm ${className}`}
      loading="lazy"
    />
  );
};

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  pays: string;
  typeVoix: string;
  videoUrl: string | null;
  photoUrl: string | null;
  photoFullUrl: string | null;
  cvUrl: string | null;
  idUrl: string | null;
  status: string | null;
  email: string | null;
  telephone: string | null;
  bio: string | null;
  motivation: string | null;
  infosUtiles: string | null;
  videoSelection1: string | null;
  videoSelection2: string | null;
  videoSelection3: string | null;
  langues: string[];
}

const computeAge = (iso: string): number | null => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  try {
    const formatted = new Date(iso).toLocaleDateString('fr-FR');
    const age = computeAge(iso);
    return age !== null ? `${formatted} (${age} ans)` : formatted;
  } catch {
    return iso;
  }
};

const Field = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
    <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
      {children}
    </div>
  </div>
);

const toEmbedUrl = (url: string): { type: 'iframe' | 'video'; src: string } => {
  const u = url.trim();
  // YouTube
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1` };
  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  // Google Drive
  const gd = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (gd) return { type: 'iframe', src: `https://drive.google.com/file/d/${gd[1]}/preview` };
  return { type: 'video', src: u };
};

const CandidateDetails = ({
  c,
  onPlayVideo,
}: {
  c: Candidate;
  onPlayVideo: (url: string, title: string) => void;
}) => {
  const has = (v: string | null) => v && v.trim().length > 0;
  const selectionVideos = [c.videoSelection1, c.videoSelection2, c.videoSelection3];
  const renderVideo = (v: string | null, idx: number) => {
    if (!has(v)) return <span className="text-muted-foreground">—</span>;
    const isUrl = /^https?:\/\//i.test(v!.trim());
    return isUrl ? (
      <button
        type="button"
        onClick={() => onPlayVideo(v!, `${c.prenom} ${c.nom} — Vidéo ${idx + 1}`)}
        className="inline-flex items-center gap-1.5 text-primary hover:underline break-all text-left"
      >
        <Video className="w-4 h-4 shrink-0" />
        <span>{v}</span>
      </button>
    ) : <span className="break-all">{v}</span>;
  };
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field icon={Mail} label="E-mail">
              {has(c.email) ? (
                <a href={`mailto:${c.email}`} className="text-primary hover:underline break-all">
                  {c.email}
                </a>
              ) : <span className="text-muted-foreground">—</span>}
            </Field>
            <Field icon={Phone} label="Téléphone">
              {has(c.telephone) ? (
                <a href={`tel:${c.telephone}`} className="text-primary hover:underline">
                  {c.telephone}
                </a>
              ) : <span className="text-muted-foreground">—</span>}
            </Field>
          </div>
          <Field icon={Sparkles} label="Bio artistique">
            {has(c.bio) ? c.bio : <span className="text-muted-foreground">—</span>}
          </Field>
        </div>
        <div className="space-y-5">
          <Field icon={Quote} label="Pourquoi je participe">
            {has(c.motivation) ? c.motivation : <span className="text-muted-foreground">—</span>}
          </Field>
          <Field icon={Info} label="Infos utiles">
            {has(c.infosUtiles) ? c.infosUtiles : <span className="text-muted-foreground">—</span>}
          </Field>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Vidéos de sélection</span>
        </div>
        <ol className="space-y-1.5 text-sm">
          {selectionVideos.map((v, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground shrink-0">Vidéo {i + 1} :</span>
              <div className="min-w-0">{renderVideo(v, i)}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const CandidatesAdmin = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sheetCandidate, setSheetCandidate] = useState<Candidate | null>(null);
  const [videoModal, setVideoModal] = useState<{ url: string; title: string } | null>(null);
  const playVideo = (url: string, title: string) => setVideoModal({ url, title });

  const CACHE_KEY = 'admin:candidates:v1';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchCandidates = async (opts: { silent?: boolean } = {}) => {
    if (!opts.silent) setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-candidates');
      if (error) throw error;
      const list = data?.candidates ?? [];
      setCandidates(list);
      const ts = Date.now();
      setLastUpdated(ts);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts, candidates: list }));
      } catch {}
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      setError(msg);
      if (!opts.silent) {
        toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      }
    } finally {
      if (!opts.silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    let hasCache = false;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; candidates: Candidate[] };
        if (parsed?.candidates?.length) {
          setCandidates(parsed.candidates);
          setLastUpdated(parsed.ts);
          setIsLoading(false);
          hasCache = true;
          const fresh = Date.now() - parsed.ts < CACHE_TTL;
          if (fresh) return; // skip refetch when cache is fresh
        }
      }
    } catch {}
    fetchCandidates({ silent: hasCache });
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allExpanded = useMemo(
    () => candidates.length > 0 && expanded.size === candidates.length,
    [expanded, candidates],
  );

  const toggleAll = () => {
    setExpanded(allExpanded ? new Set() : new Set(candidates.map((c) => c.id)));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-display text-foreground mb-2 flex items-center gap-3">
            <Users className="w-8 h-8" />
            {t('admin.candidates')}
          </h2>
          <p className="text-muted-foreground">
            {candidates.length > 0
              ? `${candidates.length} candidat${candidates.length > 1 ? 's' : ''} retenu${candidates.length > 1 ? 's' : ''} pour la demi-finale`
              : t('admin.candidatesSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {candidates.length > 0 && (
            <Button variant="outline" size="sm" onClick={toggleAll}>
              {allExpanded ? 'Tout replier' : 'Tout déplier'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchCandidates()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Chargement des candidats…</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-8 text-center">
          <p className="text-destructive font-medium mb-2">Impossible de charger les candidats</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-display text-foreground mb-2">
            {t('admin.candidatesEmptyTitle')}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('admin.candidatesEmptyDescription')}
          </p>
        </div>
      ) : (
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-16">Photo</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Type de voix</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Langues parlées</TableHead>
                  <TableHead className="text-center">Documents</TableHead>
                  <TableHead>Vidéo de présentation</TableHead>
                  <TableHead className="w-16 text-center">Fiche</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => {
                  const isOpen = expanded.has(c.id);
                  return (
                    <Fragment key={c.id}>
                      <TableRow
                        key={c.id}
                        className="cursor-pointer"
                        onClick={() => toggle(c.id)}
                      >
                        <TableCell>
                          <ChevronRight
                            className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`}
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {c.photoUrl ? (
                            <a
                              href={c.photoFullUrl ?? c.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={c.photoUrl}
                                alt={`${c.prenom} ${c.nom}`}
                                className="w-12 h-12 rounded-full object-cover border"
                              />
                            </a>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              {c.prenom?.[0]}{c.nom?.[0]}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{c.nom}</TableCell>
                        <TableCell>{c.prenom}</TableCell>
                        <TableCell>
                          {c.pays ? (
                            <span className="inline-flex items-center gap-2">
                              <CountryFlag name={c.pays} />
                              <span>{c.pays}</span>
                            </span>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="capitalize">{c.typeVoix || '—'}</TableCell>
                        <TableCell>{formatDate(c.dateNaissance)}</TableCell>
                        <TableCell>
                          {c.langues && c.langues.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {c.langues.map((l, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs text-foreground"
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            {c.cvUrl && (
                              <a href={c.cvUrl} target="_blank" rel="noopener noreferrer" title="CV"
                                className="text-muted-foreground hover:text-foreground transition-colors">
                                <FileText className="w-4 h-4" />
                              </a>
                            )}
                            {c.idUrl && (
                              <a href={c.idUrl} target="_blank" rel="noopener noreferrer" title="Carte d'identité"
                                className="text-muted-foreground hover:text-foreground transition-colors">
                                <IdCard className="w-4 h-4" />
                              </a>
                            )}
                            {!c.cvUrl && !c.idUrl && (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {c.videoUrl ? (
                            <a
                              href={c.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              <span className="underline underline-offset-2">Voir la vidéo</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Ouvrir la fiche complète"
                            onClick={() => setSheetCandidate(c)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow key={`${c.id}-details`} className="hover:bg-transparent bg-muted/20">
                          <TableCell colSpan={10} className="p-6">
                            <CandidateDetails c={c} onPlayVideo={playVideo} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            <span>Source : Airtable « candidats 2026 »</span>
          </div>
        </div>
      )}

      <Sheet open={!!sheetCandidate} onOpenChange={(o) => !o && setSheetCandidate(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto print:max-w-none print:w-full">
          {sheetCandidate && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-4">
                  {sheetCandidate.photoUrl ? (
                    <img
                      src={sheetCandidate.photoUrl}
                      alt={`${sheetCandidate.prenom} ${sheetCandidate.nom}`}
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      {sheetCandidate.prenom?.[0]}{sheetCandidate.nom?.[0]}
                    </div>
                  )}
                  <div className="text-left">
                    <SheetTitle className="text-2xl">
                      {sheetCandidate.prenom} {sheetCandidate.nom}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <CountryFlag name={sheetCandidate.pays} />
                      <span>{sheetCandidate.pays || '—'}</span>
                      <span>·</span>
                      <span className="capitalize">{sheetCandidate.typeVoix || '—'}</span>
                      <span>·</span>
                      <span>{formatDate(sheetCandidate.dateNaissance)}</span>
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 print:hidden">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer / PDF
                  </Button>
                  {sheetCandidate.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={sheetCandidate.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 mr-2" />
                        Vidéo
                      </a>
                    </Button>
                  )}
                  {sheetCandidate.cvUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={sheetCandidate.cvUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        CV
                      </a>
                    </Button>
                  )}
                  {sheetCandidate.idUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={sheetCandidate.idUrl} target="_blank" rel="noopener noreferrer">
                        <IdCard className="w-4 h-4 mr-2" />
                        Pièce d'identité
                      </a>
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="space-y-6">
                <CandidateDetails c={sheetCandidate} onPlayVideo={playVideo} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!videoModal} onOpenChange={(o) => !o && setVideoModal(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0">
          <DialogTitle className="sr-only">{videoModal?.title ?? 'Vidéo'}</DialogTitle>
          {videoModal && (() => {
            const { type, src } = toEmbedUrl(videoModal.url);
            return (
              <div className="relative w-full aspect-video bg-black">
                {type === 'iframe' ? (
                  <iframe
                    src={src}
                    title={videoModal.title}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video src={src} controls autoPlay className="absolute inset-0 w-full h-full" />
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesAdmin;
