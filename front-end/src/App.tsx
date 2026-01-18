import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/home/Index";
import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Laboratoires from "./pages/home/Laboratoires";
import Formations from "./pages/home/Formations";
import Calendrier from "./pages/home/Calendrier";
import DirecteurCed from "./pages/directeur-ced/DirecteurCed";
import DirecteurLabo from "./pages/directeur-labo/DirecteurLabo";

import Scolarite from "./pages/scolarite/Scolarite";
import Professeur from "./pages/professeur/Prefesseur";
import Candidat from "./pages/candidat/Candidat";
import DirecteurPole from "./pages/directeur-pole/DirecteurPole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/ced" element={<Login />} />
          <Route path="/candidat/pre-inscription" element={<PreInscription />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/laboratoires" element={<Laboratoires />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/ced-dashboard" element={<DirecteurCed />} />
          <Route path="/labo-dashboard" element={<DirecteurLabo />} />
          <Route path="/scolarite-dashboard" element={<Scolarite />} />
          <Route path="/professeur-dashboard" element={<Professeur />} />
          <Route path="/candidat-dashboard" element={<Candidat />} />
          <Route path="/pole-dashboard" element={<DirecteurPole />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastViewport />
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
