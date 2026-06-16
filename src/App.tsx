import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chateau from "./pages/Chateau";
import SumiJo from "./pages/SumiJo";
import Partenaires from "./pages/Partenaires";
import Jury from "./pages/Jury";
import Contact from "./pages/Contact";
import Billetterie from "./pages/Billetterie";
import Programme from "./pages/Programme";
import ConcertGalaParis from "./pages/ConcertGalaParis";
import Biographies from "./pages/Biographies";
import AdminGallery from "./pages/AdminGallery";
import AdminTicketing from "./pages/AdminTicketing";
import AdminCandidates from "./pages/AdminCandidates";
import AdminCortot from "./pages/AdminCortot";
import AdminAirsDemiFinale from "./pages/AdminAirsDemiFinale";
 import PrivacyPolicy from "./pages/PrivacyPolicy";
 import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chateau" element={<Chateau />} />
            <Route path="/sumi-jo" element={<SumiJo />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/jury" element={<Jury />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/billetterie" element={<Billetterie />} />
            <Route path="/programme" element={<Programme />} />
            <Route path="/concert-gala-paris" element={<ConcertGalaParis />} />
            <Route path="/biographies" element={<Biographies />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/billetterie" element={<AdminTicketing />} />
            <Route path="/admin/candidats" element={<AdminCandidates />} />
            <Route path="/admin/cortot" element={<AdminCortot />} />
            <Route path="/admin/airs-demie-finale" element={<AdminAirsDemiFinale />} />
            <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
            <Route path="/mentions-legales" element={<LegalNotice />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
