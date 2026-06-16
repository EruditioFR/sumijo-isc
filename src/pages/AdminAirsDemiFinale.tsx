import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import AirsDemiFinaleAdmin from '@/components/admin/AirsDemiFinaleAdmin';

const AdminAirsDemiFinale = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <AirsDemiFinaleAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminAirsDemiFinale;
