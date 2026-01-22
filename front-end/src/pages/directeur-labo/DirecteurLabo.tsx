import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Download, 
  GraduationCap,
  Calendar,
  UserCheck,
  Search,
  Plus,
  Eye,
  Send,
  CheckCircle,
  Edit,
  Trash2,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Import tab components
import CandidatesTab from './CandidatesTab';
import SubjectsTab from './SubjectsTab';
import CommissionsTab from './CommissionsTab';
import ResultsTab from './ResultsTab';
import PreselectionTab from './PreselectionTab';
import PvGlobalTab from './PvGlobalTab';
import CreateCommissionWizard from './CreateCommissionWizard';
import Header from '../../components/layout/Header';

// Import models
import { Candidat, JoinedCandidate } from '@/models/Candidat';
import { Sujet } from '@/models/Sujet';
import { Commission } from '@/models/Commission';
import { FormationDoctorale } from '@/models/FormationDoctorale';
import { Examiner } from '@/models/Examiner';
import { Professeur } from '@/models/Professeur';
import { DirecteurLabo } from '@/models/DirecteurLabo';
import { Diplome } from '@/models/Diplome';

// Import services
import { DirecteurLaboService } from '@/api/directeurLaboService';
import { useToast } from '@/hooks/use-toast';

const DirecteurLaboInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidats' | 'sujets' | 'commissions' | 'preselection' | 'resultats' | 'pv'>('candidats');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // State for logged-in director
  const [loggedDirector, setLoggedDirector] = useState<DirecteurLabo | null>(null);

  // State for data
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [formations, setFormations] = useState<FormationDoctorale[]>([]);
  const [results, setResults] = useState<Examiner[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
 
  // Dialog states
  const [isSujetDialogOpen, setIsSujetDialogOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [isCandidateDetailDialogOpen, setIsCandidateDetailDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<JoinedCandidate | null>(null);
  const [candidateDiplomes, setCandidateDiplomes] = useState<Diplome[]>([]);
  
  // Logout confirmation state
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Form states
  const [sujetFormData, setSujetFormData] = useState({
    titre: '',
    description: '',
    directeur: '',
    coDirecteur: '',
    formationDoctorale: ''
  });

  const [commissionFormData, setCommissionFormData] = useState({
    dateCommission: '',
    heure: '',
    lieu: '',
    sujetIds: [] as number[]
  });

  useEffect(() => {
    // Check authentication before loading
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found. User needs to login.');
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour accéder à cette page.",
        variant: "destructive",
      });
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    // Fetch logged-in director data from backend
    const fetchDirectorInfo = async () => {
      try {
        const directorData = await DirecteurLaboService.getDirecteurLaboInfo();
        setLoggedDirector(directorData);
      } catch (error) {
        console.error('Error fetching director info:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du directeur. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        // Fallback to localStorage if backend call fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const fallbackDirector: DirecteurLabo = {
              id: userData.id,
              nom: userData.nom || userData.lastName,
              prenom: userData.prenom || userData.firstName,
              email: userData.email,
              departement: userData.departement || 'Informatique'
            };
            setLoggedDirector(fallbackDirector);
          } catch (e) {
            console.error('Error parsing localStorage user data:', e);
          }
        }
      }
    };
    
    fetchDirectorInfo();
    fetchAllData();
    fetchProfesseurs(); // Fetch professors for dropdowns
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchCandidats();
      await fetchSujets();
      await fetchCommissions();
      await fetchFormations();
      await fetchResults();
      await fetchJoinedCandidats(); // Add this call
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidats = async () => {
    try {
      // Note: This would require an appropriate API endpoint
      // For now, we'll use the joined data approach since there doesn't seem to be a simple "get all candidats" endpoint
      const response = await DirecteurLaboService.getJoinedCandidats();
      
      // Extract unique candidates from the joined data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uniqueCandidats = response.reduce((acc: Candidat[], item: any) => {
        // Check if item and candidat exist and have cne
        if (!item || !item.candidat || !item.candidat.cne) {
          return acc;
        }
        
        // Check if candidate already exists in accumulator
        const exists = acc.some(c => c.cne === item.candidat.cne);
        
        if (!exists) {
          acc.push(item.candidat);
        }
        
        return acc;
      }, []);
      
      setCandidats(uniqueCandidats);
    } catch (error) {
      console.error('Error fetching candidats:', error);
      setCandidats([]); // Set to empty array on error
    }
  };

  const fetchSujets = async () => {
    try {
      const response = await DirecteurLaboService.getAllSujets();
      // Transform backend response to frontend Sujet model
      const transformedSujets: Sujet[] = response.results.map(item => ({
        id: item.id,
        titre: item.titre,
        description: item.description,
        motsCles: item.motsCles,
        dateDepot: item.dateDepot,
        publier: item.publier,
        pathFile: item.pathFile,
        professeur: item.professeur,
        formationDoctorale: item.formationDoctorale,
        coDirecteur: item.coDirecteur || null  // Handle coDirecteur field from backend response
      }));
      setSujets(transformedSujets);
    } catch (error) {
      console.error('Error fetching sujets:', error);
      setSujets([]); // Empty array instead of mock data
    }
  };

  const fetchCommissions = async () => {
    // try {
    //   const response = await DirecteurLaboService.getAllCommissions();
    //   console.log('Fetched commissions:', response);
    //   setCommissions(response.results || []);
    // } catch (error) {
    //   console.error('Error fetching commissions:', error);
    //   setCommissions([]);
    // }
  };


  const fetchFormations = async () => {
    try {
      const response = await DirecteurLaboService.getFormations();
      console.log('Fetched formations:', response);
      // The getFormations method returns an array directly
      setFormations(response || []);
    } catch (error) {
      console.error('Error fetching formations:', error);
      setFormations([]);
    }
  };
  const fetchProfesseurs = async () => {
    try {
      const response = await DirecteurLaboService.getProfesseurs();
      console.log('Fetched professeurs:', response);
      setProfesseurs(response || []);
    } catch (error) {
      console.error('Error fetching professeurs:', error);
      setProfesseurs([]);
    }
  };
  const fetchResults = async () => {
    // try {
    //   // Assuming there's an API to get examiner results
    //   // Using the labo candidat service as it likely contains results
    //   const response = await DirecteurLaboService.getLaboCandidats();
    //   console.log('Fetched results:', response);
    //   setResults(response.results || []);
    // } catch (error) {
    //   console.error('Error fetching results:', error);
    //   setResults([]);
    // }
  };

  const fetchJoinedCandidats = async () => {
    try {
      const response = await DirecteurLaboService.getJoinedCandidats();
      // We don't need to store this separately since it's used in the CandidatesTab
      // Just log the data to confirm it's working
    } catch (error) {
      console.error('Error fetching joined candidats:', error);
    }
  };

  const handleCreateSujet = async () => {
    try {
      const newSujet = {
        titre: sujetFormData.titre,
        professeur: { id: parseInt(sujetFormData.directeur) } as Professeur,
        formationDoctorale: { id: parseInt(sujetFormData.formationDoctorale) } as FormationDoctorale,
        description: sujetFormData.description,
        motsCles: '',
        dateDepot: new Date().toISOString().split('T')[0],
        publier: false,
        pathFile: '',
        coDirecteur: sujetFormData.coDirecteur ? { id: parseInt(sujetFormData.coDirecteur) } as Professeur : null
      };
      
      await DirecteurLaboService.createSujet(newSujet);
      toast({
        title: "Succès",
        description: "Le sujet a été créé avec succès",
      });
      setSujetFormData({ titre: '', description: '', directeur: '', coDirecteur: '', formationDoctorale: '' });
      setIsSujetDialogOpen(false);
      await fetchSujets();
    } catch (error) {
      console.error('Error creating sujet:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du sujet",
        variant: "destructive",
      });
      setSujetFormData({ titre: '', description: '', directeur: '', coDirecteur: '', formationDoctorale: '' });
      setIsSujetDialogOpen(false);
    }
  };

  const handleCreateCommission = async () => {
    try {
      const newCommission = {
        dateCommission: commissionFormData.dateCommission,
        heure: commissionFormData.heure,
        lieu: commissionFormData.lieu,
        labo: 1, // Default labo ID
        valider: false
      };
      
      await DirecteurLaboService.createCommission(newCommission);
      setCommissionFormData({ dateCommission: '', heure: '', lieu: '', sujetIds: [] });
      setIsCommissionDialogOpen(false);
      await fetchCommissions();
    } catch (error) {
      console.error('Error creating commission:', error);
      setCommissionFormData({ dateCommission: '', heure: '', lieu: '', sujetIds: [] });
      setIsCommissionDialogOpen(false);
      await fetchCommissions();
    }
  };

  const handleDownloadPV = (format: 'pdf' | 'excel') => {
    console.log(`Downloading PV in ${format} format`);
  };

  const handleValidateCommission = async (commissionId: number) => {
    try {
      await DirecteurLaboService.validateCommission(commissionId, { valider: true });
      await fetchCommissions();
    } catch (error) {
      console.error('Error validating commission:', error);
      await fetchCommissions(); // Refresh anyway to show current state
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewCandidateDetails = async (candidateData: any) => {
    // Check if we already have the candidate data in our local state
    let completeCandidate = candidats.find(c => c.cne === candidateData.cne);
    
    if (!completeCandidate) {
      // Fetch complete candidate data from the database if not found locally
      try {
        completeCandidate = await DirecteurLaboService.getCandidateByCNE(candidateData.cne);
      } catch (error) {
        console.error('Error fetching complete candidate data:', error);
        // Use fallback candidate data if API call fails
        completeCandidate = {
          id: candidateData.id,
          cne: candidateData.cne,
          nom: candidateData.nom,
          prenom: candidateData.prenom,
          // Add other fields with default values since we don't have the full candidat data
          pays: '',
          email: '',
          cin: '',
          nomCandidatAr: undefined,
          prenomCandidatAr: undefined,
          adresse: '',
          adresseAr: undefined,
          sexe: '',
          villeDeNaissance: '',
          villeDeNaissanceAr: undefined,
          ville: '',
          dateDeNaissance: '',
          typeDeHandiCape: '',
          academie: undefined,
          telCandidat: '',
          pathCv: undefined,
          pathPhoto: undefined,
          etatDossier: undefined,
          situation_familiale: undefined,
          fonctionnaire: undefined
        };
      }
    }
    
    // Combine the complete candidate data with the joined data
    const combinedCandidate: JoinedCandidate = {
      ...completeCandidate,
      sujetPostule: candidateData.sujetPostule,
      directeurNom: candidateData.directeurNom,
      directeurPrenom: candidateData.directeurPrenom,
      codirecteurNom: candidateData.codirecteurNom || '',
      codirecteurPrenom: candidateData.codirecteurPrenom || '',
      formationDoctorale: candidateData.formationDoctorale,
    };
    
    setSelectedCandidate(combinedCandidate);
    
    // Fetch diplomes for this candidate
    try {
      const diplomes = await DirecteurLaboService.getCandidateDiplomes(candidateData.cne);
      setCandidateDiplomes(diplomes);
    } catch (error) {
      console.error('Error fetching candidate diplomes:', error);
      setCandidateDiplomes([]); // Set empty array if there's an error
    }
    
    setIsCandidateDetailDialogOpen(true);
  };

  // Filter functions
  const filteredCandidats = candidats.filter(candidat =>
    candidat && 
    candidat.nom && 
    candidat.prenom && 
    candidat.email && 
    candidat.cne && (
      candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.cne.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredSujets = sujets.filter(sujet =>
    sujet && 
    sujet.titre && (
      sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sujet.description && sujet.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const filteredCommissions = commissions.filter(commission =>
    commission && commission.lieu && 
    commission.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = results.filter(result =>
    result && (
      (result.candidat?.nom && result.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.candidat?.prenom && result.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.sujet?.titre && result.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const getDecisionBadge = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'admis':
        return <Badge className="bg-green-500">Admis</Badge>;
      case 'ajourné':
        return <Badge className="bg-yellow-500">Ajourné</Badge>;
      case 'refusé':
        return <Badge className="bg-red-500">Refusé</Badge>;
      default:
        return <Badge variant="secondary">{decision}</Badge>;
    }
  };

  const getPublicationBadge = (publier: boolean) => {
    return publier ? (
      <Badge className="bg-green-500">Publié</Badge>
    ) : (
      <Badge className="bg-gray-500">Non publié</Badge>
    );
  };

  const getStatusBadge = (valider: boolean) => {
    return valider ? (
      <Badge className="bg-green-500">Validé</Badge>
    ) : (
      <Badge className="bg-yellow-500">Non validé</Badge>
    );
  };

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
                Espace Directeur de Laboratoire
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gestion et supervision des candidats, sujets et commissions
              </p>
            </motion.div>
          </div>
        </section>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Actions Directeur de Laboratoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Button
                variant={activeTab === 'candidats' ? 'default' : 'outline'}
                onClick={() => setActiveTab('candidats')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Candidats
              </Button>
              <Button
                variant={activeTab === 'sujets' ? 'default' : 'outline'}
                onClick={() => setActiveTab('sujets')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Sujets
              </Button>
              <Button
                variant={activeTab === 'commissions' ? 'default' : 'outline'}
                onClick={() => setActiveTab('commissions')}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Commissions
              </Button>
              <Button
                variant={activeTab === 'preselection' ? 'default' : 'outline'}
                onClick={() => setActiveTab('preselection')}
                className="flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Présélection
              </Button>
              <Button
                variant={activeTab === 'resultats' ? 'default' : 'outline'}
                onClick={() => setActiveTab('resultats')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Résultats
              </Button>
              <Button
                variant={activeTab === 'pv' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pv')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PV Global
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === 'sujets' && (
                <Button onClick={() => setIsSujetDialogOpen(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un sujet
                </Button>
              )}
              {activeTab === 'commissions' && (
                <Button onClick={() => setIsCommissionDialogOpen(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer une commission
                </Button>
              )}
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && (
              <div className="overflow-x-auto">
                {activeTab === 'candidats' && (
                  <CandidatesTab 
                    // candidats={candidats}
                    searchTerm={searchTerm}
                    onViewCandidateDetails={handleViewCandidateDetails}
                  />
                )}

                {activeTab === 'sujets' && (
                  <SubjectsTab 
                    searchTerm={searchTerm}
                    onAddSubject={() => setIsSujetDialogOpen(true)}
                  />
                )}

                {activeTab === 'commissions' && (
                  <CommissionsTab 
                    searchTerm={searchTerm}
                    onCreateCommission={() => setIsCommissionDialogOpen(true)}
                    onValidateCommission={handleValidateCommission}
                  />
                )}

                {activeTab === 'preselection' && (
                  <PreselectionTab onSendInvitations={function (): void {
                    throw new Error('Function not implemented.');
                  } }                  />
                )}

                {activeTab === 'resultats' && (
                  <ResultsTab 
                    results={results}
                    searchTerm={searchTerm}
                    onViewCandidateDetails={handleViewCandidateDetails}
                  />
                )}

                {activeTab === 'pv' && (
                  <PvGlobalTab 
                    onDownloadPV={handleDownloadPV}
                  />
                )}
              </div>
            )}


            {!loading && activeTab === 'sujets' && filteredSujets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun sujet trouvé
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter un sujet */}
      <Dialog open={isSujetDialogOpen} onOpenChange={setIsSujetDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau sujet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titre" className="text-right">Titre</Label>
              <Input 
                id="titre" 
                value={sujetFormData.titre}
                onChange={(e) => setSujetFormData({...sujetFormData, titre: e.target.value})}
                className="col-span-3" 
                placeholder="Titre du sujet de recherche"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={sujetFormData.description}
                onChange={(e) => setSujetFormData({...sujetFormData, description: e.target.value})}
                className="col-span-3"
                placeholder="Description du sujet de recherche"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="directeur" className="text-right">Directeur</Label>
              <Select
                value={sujetFormData.directeur}
                onValueChange={(value) => setSujetFormData({...sujetFormData, directeur: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un directeur" />
                </SelectTrigger>
                <SelectContent>
                {Array.isArray(professeurs) &&
                  professeurs
                    .filter(
                      (professeur) =>
                        String(professeur.id) !== sujetFormData.coDirecteur
                    )
                    .map((professeur) => (
                      <SelectItem
                        key={professeur.id}
                        value={String(professeur.id)}
                      >
                        {professeur.prenom} {professeur.nom}
                      </SelectItem>
                    ))
                }
              </SelectContent>

              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coDirecteur" className="text-right">Co-directeur</Label>
              <Select
                value={sujetFormData.coDirecteur}
                onValueChange={(value) => setSujetFormData({...sujetFormData, coDirecteur: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un co-directeur (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                {Array.isArray(professeurs) &&
                  professeurs
                    .filter(
                      (professeur) =>
                        String(professeur.id) !== sujetFormData.directeur
                    )
                    .map((professeur) => (
                      <SelectItem
                        key={professeur.id}
                        value={String(professeur.id)}
                      >
                        {professeur.prenom} {professeur.nom}
                      </SelectItem>
                    ))
                }
              </SelectContent>

              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formation" className="text-right">Formation Doctorale</Label>
              <Select 
                value={sujetFormData.formationDoctorale}
                onValueChange={(value) => setSujetFormData({...sujetFormData, formationDoctorale: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                {Array.isArray(formations) &&
                  formations.map((formation) => (
                    <SelectItem
                      key={formation.id}
                      value={String(formation.id)}
                    >
                      {formation.titre}
                    </SelectItem>
                  ))
                }
              </SelectContent>

              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSujetDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateSujet} disabled={!sujetFormData.titre || !sujetFormData.directeur || !sujetFormData.formationDoctorale}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commission Creation Wizard */}
      <CreateCommissionWizard
        isOpen={isCommissionDialogOpen}
        onClose={() => setIsCommissionDialogOpen(false)}
        onSuccess={fetchCommissions}
        laboratoireId={loggedDirector?.laboratoireId}
      />

      {/* Dialog pour afficher les détails du candidat */}
      <Dialog open={isCandidateDetailDialogOpen} onOpenChange={() => setIsCandidateDetailDialogOpen(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du Candidat</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6 py-4">
              {/* Section avec photo et informations principales */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Photo du candidat */}
                  <div className="flex-shrink-0">
                    <div className="relative w-48 h-48 mx-auto md:mx-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        {selectedCandidate.pathPhoto ? (
                          <img 
                            src={selectedCandidate.pathPhoto} 
                            alt={`${selectedCandidate.prenom} {selectedCandidate.nom}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white">
                              {selectedCandidate.prenom.charAt(0)}{selectedCandidate.nom.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Badge état du dossier */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                          selectedCandidate.etatDossier === 1 ? 'bg-green-500 text-white' : 
                          selectedCandidate.etatDossier === 0 ? 'bg-yellow-500 text-white' : 
                          'bg-red-500 text-white'
                        }`}>
                          {selectedCandidate.etatDossier === 1 ? '✓ Validé' : 
                          selectedCandidate.etatDossier === 0 ? '⏳ En cours' : '✗ Refusé'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {selectedCandidate.prenom} {selectedCandidate.nom}
                      </h3>
                      <p className="text-lg text-gray-600">{selectedCandidate.email}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">CNE</Label>
                        <div className="text-lg font-bold text-indigo-600">{selectedCandidate.cne}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">CIN</Label>
                        <div className="text-lg font-bold text-gray-900">{selectedCandidate.cin}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Téléphone</Label>
                        <div className="text-lg font-bold text-gray-900">{selectedCandidate.telCandidat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section informations personnelles détaillées */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Sexe</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.sexe}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Date de naissance</Label>
                    <div className="text-base font-semibold text-gray-900">
                      {new Date(selectedCandidate.dateDeNaissance).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Ville de naissance</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.villeDeNaissance}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Pays</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.pays}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Ville</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.ville}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Situation familiale</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.situation_familiale || 'Non spécifié'}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Fonctionnaire</Label>
                    <div className="text-base font-semibold text-gray-900">
                      {selectedCandidate.fonctionnaire === 'true' ? 'Oui' : selectedCandidate.fonctionnaire === 'false' ? 'Non' : 'Non spécifié'}
                    </div>
                  </div>
                  {selectedCandidate.typeDeHandiCape && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Type de handicap</Label>
                      <div className="text-base font-semibold text-gray-900">{selectedCandidate.typeDeHandiCape}</div>
                    </div>
                  )}
                  {selectedCandidate.academie && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Académie</Label>
                      <div className="text-base font-semibold text-gray-900">{selectedCandidate.academie}</div>
                    </div>
                  )}
                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <Label className="text-sm font-medium text-gray-500">Adresse</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.adresse}</div>
                  </div>
                </div>
              </div>

              {/* Section sujet postulé */}
              {selectedCandidate.sujetPostule && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm border border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b-2 border-purple-200 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    Candidature
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 block mb-2">Sujet postulé</Label>
                      <div className="text-lg font-bold text-gray-900 bg-white/60 p-4 rounded-lg">
                        {selectedCandidate.sujetPostule}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/60 p-4 rounded-lg">
                        <Label className="text-sm font-medium text-gray-600 block mb-2">Directeur de thèse</Label>
                        <div className="text-base font-semibold text-gray-900">
                          {selectedCandidate.directeurPrenom} {selectedCandidate.directeurNom}
                        </div>
                      </div>
                      {selectedCandidate.codirecteurNom && (
                        <div className="bg-white/60 p-4 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600 block mb-2">Co-directeur</Label>
                          <div className="text-base font-semibold text-gray-900">
                            {selectedCandidate.codirecteurPrenom} {selectedCandidate.codirecteurNom}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600 block mb-2">Formation doctorale</Label>
                      <div className="text-base font-semibold text-gray-900">
                        {selectedCandidate.formationDoctorale}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Section diplômes */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  Diplômes et Formation Antérieure
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Diplôme</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Spécialité</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Établissement</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Année</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Moyenne</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {candidateDiplomes && candidateDiplomes.length > 0 ? (
                        candidateDiplomes.map((diplome, index) => (
                          <tr key={diplome.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{diplome.intitule}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{diplome.specialite}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{diplome.etablissement}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {diplome.dateCommission ? new Date(diplome.dateCommission).getFullYear() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`font-semibold ${
                                diplome.moyen_generale && diplome.moyen_generale >= 14 ? 'text-green-600' :
                                diplome.moyen_generale && diplome.moyen_generale >= 12 ? 'text-blue-600' :
                                'text-gray-600'
                              }`}>
                                {diplome.moyen_generale ? `${diplome.moyen_generale}/20` : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="text-gray-400 text-sm">
                              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              Aucun diplôme enregistré
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsCandidateDetailDialogOpen(false)}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DirecteurLaboInterface;