import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import CandidatesAdmin from '@/components/admin/CandidatesAdmin';

const AdminCandidates = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <CandidatesAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminCandidates;
