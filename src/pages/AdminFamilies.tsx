import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import FamiliesAdmin from '@/components/admin/FamiliesAdmin';

const AdminFamilies = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <FamiliesAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminFamilies;
