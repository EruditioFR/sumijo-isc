import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const LoadMoreButton = ({ onClick, isLoading, hasMore }: LoadMoreButtonProps) => {
  const { t } = useTranslation();

  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="lg"
        className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('gallery.loading')}
          </>
        ) : (
          t('gallery.loadMore')
        )}
      </Button>
    </div>
  );
};
