 import { useTranslation } from 'react-i18next';
 import Header from "@/components/Header";
 import Footer from "@/components/Footer";
 import ScrollToTop from "@/components/ScrollToTop";
 import { Separator } from "@/components/ui/separator";
 
 const LegalNotice = () => {
   const { t } = useTranslation();
 
   return (
     <div className="min-h-screen bg-cream">
       <Header />
       <ScrollToTop />
       
       <main className="pt-32 pb-20">
         <div className="container mx-auto px-4 max-w-4xl">
           <h1 className="font-elegant text-4xl md:text-5xl text-foreground mb-4">
             {t('legal.title')}
           </h1>
           <p className="text-muted-foreground mb-8">
             {t('legal.lastUpdated')}
           </p>
           
           <Separator className="mb-12" />
           
           {/* Editor */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.editor.title')}
             </h2>
             <div className="bg-gold/5 p-6 rounded-lg border border-gold/20 space-y-2">
               <p className="font-semibold text-foreground">{t('legal.editor.name')}</p>
               <p className="text-muted-foreground">{t('legal.editor.type')}</p>
               <p className="text-muted-foreground">{t('legal.editor.address')}</p>
               <p className="text-muted-foreground">{t('legal.editor.email')}</p>
               <p className="text-muted-foreground">{t('legal.editor.rna')}</p>
             </div>
           </section>
           
           {/* Publication Director */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.director.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.director.content')}
             </p>
           </section>
           
           {/* Hosting */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.hosting.title')}
             </h2>
             <div className="bg-gold/5 p-6 rounded-lg border border-gold/20 space-y-2">
               <p className="font-semibold text-foreground">{t('legal.hosting.name')}</p>
               <p className="text-muted-foreground">{t('legal.hosting.address')}</p>
               <p className="text-muted-foreground">{t('legal.hosting.website')}</p>
             </div>
           </section>
           
           {/* Intellectual Property */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.intellectualProperty.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('legal.intellectualProperty.content1')}
             </p>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.intellectualProperty.content2')}
             </p>
           </section>
           
           {/* Liability */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.liability.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-4">
               {t('legal.liability.content1')}
             </p>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.liability.content2')}
             </p>
           </section>
           
           {/* External Links */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.links.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.links.content')}
             </p>
           </section>
           
           {/* Applicable Law */}
           <section className="mb-12">
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.law.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.law.content')}
             </p>
           </section>
           
           {/* Contact */}
           <section>
             <h2 className="font-elegant text-2xl text-foreground mb-4">
               {t('legal.contact.title')}
             </h2>
             <p className="text-muted-foreground leading-relaxed">
               {t('legal.contact.content')}
             </p>
             <p className="text-gold mt-4 font-semibold">
               contact@aacfi.fr
             </p>
           </section>
         </div>
       </main>
       
       <Footer />
     </div>
   );
 };
 
 export default LegalNotice;