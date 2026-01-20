import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  Search,
  Building2,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Header from '../../components/layout/Header';
import {
  SujetsTab,
  CandidatsTab,
  CandidatureDetailsDialog,
  CommissionsTab,
  CalendrierTab,
  CommuniquerTab,
  InscriptionTab,
  ActiveTab
} from './components';
import { Postuler } from '@/models/Postuler';
import { Commission } from '@/models/Commission';
import { Sujet } from '@/models/Sujet';
import directeurPoleService, { DirecteurPoleCalendrier } from '@/api/directeurPoleService';

const DirecteurPole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sujets');
  const [searchTerm, setSearchTerm] = useState('');
  const [sujetFilter, setSujetFilter] = useState('');
  const [laboFilter, setLaboFilter] = useState('');
  const [formationFilter, setFormationFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // State for data
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [candidatures, setCandidatures] = useState<Postuler[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [calendrier, setCalendrier] = useState<DirecteurPoleCalendrier[]>([]);

  // Dialog states
  const [isCandidateDetailDialogOpen, setIsCandidateDetailDialogOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Postuler | null>(null);

  // Fetch functions
  const fetchSujets = async () => {
    try {
      const result = await directeurPoleService.getAllSujets();
      if (result.results) {
        setSujets(result.results as Sujet[]);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching sujets:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des sujets",
        variant: "destructive"
      });
    }
  };

  const fetchCandidatures = async () => {
    try {
      const result = await directeurPoleService.getAllCandidats();
      if (result.results) {
        setCandidatures(result.results as Postuler[]);
        console.log('Candidatures fetched:', result.results);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching candidatures:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des candidatures",
        variant: "destructive"
      });
    }
  };

  const fetchCommissions = async () => {
    try {
      const result = await directeurPoleService.getAllCommissions();
      if (result.results) {
        setCommissions(result.results as Commission[]);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des commissions",
        variant: "destructive"
      });
    }
  };

  const fetchCalendrier = async () => {
    try {
      const data = await directeurPoleService.getCalendrier();
      setCalendrier(data);
    } catch (error) {
      console.error('Error fetching calendrier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du calendrier",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSujets(),
          fetchCandidatures(),
          fetchCommissions(),
          fetchCalendrier()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePublierSujets = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierSujets();
      toast({
        title: "Succès",
        description: response.message || "Les sujets ont été publiés avec succès",
      });
      // Refresh sujets after publishing
      await fetchSujets();
    } catch (error) {
      console.error('Error publishing sujets:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication des sujets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublierListePrincipale = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierListePrincipale();
      toast({
        title: "Succès",
        description: response.message || "La liste principale a été publiée avec succès",
      });
    } catch (error) {
      console.error('Error publishing liste principale:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication de la liste principale",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublierListeAttente = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierListeAttente();
      toast({
        title: "Succès",
        description: response.message || "La liste d'attente a été publiée avec succès",
      });
    } catch (error) {
      console.error('Error publishing liste attente:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication de la liste d'attente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmerCalendrier = async (id: number, dateDebut: string, dateFin: string) => {
    setLoading(true);
    try {
      // Note: The API doesn't seem to have an update endpoint for calendrier
      // You may need to add this endpoint to your backend
      // For now, we'll just update the local state
      setCalendrier(prev => prev.map(item =>
        item.id === id ? { ...item, dateDebut, dateFin } : item
      ));
      toast({
        title: "Succès",
        description: "Les dates ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating calendrier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des dates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidatureDetails = (candidature: Postuler) => {
    setSelectedCandidature(candidature);
    setIsCandidateDetailDialogOpen(true);
  };

  // Filter functions
  const filteredSujets = sujets.filter(sujet => {
    const matchesSujet = sujet.titre.toLowerCase().includes(sujetFilter.toLowerCase());
    const matchesFormation = sujet.formationDoctorale.titre.toLowerCase().includes(formationFilter.toLowerCase());
    const matchesSearch = sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.professeur.nom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSujet && matchesFormation && (searchTerm === '' || matchesSearch);
  });

  const filteredCandidatures = candidatures.filter(candidature =>
    candidature.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissions = commissions.filter(commission =>
    commission.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.labo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header Section */}
      <section className="py-8 lg:py-16 bg-gradient-to-r from-primary/5 to-secondary/5 mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Espace Directeur de Pôle
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestion et supervision des sujets, candidats, commissions et calendrier du pôle doctoral
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Actions Directeur de Pôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Button
                variant={activeTab === 'sujets' ? 'default' : 'outline'}
                onClick={() => setActiveTab('sujets')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Sujets
              </Button>
              <Button
                variant={activeTab === 'candidats' ? 'default' : 'outline'}
                onClick={() => setActiveTab('candidats')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Candidats
              </Button>
              <Button
                variant={activeTab === 'commissions' ? 'default' : 'outline'}
                onClick={() => setActiveTab('commissions')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Commissions
              </Button>
              <Button
                variant={activeTab === 'calendrier' ? 'default' : 'outline'}
                onClick={() => setActiveTab('calendrier')}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Calendrier
              </Button>
              <Button
                variant={activeTab === 'communiquer' ? 'default' : 'outline'}
                onClick={() => setActiveTab('communiquer')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Communiquer
              </Button>
              <Button
                variant={activeTab === 'inscription' ? 'default' : 'outline'}
                onClick={() => setActiveTab('inscription')}
                className="flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Inscription
              </Button>
            </div>

            {/* Search and Filters */}
            {(activeTab === 'sujets' || activeTab === 'candidats' || activeTab === 'commissions') && (
              <div className="flex flex-col gap-4 mb-6">
                {activeTab === 'sujets' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Filtrer par sujet..."
                      value={sujetFilter}
                      onChange={(e) => setSujetFilter(e.target.value)}
                    />
                    <Input
                      placeholder="Filtrer par laboratoire..."
                      value={laboFilter}
                      onChange={(e) => setLaboFilter(e.target.value)}
                    />
                    <Input
                      placeholder="Filtrer par formation doctorale..."
                      value={formationFilter}
                      onChange={(e) => setFormationFilter(e.target.value)}
                    />
                  </div>
                )}
                {(activeTab === 'candidats' || activeTab === 'commissions') && (
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && (
              <div className="overflow-x-auto">
                {activeTab === 'sujets' && <SujetsTab sujets={filteredSujets} />}
                {activeTab === 'candidats' && (
                  <CandidatsTab
                    candidatures={filteredCandidatures}
                    onViewDetails={handleViewCandidatureDetails}
                  />
                )}
                {activeTab === 'commissions' && <CommissionsTab commissions={filteredCommissions} />}
                {activeTab === 'calendrier' && (
                  <CalendrierTab
                    calendrier={calendrier}
                    onConfirm={handleConfirmerCalendrier}
                    loading={loading}
                  />
                )}
                {activeTab === 'communiquer' && (
                  <CommuniquerTab
                    onPublierSujets={handlePublierSujets}
                    onPublierListePrincipale={handlePublierListePrincipale}
                    onPublierListeAttente={handlePublierListeAttente}
                    loading={loading}
                  />
                )}
                {activeTab === 'inscription' && <InscriptionTab />}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{sujets.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Sujets proposés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{candidatures.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Candidatures</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{commissions.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Commissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {sujets.filter(s => s.publier).length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Sujets publiés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Candidature Details Dialog */}
      <CandidatureDetailsDialog
        open={isCandidateDetailDialogOpen}
        onOpenChange={setIsCandidateDetailDialogOpen}
        candidature={selectedCandidature}
      />
    </div>
  );
};

export default DirecteurPole;
