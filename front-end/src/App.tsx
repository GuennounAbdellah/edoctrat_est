import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Connexion from "./pages/Connexion";
import Login from "./pages/auth/Login";
import PreInscription from "./pages/auth/PreInscription";
import Laboratoires from "./pages/Laboratoires";
import Formations from "./pages/Formations";
import Calendrier from "./pages/Calendrier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/connexion/:role" element={<Login />} />
          <Route path="/candidat/pre-inscription" element={<PreInscription />} />
          <Route path="/laboratoires" element={<Laboratoires />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/calendrier" element={<Calendrier />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
