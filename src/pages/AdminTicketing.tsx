import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import TicketingAdmin from '@/components/admin/TicketingAdmin';

const AdminTicketing = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <TicketingAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminTicketing;
