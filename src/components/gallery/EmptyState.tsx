import { useTranslation } from 'react-i18next';
import { ImageIcon } from 'lucide-react';

export const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <ImageIcon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {t('gallery.emptyTitle')}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {t('gallery.emptyDescription')}
      </p>
    </div>
  );
};
