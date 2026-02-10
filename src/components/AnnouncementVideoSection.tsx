import { useTranslation } from 'react-i18next';

const AnnouncementVideoSection = () => {
  const { i18n } = useTranslation();

  // Only show for non-French languages
  if (i18n.language === 'fr') return null;

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <video
          src="/videos/sumi-jo-announcement-en.mp4"
          autoPlay
          muted
          playsInline
          controls
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default AnnouncementVideoSection;
