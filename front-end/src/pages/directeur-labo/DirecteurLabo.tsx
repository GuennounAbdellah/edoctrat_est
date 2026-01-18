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
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Types
interface Candidat {
  id: number;
  cne: string;
  pays: string;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  nomCandidatAr: string;
  prenomCandidatAr: string;
  adresse: string;
  adresseAr: string;
  sexe: string;
  villeDeNaissance: string;
  villeDeNaissanceAr: string;
  ville: string;
  dateDeNaissance: string;
  typeDeHandiCape: string;
  academie: string;
  telCandidat: string;
  pathCv: string;
  pathPhoto: string;
  etatDossier: number;
  situation_familiale: string;
  fonctionnaire: string;
}

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
}

interface FormationDoctorale {
  id: number;
  nom: string;
  description: string;
}

interface Sujet {
  id: number;
  titre: string;
  description: string;
  motsCles: string;
  dateDepot: string;
  publier: boolean;
  pathFile: string;
  professeur: Professeur;
  formationDoctorale: FormationDoctorale;
}

interface Commission {
  id: number;
  dateCommission: string;
  heure: string;
  valider: boolean;
  lieu: string;
  labo: number;
  participants: any[];
  sujets: any[];
}

interface Examiner {
  id: number;
  sujet: Sujet;
  cne: string;
  noteDossier: number;
  noteEntretien: number;
  decision: string;
  commission: number;
  candidat: Candidat;
  publier: boolean;
}

const DirecteurLaboInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidats' | 'sujets' | 'commissions' | 'preselection' | 'resultats' | 'pv'>('candidats');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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
    const mockCandidats: Candidat[] = [
      {
        id: 1,
        cne: 'CNE001',
        pays: 'Maroc',
        nom: 'Benali',
        prenom: 'Ahmed',
        email: 'ahmed.benali@email.com',
        cin: 'AB123456',
        nomCandidatAr: 'أحمد بن علي',
        prenomCandidatAr: 'أحمد',
        adresse: 'Adresse 1',
        adresseAr: 'العنوان 1',
        sexe: 'Masculin',
        villeDeNaissance: 'Fès',
        villeDeNaissanceAr: 'فاس',
        ville: 'Fès',
        dateDeNaissance: '1990-01-15',
        typeDeHandiCape: 'Non',
        academie: 'Fès-Meknès',
        telCandidat: '0600000001',
        pathCv: '',
        pathPhoto: '',
        etatDossier: 1,
        situation_familiale: 'Célibataire',
        fonctionnaire: 'Non'
      }
    ];
    setCandidats(mockCandidats);
  };

  const fetchSujets = async () => {
    const mockSujets: Sujet[] = [
      {
        id: 1,
        titre: 'Intelligence Artificielle appliquée aux systèmes embarqués',
        description: 'Recherche sur l\'optimisation des algorithmes IA pour les microcontrôleurs',
        motsCles: 'IA, systèmes embarqués, optimisation',
        dateDepot: '2024-01-15',
        publier: true,
        pathFile: '',
        professeur: { id: 1, nom: 'El Amrani', prenom: 'Karim' },
        formationDoctorale: { id: 1, nom: 'Informatique', description: 'Formation en informatique' }
      }
    ];
    setSujets(mockSujets);
  };

  const fetchCommissions = async () => {
    const mockCommissions: Commission[] = [
      {
        id: 1,
        dateCommission: '2024-02-15',
        heure: '14:00',
        valider: false,
        lieu: 'Salle de conférence A',
        labo: 1,
        participants: [],
        sujets: []
      }
    ];
    setCommissions(mockCommissions);
  };

  const fetchFormations = async () => {
    const mockFormations: FormationDoctorale[] = [
      { id: 1, nom: 'Informatique', description: 'Formation en informatique' },
      { id: 2, nom: 'Mathématiques', description: 'Formation en mathématiques' },
      { id: 3, nom: 'Physique', description: 'Formation en physique' },
      { id: 4, nom: 'Chimie', description: 'Formation en chimie' }
    ];
    setFormations(mockFormations);
  };

  const fetchResults = async () => {
    const mockResults: Examiner[] = [
      {
        id: 1,
        sujet: { id: 1, titre: 'IA embarquée' } as any,
        cne: 'CNE001',
        noteDossier: 16,
        noteEntretien: 14,
        decision: 'Admis',
        commission: 1,
        candidat: { id: 1, nom: 'Benali', prenom: 'Ahmed' } as any,
        publier: true
      }
    ];
    setResults(mockResults);
  };

  const handleCreateSujet = async () => {
    console.log('Creating sujet:', sujetFormData);
    setSujetFormData({ titre: '', directeur: '', coDirecteur: '', formationDoctorale: '' });
    setIsSujetDialogOpen(false);
    await fetchSujets();
  };

  const handleCreateCommission = async () => {
    console.log('Creating commission:', commissionFormData);
    setCommissionFormData({ dateCommission: '', heure: '', lieu: '', sujetIds: [] });
    setIsCommissionDialogOpen(false);
    await fetchCommissions();
  };

  const handleDownloadPV = (format: 'pdf' | 'excel') => {
    console.log(`Downloading PV in ${format} format`);
  };

  const handleValidateCommission = async (commissionId: number) => {
    console.log('Validating commission:', commissionId);
    await fetchCommissions();
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
      <section className="py-12 lg:py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
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
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CNE</TableHead>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>État du dossier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidats.map((candidat) => (
                        <TableRow key={candidat.id}>
                          <TableCell>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                              onClick={() => handleViewCandidateDetails(candidat.id)}
                            >
                              {candidat.cne}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">{candidat.nom} {candidat.prenom}</TableCell>
                          <TableCell>{candidat.email}</TableCell>
                          <TableCell>{candidat.telCandidat}</TableCell>
                          <TableCell>{candidat.ville}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {candidat.etatDossier === 1 ? 'Validé' : 'En cours'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {activeTab === 'sujets' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Directeur</TableHead>
                        <TableHead>Formation Doctorale</TableHead>
                        <TableHead>Date dépôt</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSujets.map((sujet) => (
                        <TableRow key={sujet.id}>
                          <TableCell className="font-medium">{sujet.titre}</TableCell>
                          <TableCell>{sujet.professeur.nom} {sujet.professeur.prenom}</TableCell>
                          <TableCell>{sujet.formationDoctorale.nom}</TableCell>
                          <TableCell>{new Date(sujet.dateDepot).toLocaleDateString()}</TableCell>
                          <TableCell>{getPublicationBadge(sujet.publier)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {activeTab === 'commissions' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell>{new Date(commission.dateCommission).toLocaleDateString()}</TableCell>
                          <TableCell>{commission.heure}</TableCell>
                          <TableCell>{commission.lieu}</TableCell>
                          <TableCell>{getStatusBadge(commission.valider)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleValidateCommission(commission.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {activeTab === 'preselection' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Candidats présélectionnés</h3>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Envoyer convocations
                      </Button>
                    </div>
                    <DataTable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidat</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Note dossier</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Ahmed Benali</TableCell>
                          <TableCell>IA embarquée</TableCell>
                          <TableCell>15/20</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500">Présélectionné</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Convocation</Button>
                              <Button variant="outline" size="sm">Annuler</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </DataTable>
                  </div>
                )}

                {activeTab === 'resultats' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CNE</TableHead>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Sujet</TableHead>
                        <TableHead>Note entretien</TableHead>
                        <TableHead>Moyenne générale</TableHead>
                        <TableHead>Décision</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.cne}</TableCell>
                          <TableCell>{result.candidat?.nom} {result.candidat?.prenom}</TableCell>
                          <TableCell>{result.sujet?.titre}</TableCell>
                          <TableCell>{result.noteEntretien}/20</TableCell>
                          <TableCell>{((result.noteDossier + result.noteEntretien) / 2).toFixed(2)}/20</TableCell>
                          <TableCell>{getDecisionBadge(result.decision)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {activeTab === 'pv' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Générer le procès-verbal global</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Ce document contient l'ensemble des résultats, décisions et statistiques 
                        de la session de doctorat en cours.
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={() => handleDownloadPV('pdf')} className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger PV (PDF)
                        </Button>
                        <Button variant="outline" onClick={() => handleDownloadPV('excel')} className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger PV (Excel)
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Statistiques générales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600">24</div>
                            <div className="text-sm text-gray-500 mt-2">Candidats évalués</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600">18</div>
                            <div className="text-sm text-gray-500 mt-2">Candidats admis</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-orange-600">6</div>
                            <div className="text-sm text-gray-500 mt-2">Candidats ajournés</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
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