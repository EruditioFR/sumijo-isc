import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import VoteAdmin from '@/components/admin/VoteAdmin';

const AdminVote = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <VoteAdmin />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminVote;
