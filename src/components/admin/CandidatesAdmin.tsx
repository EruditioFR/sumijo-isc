import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, IdCard, Video, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

const CandidatesAdmin = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Button variant="outline" size="sm" onClick={fetchCandidates} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
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
                  <TableHead className="w-16">Photo</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Type de voix</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead className="text-center">Documents</TableHead>
                  <TableHead>Vidéo de présentation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
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
                    <TableCell>{c.pays || '—'}</TableCell>
                    <TableCell className="capitalize">{c.typeVoix || '—'}</TableCell>
                    <TableCell>{formatDate(c.dateNaissance)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {c.cvUrl && (
                          <a
                            href={c.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="CV"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        {c.idUrl && (
                          <a
                            href={c.idUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Carte d'identité"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <IdCard className="w-4 h-4" />
                          </a>
                        )}
                        {!c.cvUrl && !c.idUrl && (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            <span>Source : Airtable « candidats 2026 »</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesAdmin;
