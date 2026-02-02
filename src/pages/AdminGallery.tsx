import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import ImageManager from '@/components/admin/ImageManager';

const AdminGallery = () => {
  return (
    <AdminAuthProvider>
      <ImageManager />
    </AdminAuthProvider>
  );
};

export default AdminGallery;
