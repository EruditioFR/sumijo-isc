import { useEffect, useState } from 'react';
import { Music2, Loader2, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  photoUrl: string | null;
  photoFullUrl: string | null;
  airsDemieFinale: string[];
  airsFinale: string[];
}

type Phase = 'demi' | 'finale';

const AirsDemiFinaleAdmin = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('demi');

  const phaseLabel = phase === 'demi' ? 'Airs demi-finale' : 'Airs Finale';
  const getAirs = (c: Candidate) => phase === 'demi' ? (c.airsDemieFinale || []) : (c.airsFinale || []);

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

  const exportToCsv = () => {
    if (candidates.length === 0) return;
    const headers = ['Nom', 'Prénom', phaseLabel];
    const rows = candidates.map((c) => [
      c.nom,
      c.prenom,
      getAirs(c).join('; ').replace(/—/g, '-'),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${phase === 'demi' ? 'airs-demi-finale' : 'airs-finale'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-display text-foreground mb-2 flex items-center gap-3">
            <Music2 className="w-8 h-8" />
            Airs
          </h2>
          <p className="text-muted-foreground">
            {candidates.length > 0
              ? `${candidates.length} candidat${candidates.length > 1 ? 's' : ''}`
              : 'Liste des airs choisis par chaque candidat'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={phase} onValueChange={(v) => setPhase(v as Phase)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demi">Demi-Finale</SelectItem>
              <SelectItem value="finale">Finale</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportToCsv} disabled={candidates.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" onClick={fetchCandidates} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
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
                  <TableHead>{phaseLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => {
                  const airs = getAirs(c);
                  return (
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
                    <TableCell>
                      {c.pays ? (
                        <span className="inline-flex items-center gap-2">
                          <CountryFlag name={c.pays} />
                          <span>{c.pays}</span>
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="capitalize">{c.typeVoix || '-'}</TableCell>
                    <TableCell>
                      {airs.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-foreground max-w-[480px]">
                          {airs.map((a, i) => (
                            <li key={i}>{a.replace(/—/g, '-')}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirsDemiFinaleAdmin;
