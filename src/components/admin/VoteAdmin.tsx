import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, RefreshCw, Vote } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  typeVoix: string;
  photoUrl: string | null;
}

interface ResultRow extends Candidate {
  votes: number;
  percent: number;
}

const VoteAdmin = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<{ candidate_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const publicUrl = `${window.location.origin}/vote`;

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: settings }, candidatesRes, { data: votesData }] = await Promise.all([
        supabase.from('vote_settings').select('id, is_open').limit(1).maybeSingle(),
        supabase.functions.invoke('list-vote-candidates'),
        supabase.from('public_votes').select('candidate_id'),
      ]);
      setSettingsId(settings?.id ?? null);
      setIsOpen(settings?.is_open ?? false);
      if (candidatesRes.error) throw candidatesRes.error;
      setCandidates(candidatesRes.data?.candidates ?? []);
      setVotes(votesData ?? []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleOpen = async (value: boolean) => {
    if (!settingsId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('vote_settings')
        .update({ is_open: value })
        .eq('id', settingsId);
      if (error) throw error;
      setIsOpen(value);
      toast.success(value ? 'Votes ouverts' : 'Votes fermés');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const results = useMemo<ResultRow[]>(() => {
    const counts = new Map<string, number>();
    votes.forEach((v) => counts.set(v.candidate_id, (counts.get(v.candidate_id) ?? 0) + 1));
    const total = votes.length;
    return candidates
      .map((c) => {
        const n = counts.get(c.id) ?? 0;
        return { ...c, votes: n, percent: total ? (n / total) * 100 : 0 };
      })
      .sort((a, b) => b.votes - a.votes);
  }, [candidates, votes]);

  const totalVotes = votes.length;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Lien copié');
  };

  const downloadQR = () => {
    const svg = document.getElementById('vote-qr') as unknown as SVGSVGElement | null;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vote-qr.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-foreground flex items-center gap-2">
            <Vote className="w-6 h-6" /> Vote public — Prix du public
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalVotes} vote{totalVotes > 1 ? 's' : ''} enregistré{totalVotes > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-4 h-4 mr-2" /> Rafraîchir
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base">Ouverture des votes</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Activez pour permettre au public de voter.
              </p>
            </div>
            <Switch checked={isOpen} onCheckedChange={toggleOpen} disabled={saving} />
          </div>
          <div className="rounded-md bg-muted p-3 flex items-center gap-2">
            <code className="text-xs flex-1 truncate">{publicUrl}</code>
            <Button size="sm" variant="ghost" onClick={copyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center">
          <Label className="text-base mb-3">QR code</Label>
          <div className="bg-white p-3 rounded-md">
            <QRCodeSVG id="vote-qr" value={publicUrl} size={160} level="M" />
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={downloadQR}>
            Télécharger
          </Button>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-muted/40">
          <h3 className="font-display text-lg text-foreground">Résultats en direct</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left text-sm text-muted-foreground border-b">
              <tr>
                <th className="p-3 w-16">#</th>
                <th className="p-3 w-16">Photo</th>
                <th className="p-3">Prénom</th>
                <th className="p-3">Nom</th>
                <th className="p-3 text-right">Votes</th>
                <th className="p-3 text-right w-40">Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      {r.photoUrl && (
                        <img
                          src={r.photoUrl}
                          alt={`${r.prenom} ${r.nom}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{r.prenom}</td>
                  <td className="p-3 font-medium">{r.nom}</td>
                  <td className="p-3 text-right tabular-nums">{r.votes}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                      <span className="text-sm tabular-nums w-14 text-right">
                        {r.percent.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    Aucun candidat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default VoteAdmin;
