import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const CandidatesAdmin = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-display text-foreground mb-2 flex items-center gap-3">
          <Users className="w-8 h-8" />
          {t('admin.candidates')}
        </h2>
        <p className="text-muted-foreground">{t('admin.candidatesSubtitle')}</p>
      </div>

      <div className="bg-background border rounded-xl p-12 text-center">
        <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-display text-foreground mb-2">
          {t('admin.candidatesEmptyTitle')}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('admin.candidatesEmptyDescription')}
        </p>
      </div>
    </div>
  );
};

export default CandidatesAdmin;
