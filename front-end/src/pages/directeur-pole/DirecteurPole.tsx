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
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  
  // Logout confirmation state
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // State for logged-in director
  const [loggedDirector, setLoggedDirector] = useState<{ nom: string; prenom: string; email: string } | null>(null);

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
    // Fetch logged-in director data from localStorage or auth context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const directorData = {
          nom: userData.nom || userData.lastName || 'Directeur',
          prenom: userData.prenom || userData.firstName || 'Pôle',
          email: userData.email || 'directeur@pole.ma'
        };
        setLoggedDirector(directorData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to a default director
        setLoggedDirector({
          nom: 'Directeur',
          prenom: 'Pôle',
          email: 'directeur@pole.ma'
        });
      }
    } else {
      // If no user data in localStorage, use a default director
      setLoggedDirector({
        nom: 'Directeur',
        prenom: 'Pôle',
        email: 'directeur@pole.ma'
      });
    }

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

  const handleLogout = () => {
    // Clear authentication tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
    
    // Close the confirmation dialog
    setShowLogoutConfirmation(false);
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
      {/* Header Section */}
      <section className="py-6 lg:py-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Espace Directeur de Pôle
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Gestion et supervision des sujets, candidats, commissions et calendrier du pôle doctoral
              </p>
            </motion.div>
            
            {/* Logout button with director's name */}
            {loggedDirector && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border min-w-[200px] order-1 lg:order-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                    <p className="font-medium text-sm">{loggedDirector.prenom} {loggedDirector.nom}</p>
                  </div>
                </div>
                <AlertDialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre espace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Déconnexion</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
          </div>
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
