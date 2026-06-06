import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import CortotAdmin from '@/components/admin/CortotAdmin';

const AdminCortot = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <CortotAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminCortot;
