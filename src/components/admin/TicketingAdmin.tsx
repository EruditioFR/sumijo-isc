import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, Users, Mail, Ticket, Calendar, Euro, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SeatMapPreview } from './SeatMapPreview';
import { cn } from '@/lib/utils';

// ── Types ──

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  notified_at: string | null;
}

interface Attendee {
  id: string;
  firstname: string;
  name: string;
  email: string;
  ticket: string;
  category: string;
  price: string;
  order_ext_id: string;
  order_date: string;
  order_paid: string;
  order_price: string;
  order_payment_type: string;
  used: string;
  used_date: string;
  disabled: string;
  custom_order?: Record<string, string>;
}

interface Availability {
  type: string;
  id?: string;
  name?: string;
  avail: string | number;
  quota: string | number | false;
  status: string;
}

interface BilletwebEvent {
  id: string;
  name: string;
  start: string;
  end: string;
  place: string;
}

// ── Notifications Tab ──

const NotificationsTab = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ticketing_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSubscribers(data || []);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const exportCSV = () => {
    const headers = ['Email', 'Date inscription', 'Notifié'];
    const rows = subscribers.map(s => [
      s.email,
      format(new Date(s.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
      s.notified_at ? 'Oui' : 'Non'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-billetterie-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Users} color="primary" label="Total inscrits" value={isLoading ? '—' : subscribers.length} />
        <StatCard icon={Mail} color="green" label="Notifiés" value={isLoading ? '—' : subscribers.filter(s => s.notified_at).length} />
        <StatCard icon={Mail} color="amber" label="En attente" value={isLoading ? '—' : subscribers.filter(s => !s.notified_at).length} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Abonnés notifications billetterie</CardTitle>
            <CardDescription>Liste des personnes inscrites aux notifications</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchSubscribers} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={subscribers.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun abonné pour le moment</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map(subscriber => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{format(new Date(subscriber.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</TableCell>
                      <TableCell>
                        {subscriber.notified_at ? (
                          <Badge variant="default" className="bg-green-600">Notifié</Badge>
                        ) : (
                          <Badge variant="secondary">En attente</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Reservations Tab ──

const ReservationsTab = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [event, setEvent] = useState<BilletwebEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/billetweb-proxy?action=all`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setAttendees(data.attendees || []);
      setAvailability(data.availability || []);
      setEvent(data.event || null);
    } catch (err: any) {
      console.error('Failed to fetch Billetweb data:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Deduplicate by order — group attendees by order_ext_id
  const orders = useMemo(() => {
    const map = new Map<string, Attendee[]>();
    attendees.forEach(a => {
      const list = map.get(a.order_ext_id) || [];
      list.push(a);
      map.set(a.order_ext_id, list);
    });
    return Array.from(map.entries()).map(([orderId, items]) => ({
      orderId,
      buyer: `${items[0].firstname} ${items[0].name}`,
      email: items[0].email,
      date: items[0].order_date,
      totalPrice: items[0].order_price,
      paid: items[0].order_paid === '1',
      paymentType: items[0].order_payment_type,
      tickets: items,
      city: items[0].custom_order?.Ville || '',
      country: items[0].custom_order?.Pays || '',
    }));
  }, [attendees]);

  const totalRevenue = useMemo(() =>
    orders.reduce((sum, o) => sum + (o.paid ? parseFloat(o.totalPrice) : 0), 0),
    [orders]
  );

  const categories = useMemo(() =>
    availability.filter(a => a.type === 'category'),
    [availability]
  );

  const exportCSV = () => {
    const headers = ['Commande', 'Acheteur', 'Email', 'Ville', 'Pays', 'Date', 'Billets', 'Montant', 'Payé', 'Moyen'];
    const rows = orders.map(o => [
      o.orderId,
      `"${o.buyer}"`,
      o.email,
      `"${o.city}"`,
      o.country,
      format(new Date(o.date), 'dd/MM/yyyy HH:mm', { locale: fr }),
      o.tickets.length,
      `${o.totalPrice}€`,
      o.paid ? 'Oui' : 'Non',
      o.paymentType,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-billetweb-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchData}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Ticket} color="primary" label="Billets vendus" value={isLoading ? '—' : attendees.filter(a => a.disabled === '0').length} />
        <StatCard icon={Users} color="blue" label="Commandes" value={isLoading ? '—' : orders.length} />
        <StatCard icon={Euro} color="green" label="Chiffre d'affaires" value={isLoading ? '—' : `${totalRevenue.toFixed(0)}€`} />
        <StatCard icon={CheckCircle} color="emerald" label="Payées" value={isLoading ? '—' : orders.filter(o => o.paid).length} />
      </div>

      {/* Seat map */}
      {!isLoading && (
        <SeatMapPreview attendees={attendees.map(a => ({ category: a.category, disabled: a.disabled }))} />
      )}

      {/* Availability by category */}
      {!isLoading && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Disponibilité par journée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(cat => {
                const quota = typeof cat.quota === 'number' ? cat.quota : (cat.quota === false ? null : parseInt(String(cat.quota)));
                const avail = typeof cat.avail === 'number' ? cat.avail : parseInt(String(cat.avail));
                const sold = quota && avail >= 0 ? quota - avail : 0;
                const pct = quota && quota > 0 ? Math.round((sold / quota) * 100) : 0;

                return (
                  <div key={cat.id} className="border rounded-lg p-3">
                    <p className="text-sm font-medium truncate" title={cat.name}>{cat.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {avail < 0 ? 'Illimité' : `${sold}/${quota} vendus`}
                      </span>
                      {avail >= 0 && quota && (
                        <Badge variant={pct > 80 ? 'destructive' : pct > 50 ? 'default' : 'secondary'}>
                          {pct}%
                        </Badge>
                      )}
                    </div>
                    {avail >= 0 && quota && quota > 0 && (
                      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            pct > 80 ? "bg-destructive" : pct > 50 ? "bg-primary" : "bg-muted-foreground/30"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Réservations Billetweb</CardTitle>
            <CardDescription>
              {event ? `${event.name} — ${format(new Date(event.start), 'dd MMM', { locale: fr })} au ${format(new Date(event.end), 'dd MMM yyyy', { locale: fr })}` : 'Données en temps réel depuis Billetweb'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={orders.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune réservation pour le moment</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acheteur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Billets</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.buyer}</TableCell>
                      <TableCell className="text-sm">{order.email}</TableCell>
                      <TableCell className="text-sm">{order.city}{order.country ? ` (${order.country})` : ''}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.tickets.map(t => (
                            <div key={t.id} className="text-xs">
                              <span className="text-muted-foreground">{t.ticket}</span>
                              <span className="ml-1 font-medium">{t.price}€</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{order.totalPrice}€</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(order.date), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {order.paid ? (
                          <Badge variant="default" className="bg-green-600">Payé</Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Shared StatCard ──

const StatCard = ({ icon: Icon, color, label, value }: {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
}) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", c.bg)}>
            <Icon className={cn("w-6 h-6", c.text)} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ── Main Component ──

export const TicketingAdmin = () => {
  return (
    <Tabs defaultValue="reservations" className="space-y-6">
      <TabsList>
        <TabsTrigger value="reservations" className="gap-2">
          <Ticket className="w-4 h-4" />
          Suivi des résa
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Mail className="w-4 h-4" />
          Notifications billetterie
        </TabsTrigger>
      </TabsList>

      <TabsContent value="reservations">
        <ReservationsTab />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default TicketingAdmin;
