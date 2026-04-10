import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageManager from '@/components/admin/ImageManager';

const AdminGallery = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <ImageManager />
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminGallery;
