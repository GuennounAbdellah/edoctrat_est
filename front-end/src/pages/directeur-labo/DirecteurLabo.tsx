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

// Import models
import { Candidat } from '@/models/Candidat';
import { Sujet } from '@/models/Sujet';
import { Commission } from '@/models/Commission';
import { FormationDoctorale } from '@/models/FormationDoctorale';
import { Examiner } from '@/models/Examiner';
import { Professeur } from '@/models/Professeur';
import { DirecteurLabo } from '@/models/DirecteurLabo';

// Import services
import { DirecteurLaboService } from '@/api/directeurLaboService';

const DirecteurLaboInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidats' | 'sujets' | 'commissions' | 'preselection' | 'resultats' | 'pv'>('candidats');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for logged-in director
  const [loggedDirector, setLoggedDirector] = useState<DirecteurLabo | null>(null);

  // State for data
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [formations, setFormations] = useState<FormationDoctorale[]>([]);
  const [results, setResults] = useState<Examiner[]>([]);

  // Dialog states
  const [isSujetDialogOpen, setIsSujetDialogOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [isCandidateDetailDialogOpen, setIsCandidateDetailDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidat | null>(null);
  
  // Logout confirmation state
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Form states
  const [sujetFormData, setSujetFormData] = useState({
    titre: '',
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
    // Fetch logged-in director data from localStorage or auth context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const directorData: DirecteurLabo = {
          id: userData.id,
          nom: userData.nom || userData.lastName,
          prenom: userData.prenom || userData.firstName,
          email: userData.email,
          departement: userData.departement || 'Informatique'
        };
        setLoggedDirector(directorData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to a default director
        setLoggedDirector({
          id: 1,
          nom: 'Directeur',
          prenom: 'Laboratoire',
          email: 'directeur@labo.ma',
          departement: 'Informatique'
        });
      }
    } else {
      // If no user data in localStorage, use a default director
      setLoggedDirector({
        id: 1,
        nom: 'Directeur',
        prenom: 'Laboratoire',
        email: 'directeur@labo.ma',
        departement: 'Informatique'
      });
    }
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchCandidats();
      await fetchSujets();
      await fetchCommissions();
      await fetchFormations();
      await fetchResults();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidats = async () => {
    try {
      const response = await DirecteurLaboService.getAllCandidats();
      // Transform backend response to frontend Candidat model
      const transformedCandidats: Candidat[] = response.results.map(item => ({
        id: item.id,
        cne: item.cne,
        pays: item.pays,
        nom: item.nom,
        prenom: item.prenom,
        email: item.email,
        cin: item.cin,
        nomCandidatAr: item.nomCandidatAr,
        prenomCandidatAr: item.prenomCandidatAr,
        adresse: item.adresse,
        adresseAr: item.adresseAr,
        sexe: item.sexe,
        villeDeNaissance: item.villeDeNaissance,
        villeDeNaissanceAr: item.villeDeNaissanceAr,
        ville: item.ville,
        dateDeNaissance: item.dateDeNaissance,
        typeDeHandiCape: item.typeDeHandiCape,
        academie: item.academie,
        telCandidat: item.telCandidat,
        pathCv: item.pathCv,
        pathPhoto: item.pathPhoto,
        etatDossier: item.etatDossier,
        situation_familiale: item.situation_familiale,
        fonctionnaire: item.fonctionnaire
      }));
      setCandidats(transformedCandidats);
    } catch (error) {
      console.error('Error fetching candidats:', error);
      setCandidats([]); // Empty array instead of mock data
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
        formationDoctorale: item.formationDoctorale
      }));
      setSujets(transformedSujets);
    } catch (error) {
      console.error('Error fetching sujets:', error);
      setSujets([]); // Empty array instead of mock data
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await DirecteurLaboService.getAllCommissions();
      // Transform backend response to frontend Commission model
      const transformedCommissions: Commission[] = response.results.map(item => ({
        id: item.id,
        dateCommission: item.dateCommission,
        heure: item.heure,
        valider: item.valider,
        lieu: item.lieu,
        labo: item.labo,
        participants: item.participants,
        sujets: item.sujets
      }));
      setCommissions(transformedCommissions);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      setCommissions([]); // Empty array instead of mock data
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await DirecteurLaboService.getLaboProfesseurs();
      // Transform backend response to frontend FormationDoctorale model
      // Note: We're using labo professeurs endpoint as placeholder
      // In a real implementation, there should be a dedicated formations endpoint
      const transformedFormations: FormationDoctorale[] = [
        { id: 1, nom: 'Informatique', description: 'Formation en informatique' },
        { id: 2, nom: 'Mathématiques', description: 'Formation en mathématiques' },
        { id: 3, nom: 'Physique', description: 'Formation en physique' },
        { id: 4, nom: 'Chimie', description: 'Formation en chimie' }
      ];
      setFormations(transformedFormations);
    } catch (error) {
      console.error('Error fetching formations:', error);
      setFormations([]); // Empty array instead of mock data
    }
  };

  const fetchResults = async () => {
    try {
      const response = await DirecteurLaboService.getLaboCandidats();
      // Transform backend response to frontend Examiner model
      const transformedResults: Examiner[] = response.results.map(item => ({
        id: item.id,
        sujet: item.sujet,
        cne: item.cne,
        noteDossier: item.noteDossier,
        noteEntretien: item.noteEntretien,
        decision: item.decision,
        commission: item.commission,
        candidat: item.candidat,
        publier: item.publier
      }));
      setResults(transformedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]); // Empty array instead of mock data
    }
  };

  const handleCreateSujet = async () => {
    try {
      const newSujet = {
        titre: sujetFormData.titre,
        professeur: { id: parseInt(sujetFormData.directeur) } as Professeur,
        formationDoctorale: { id: parseInt(sujetFormData.formationDoctorale) } as FormationDoctorale,
        description: '',
        motsCles: '',
        dateDepot: new Date().toISOString().split('T')[0],
        publier: false,
        pathFile: ''
      };
      
      await DirecteurLaboService.createSujet(newSujet);
      setSujetFormData({ titre: '', directeur: '', coDirecteur: '', formationDoctorale: '' });
      setIsSujetDialogOpen(false);
      await fetchSujets();
    } catch (error) {
      console.error('Error creating sujet:', error);
      setSujetFormData({ titre: '', directeur: '', coDirecteur: '', formationDoctorale: '' });
      setIsSujetDialogOpen(false);
      await fetchSujets();
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

  const handleViewCandidateDetails = (candidateId: number) => {
    const candidate = candidats.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsCandidateDetailDialogOpen(true);
    }
  };

  // Filter functions
  const filteredCandidats = candidats.filter(candidat =>
    candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.cne.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSujets = sujets.filter(sujet =>
    sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissions = commissions.filter(commission =>
    commission.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = results.filter(result =>
    result.candidat?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidat?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.sujet?.titre.toLowerCase().includes(searchTerm.toLowerCase())
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
                Espace Directeur de Laboratoire
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Gestion et supervision des candidats, sujets et commissions
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
                    candidats={candidats}
                    searchTerm={searchTerm}
                    onViewCandidateDetails={handleViewCandidateDetails}
                  />
                )}

                {activeTab === 'sujets' && (
                  <SubjectsTab 
                    sujets={sujets}
                    searchTerm={searchTerm}
                    onAddSubject={() => setIsSujetDialogOpen(true)}
                  />
                )}

                {activeTab === 'commissions' && (
                  <CommissionsTab 
                    commissions={commissions}
                    searchTerm={searchTerm}
                    onCreateCommission={() => setIsCommissionDialogOpen(true)}
                    onValidateCommission={handleValidateCommission}
                  />
                )}

                {activeTab === 'preselection' && (
                  <PreselectionTab 
                  />
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

            {!loading && activeTab === 'candidats' && filteredCandidats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun candidat trouvé
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
              <Label htmlFor="directeur" className="text-right">Directeur</Label>
              <Input 
                id="directeur" 
                value={sujetFormData.directeur}
                onChange={(e) => setSujetFormData({...sujetFormData, directeur: e.target.value})}
                className="col-span-3" 
                placeholder="Nom du directeur"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coDirecteur" className="text-right">Co-directeur</Label>
              <Input 
                id="coDirecteur" 
                value={sujetFormData.coDirecteur}
                onChange={(e) => setSujetFormData({...sujetFormData, coDirecteur: e.target.value})}
                className="col-span-3" 
                placeholder="Nom du co-directeur (optionnel)"
              />
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
                  {formations.map(formation => (
                    <SelectItem key={formation.id} value={String(formation.id)}>
                      {formation.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSujetDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateSujet}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour créer une commission */}
      <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle commission</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateCommission" className="text-right">Date</Label>
              <Input 
                id="dateCommission" 
                type="date"
                value={commissionFormData.dateCommission}
                onChange={(e) => setCommissionFormData({...commissionFormData, dateCommission: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="heure" className="text-right">Heure</Label>
              <Input 
                id="heure" 
                type="time"
                value={commissionFormData.heure}
                onChange={(e) => setCommissionFormData({...commissionFormData, heure: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lieu" className="text-right">Lieu</Label>
              <Input 
                id="lieu" 
                value={commissionFormData.lieu}
                onChange={(e) => setCommissionFormData({...commissionFormData, lieu: e.target.value})}
                className="col-span-3" 
                placeholder="Lieu de la commission"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCommissionDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateCommission}>Créer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails du candidat */}
      <Dialog open={isCandidateDetailDialogOpen} onOpenChange={() => setIsCandidateDetailDialogOpen(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du Candidat</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6 py-4">
              {/* Section identité */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Informations Personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">CNE</Label>
                    <div className="text-base font-semibold text-gray-900">{selectedCandidate.cne}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">CIN</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.cin}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">État du dossier</Label>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCandidate.etatDossier === 1 ? 'bg-green-100 text-green-800' : 
                        selectedCandidate.etatDossier === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedCandidate.etatDossier === 1 ? 'Validé' : 
                         selectedCandidate.etatDossier === 0 ? 'En cours' : 'Refusé'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Nom</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.nom}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Prénom</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.prenom}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                    <div className="text-base text-gray-900 truncate">{selectedCandidate.email}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Pays</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.pays}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Ville</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.ville}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Sexe</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.sexe}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</Label>
                    <div className="text-base text-gray-900">{new Date(selectedCandidate.dateDeNaissance).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.telCandidat}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Adresse</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.adresse}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Situation familiale</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.situation_familiale || 'Non spécifié'}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Fonctionnaire</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.fonctionnaire || 'Non spécifié'}</div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Type de handicap</Label>
                    <div className="text-base text-gray-900">{selectedCandidate.typeDeHandiCape}</div>
                  </div>
                  {selectedCandidate.academie && (
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Académie</Label>
                      <div className="text-base text-gray-900">{selectedCandidate.academie}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Section sujet de recherche */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Sujet de Recherche</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Sujet de Recherche</Label>
                    <div className="text-base text-gray-900 bg-white p-3 rounded border">
                      {sujets.find(s => s.id === 1)?.titre || 'Aucun sujet attribué'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Directeur de Thèse</Label>
                      <div className="text-base text-gray-900 bg-white p-3 rounded border">
                        {sujets.find(s => s.id === 1)?.professeur?.nom || 'Aucun directeur attribué'}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Co-Directeur</Label>
                      <div className="text-base text-gray-900 bg-white p-3 rounded border">
                        {sujets.find(s => s.id === 1)?.professeur?.prenom || 'Aucun co-directeur attribué'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Formation Doctorale</Label>
                    <div className="text-base text-gray-900 bg-white p-3 rounded border">
                      {sujets.find(s => s.id === 1)?.formationDoctorale?.nom || 'Aucune formation attribuée'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Date de Dépôt</Label>
                      <div className="text-base text-gray-900 bg-white p-3 rounded border">
                        {sujets.find(s => s.id === 1)?.dateDepot || 'Non spécifiée'}
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Statut Publication</Label>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          sujets.find(s => s.id === 1)?.publier ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sujets.find(s => s.id === 1)?.publier ? 'Publié' : 'Non publié'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">Mots-clés</Label>
                      <div className="text-base text-gray-900 bg-white p-3 rounded border">
                        {sujets.find(s => s.id === 1)?.motsCles || 'Aucun mot-clé défini'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section diplômes */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Diplômes et Formation Antérieure</h3>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diplôme</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Master en Informatique</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Génie Logiciel</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Université Sidi Mohamed Ben Abdellah</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2022</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">16.5/20</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Licence en Sciences</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Informatique</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Université Sidi Mohamed Ben Abdellah</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2020</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15.2/20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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