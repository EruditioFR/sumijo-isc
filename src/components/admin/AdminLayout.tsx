import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ImageIcon, Ticket, Users, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from './AdminLogin';
import { Skeleton } from '@/components/ui/skeleton';


interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin/gallery', icon: ImageIcon, labelKey: 'admin.images' },
  { path: '/admin/billetterie', icon: Ticket, labelKey: 'admin.ticketing' },
  { path: '/admin/candidats', icon: Users, labelKey: 'admin.candidates' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading, signOut } = useAdminAuth();
  const location = useLocation();

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
                    {t(item.labelKey)}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                {t('nav.home')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden border-t px-4 py-2 flex gap-2 overflow-x-auto">
          {navItems.map(item => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              size="sm"
              asChild
              className="shrink-0"
            >
              <Link to={item.path}>
                <item.icon className="w-4 h-4 mr-2" />
                {t(item.labelKey)}
              </Link>
            </Button>
          ))}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
