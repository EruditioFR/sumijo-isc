 import { useTranslation } from 'react-i18next';
 import Header from "@/components/Header";
 import Footer from "@/components/Footer";
 import ScrollToTop from "@/components/ScrollToTop";
 import { Separator } from "@/components/ui/separator";
 
 const PrivacyPolicy = () => {
   const { t } = useTranslation();
 
   return (
     <div className="min-h-screen bg-cream">
       <Header />
       <ScrollToTop />
       
       <main className="pt-32 pb-20">
         <div className="container mx-auto px-4 max-w-4xl">
           <h1 className="font-elegant text-4xl md:text-5xl text-foreground mb-4">
             {t('privacy.title')}
           </h1>
           <p className="text-muted-foreground mb-8">
             {t('privacy.lastUpdated')}
           </p>
           
           <Separator className="mb-12" />
           
           {/* Introduction */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.intro.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.intro.content')}
             </p>
           </section>
           
           {/* Data Controller */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.controller.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('privacy.controller.content')}
             </p>
             <div className="bg-gold/5 p-6 rounded-lg border border-gold/20">
               <p className="font-semibold text-foreground">{t('privacy.controller.name')}</p>
               <p className="text-muted-foreground">{t('privacy.controller.address')}</p>
               <p className="text-muted-foreground">{t('privacy.controller.email')}</p>
             </div>
           </section>
           
           {/* Data Collected */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.dataCollected.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('privacy.dataCollected.intro')}
             </p>
             
             <h3 className="font-semibold text-foreground mb-2 mt-6">
               {t('privacy.dataCollected.contact.title')}
             </h3>
             <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
               <li>{t('privacy.dataCollected.contact.item1')}</li>
               <li>{t('privacy.dataCollected.contact.item2')}</li>
               <li>{t('privacy.dataCollected.contact.item3')}</li>
             </ul>
             
             <h3 className="font-semibold text-foreground mb-2 mt-6">
               {t('privacy.dataCollected.application.title')}
             </h3>
             <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
               <li>{t('privacy.dataCollected.application.item1')}</li>
               <li>{t('privacy.dataCollected.application.item2')}</li>
               <li>{t('privacy.dataCollected.application.item3')}</li>
               <li>{t('privacy.dataCollected.application.item4')}</li>
             </ul>
             
             <h3 className="font-semibold text-foreground mb-2 mt-6">
               {t('privacy.dataCollected.technical.title')}
             </h3>
             <ul className="list-disc list-inside text-muted-foreground space-y-1">
               <li>{t('privacy.dataCollected.technical.item1')}</li>
               <li>{t('privacy.dataCollected.technical.item2')}</li>
               <li>{t('privacy.dataCollected.technical.item3')}</li>
             </ul>
           </section>
           
           {/* Purpose */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.purpose.title')}
             </h2>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
               <li>{t('privacy.purpose.item1')}</li>
               <li>{t('privacy.purpose.item2')}</li>
               <li>{t('privacy.purpose.item3')}</li>
               <li>{t('privacy.purpose.item4')}</li>
               <li>{t('privacy.purpose.item5')}</li>
             </ul>
           </section>
           
           {/* Legal Basis */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.legalBasis.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('privacy.legalBasis.intro')}
             </p>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
               <li>{t('privacy.legalBasis.item1')}</li>
               <li>{t('privacy.legalBasis.item2')}</li>
               <li>{t('privacy.legalBasis.item3')}</li>
             </ul>
           </section>
           
           {/* Data Retention */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.retention.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.retention.content')}
             </p>
           </section>
           
           {/* Data Sharing */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.sharing.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('privacy.sharing.intro')}
             </p>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
               <li>{t('privacy.sharing.item1')}</li>
               <li>{t('privacy.sharing.item2')}</li>
               <li>{t('privacy.sharing.item3')}</li>
             </ul>
           </section>
           
           {/* International Transfers */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.transfers.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.transfers.content')}
             </p>
           </section>
           
           {/* Your Rights */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.rights.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('privacy.rights.intro')}
             </p>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
               <li><strong>{t('privacy.rights.access.title')}</strong> {t('privacy.rights.access.desc')}</li>
               <li><strong>{t('privacy.rights.rectification.title')}</strong> {t('privacy.rights.rectification.desc')}</li>
               <li><strong>{t('privacy.rights.erasure.title')}</strong> {t('privacy.rights.erasure.desc')}</li>
               <li><strong>{t('privacy.rights.restriction.title')}</strong> {t('privacy.rights.restriction.desc')}</li>
               <li><strong>{t('privacy.rights.portability.title')}</strong> {t('privacy.rights.portability.desc')}</li>
               <li><strong>{t('privacy.rights.objection.title')}</strong> {t('privacy.rights.objection.desc')}</li>
             </ul>
             <p className="text-muted-foreground leading-relaxed mt-4">
               {t('privacy.rights.howTo')}
             </p>
           </section>
           
           {/* Cookies */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.cookies.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.cookies.content')}
             </p>
           </section>
           
           {/* Security */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.security.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.security.content')}
             </p>
           </section>
           
           {/* Changes */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.changes.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.changes.content')}
             </p>
           </section>
           
           {/* Contact */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.contactSection.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.contactSection.content')}
             </p>
             <p className="text-gold mt-4 font-semibold">
               contact@sumijo-isc.com
             </p>
           </section>
           
           {/* CNIL */}
           <section>
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('privacy.cnil.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('privacy.cnil.content')}
             </p>
           </section>
         </div>
       </main>
       
       <Footer />
     </div>
   );
 };
 
 export default PrivacyPolicy;