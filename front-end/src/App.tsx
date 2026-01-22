import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import DirecteurCedLayout from "./pages/directeur-ced/DirecteurCedLayout";
import {
  CandidatsPage as CedCandidatsPage,
  SujetsPage as CedSujetsPage,
  ResultatsPage as CedResultatsPage,
  InscritsPage as CedInscritsPage
} from "./pages/directeur-ced/pages";
import DirecteurLaboInterface from "./pages/directeur-labo/DirecteurLabo";

import Scolarite from "./pages/scolarite/Scolarite";
import ProfesseurLayout from "./pages/professeur/ProfesseurLayout";
import {
  SujetsPage as ProfSujetsPage,
  CommissionsPage as ProfCommissionsPage,
  ResultatsPage as ProfResultatsPage,
  InscritsPage as ProfInscritsPage,
  MesCandidatsPage as ProfMesCandidatsPage
} from "./pages/professeur/pages";

// Candidat imports
import CandidatLayout from "./pages/candidat/CandidatLayout";
import {
  InfoPersonnellesPage,
  ParcoursPage,
  PostulerPage,
  SujetsChoisisPage,
  NotificationsPage,
  BacForm,
  LicenceForm,
  MasterForm,
  DutForm,
  IngenieurForm
} from "./pages/candidat/pages";

import DirecteurPoleLayout from "./pages/directeur-pole/DirecteurPoleLayout";
import {
  SujetsPage,
  CandidatsPage,
  CommissionsPage,
  CalendrierPage,
  CommuniquerPage,
  InscriptionPage
} from "./pages/directeur-pole/pages";
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
          
          {/* Directeur CED nested routes */}
          <Route path="/ced-dashboard" element={<DirecteurCedLayout />}>
            <Route index element={<Navigate to="candidats" replace />} />
            <Route path="candidats" element={<CedCandidatsPage />} />
            <Route path="sujets" element={<CedSujetsPage />} />
            <Route path="resultats" element={<CedResultatsPage />} />
            <Route path="inscrits" element={<CedInscritsPage />} />
          </Route>
          
          <Route path="/labo-dashboard" element={<DirecteurLaboInterface />} />
          <Route path="/scolarite-dashboard" element={<Scolarite />} />
          
          {/* Professeur nested routes */}
          <Route path="/professeur-dashboard" element={<ProfesseurLayout />}>
            <Route index element={<Navigate to="sujets" replace />} />
            <Route path="sujets" element={<ProfSujetsPage />} />
            <Route path="commissions" element={<ProfCommissionsPage />} />
            <Route path="resultats" element={<ProfResultatsPage />} />
            <Route path="inscrits" element={<ProfInscritsPage />} />
            <Route path="mes-candidats" element={<ProfMesCandidatsPage />} />
          </Route>
          
          {/* Candidat nested routes */}
          <Route path="/candidat-dashboard" element={<CandidatLayout />}>
            <Route index element={<Navigate to="info-personnelles" replace />} />
            <Route path="info-personnelles" element={<InfoPersonnellesPage />} />
            <Route path="parcours" element={<ParcoursPage />}>
              <Route index element={<Navigate to="bac" replace />} />
              <Route path="bac" element={<BacForm />} />
              <Route path="licence" element={<LicenceForm />} />
              <Route path="master" element={<MasterForm />} />
              <Route path="dut" element={<DutForm />} />
              <Route path="ingenieur" element={<IngenieurForm />} />
            </Route>
            <Route path="postuler" element={<PostulerPage />} />
            <Route path="sujets-choisis" element={<SujetsChoisisPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          
          {/* Directeur Pole nested routes */}
          <Route path="/pole-dashboard" element={<DirecteurPoleLayout />}>
            <Route index element={<Navigate to="sujets" replace />} />
            <Route path="sujets" element={<SujetsPage />} />
            <Route path="candidats" element={<CandidatsPage />} />
            <Route path="commissions" element={<CommissionsPage />} />
            <Route path="calendrier" element={<CalendrierPage />} />
            <Route path="communiquer" element={<CommuniquerPage />} />
            <Route path="inscription" element={<InscriptionPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastViewport />
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
