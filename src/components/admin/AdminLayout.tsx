import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ImageIcon, Ticket, Users, LogOut, Home, Music2, HomeIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from './AdminLogin';
import { Skeleton } from '@/components/ui/skeleton';


interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems: { path: string; icon: typeof ImageIcon; labelKey?: string; label?: string }[] = [
  { path: '/admin/gallery', icon: ImageIcon, labelKey: 'admin.images' },
  { path: '/admin/billetterie', icon: Ticket, labelKey: 'admin.ticketing' },
  { path: '/admin/candidats', icon: Users, labelKey: 'admin.candidates' },
  { path: '/admin/airs-demie-finale', icon: Music2, label: 'Airs' },
  { path: '/admin/familles', icon: HomeIcon, label: 'Familles' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading, signOut } = useAdminAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Skeleton className="w-96 h-64 rounded-xl" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-display text-foreground">{t('admin.title')}</h1>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to={item.path}>
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                {t('nav.home')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="md:hidden">
              <Link to="/" aria-label={t('nav.home')}>
                <Home className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:inline-flex">
              <LogOut className="w-4 h-4 mr-2" />
              {t('admin.logout')}
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="md:hidden" aria-label={t('admin.logout')}>
              <LogOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-2">
            {navItems.map(item => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="justify-start"
                onClick={() => setMobileOpen(false)}
              >
                <Link to={item.path}>
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
