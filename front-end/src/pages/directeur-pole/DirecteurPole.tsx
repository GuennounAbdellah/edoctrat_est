import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileText,
  Download,
  Calendar,
  Search,
  Eye,
  Send,
  CheckCircle,
  Building2,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// Types
interface Professeur {
  id: number;
  nom: string;
  prenom: string;
}

interface FormationDoctorale {
  id: number;
  titre: string;
  ced: {
    id: number;
    titre: string;
  };
}

interface Laboratoire {
  id: number;
  nom: string;
}

interface Sujet {
  id: number;
  titre: string;
  description: string;
  motsCles: string;
  dateDepot: string;
  publier: boolean;
  professeur: Professeur;
  coDirecteur: Professeur | null;
  formationDoctorale: FormationDoctorale;
  laboratoire: Laboratoire;
}

interface Candidat {
  id: number;
  cne: string;
  nom: string;
  prenom: string;
  email: string;
}

interface Postuler {
  id: number;
  candidat: Candidat;
  sujet: Sujet;
}

interface Commission {
  id: number;
  dateCommission: string;
  heure: string;
  lieu: string;
  valider: boolean;
  sujets: { id: number; titre: string }[];
  participants: { id: number; nom: string; prenom: string }[];
  labo: string;
}

interface CalendrierItem {
  id: number;
  action: string;
  dateDebut: string;
  dateFin: string;
}

type ActiveTab = 'sujets' | 'candidats' | 'commissions' | 'calendrier' | 'communiquer' | 'inscription';

const DirecteurPoleInterface: React.FC = () => {
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
  const [calendrier, setCalendrier] = useState<CalendrierItem[]>([]);

  // Dialog states
  const [isCandidateDetailDialogOpen, setIsCandidateDetailDialogOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Postuler | null>(null);

  // Fetch functions defined before useEffect
  const fetchSujets = async () => {
    // Mock data for sujets
    const mockSujets: Sujet[] = [
      {
        id: 1,
        titre: 'Intelligence Artificielle appliquée aux systèmes embarqués',
        description: 'Recherche sur l\'optimisation des algorithmes IA pour les microcontrôleurs',
        motsCles: 'IA, systèmes embarqués, optimisation',
        dateDepot: '2024-01-15',
        publier: true,
        professeur: { id: 1, nom: 'El Amrani', prenom: 'Karim' },
        coDirecteur: { id: 2, nom: 'Bennani', prenom: 'Hassan' },
        formationDoctorale: { id: 1, titre: 'Informatique et Systèmes', ced: { id: 1, titre: 'Sciences et Techniques' } },
        laboratoire: { id: 1, nom: 'LIIAN' }
      },
      {
        id: 2,
        titre: 'Analyse des données massives pour la prédiction climatique',
        description: 'Utilisation du Big Data pour améliorer les modèles climatiques',
        motsCles: 'Big Data, climat, machine learning',
        dateDepot: '2024-01-20',
        publier: true,
        professeur: { id: 3, nom: 'Alaoui', prenom: 'Fatima' },
        coDirecteur: null,
        formationDoctorale: { id: 2, titre: 'Sciences des Données', ced: { id: 1, titre: 'Sciences et Techniques' } },
        laboratoire: { id: 2, nom: 'LSIA' }
      },
      {
        id: 3,
        titre: 'Cybersécurité des réseaux IoT industriels',
        description: 'Sécurisation des infrastructures IoT dans l\'industrie 4.0',
        motsCles: 'IoT, cybersécurité, industrie 4.0',
        dateDepot: '2024-02-01',
        publier: false,
        professeur: { id: 4, nom: 'Rachidi', prenom: 'Mohammed' },
        coDirecteur: { id: 5, nom: 'Tazi', prenom: 'Nadia' },
        formationDoctorale: { id: 1, titre: 'Informatique et Systèmes', ced: { id: 1, titre: 'Sciences et Techniques' } },
        laboratoire: { id: 1, nom: 'LIIAN' }
      }
    ];
    setSujets(mockSujets);
  };

  const fetchCandidatures = async () => {
    // Mock data for candidatures
    const mockCandidatures: Postuler[] = [
      {
        id: 1,
        candidat: { id: 1, cne: 'CNE001', nom: 'Benali', prenom: 'Ahmed', email: 'ahmed.benali@email.com' },
        sujet: {
          id: 1,
          titre: 'Intelligence Artificielle appliquée aux systèmes embarqués',
          description: '',
          motsCles: '',
          dateDepot: '2024-01-15',
          publier: true,
          professeur: { id: 1, nom: 'El Amrani', prenom: 'Karim' },
          coDirecteur: { id: 2, nom: 'Bennani', prenom: 'Hassan' },
          formationDoctorale: { id: 1, titre: 'Informatique et Systèmes', ced: { id: 1, titre: 'Sciences et Techniques' } },
          laboratoire: { id: 1, nom: 'LIIAN' }
        }
      },
      {
        id: 2,
        candidat: { id: 2, cne: 'CNE002', nom: 'Idrissi', prenom: 'Sara', email: 'sara.idrissi@email.com' },
        sujet: {
          id: 2,
          titre: 'Analyse des données massives pour la prédiction climatique',
          description: '',
          motsCles: '',
          dateDepot: '2024-01-20',
          publier: true,
          professeur: { id: 3, nom: 'Alaoui', prenom: 'Fatima' },
          coDirecteur: null,
          formationDoctorale: { id: 2, titre: 'Sciences des Données', ced: { id: 1, titre: 'Sciences et Techniques' } },
          laboratoire: { id: 2, nom: 'LSIA' }
        }
      },
      {
        id: 3,
        candidat: { id: 3, cne: 'CNE003', nom: 'Oulad', prenom: 'Youssef', email: 'youssef.oulad@email.com' },
        sujet: {
          id: 3,
          titre: 'Cybersécurité des réseaux IoT industriels',
          description: '',
          motsCles: '',
          dateDepot: '2024-02-01',
          publier: false,
          professeur: { id: 4, nom: 'Rachidi', prenom: 'Mohammed' },
          coDirecteur: { id: 5, nom: 'Tazi', prenom: 'Nadia' },
          formationDoctorale: { id: 1, titre: 'Informatique et Systèmes', ced: { id: 1, titre: 'Sciences et Techniques' } },
          laboratoire: { id: 1, nom: 'LIIAN' }
        }
      }
    ];
    setCandidatures(mockCandidatures);
  };

  const fetchCommissions = async () => {
    // Mock data for commissions
    const mockCommissions: Commission[] = [
      {
        id: 1,
        dateCommission: '2024-03-15',
        heure: '14:00',
        lieu: 'Salle de conférence A - FST Fès',
        valider: true,
        sujets: [
          { id: 1, titre: 'Intelligence Artificielle appliquée aux systèmes embarqués' },
          { id: 2, titre: 'Analyse des données massives pour la prédiction climatique' }
        ],
        participants: [
          { id: 1, nom: 'El Amrani', prenom: 'Karim' },
          { id: 2, nom: 'Alaoui', prenom: 'Fatima' },
          { id: 3, nom: 'Bennani', prenom: 'Hassan' }
        ],
        labo: 'LIIAN'
      },
      {
        id: 2,
        dateCommission: '2024-03-20',
        heure: '10:00',
        lieu: 'Amphithéâtre B - FST Fès',
        valider: false,
        sujets: [
          { id: 3, titre: 'Cybersécurité des réseaux IoT industriels' }
        ],
        participants: [
          { id: 4, nom: 'Rachidi', prenom: 'Mohammed' },
          { id: 5, nom: 'Tazi', prenom: 'Nadia' }
        ],
        labo: 'LSIA'
      }
    ];
    setCommissions(mockCommissions);
  };

  const fetchCalendrier = async () => {
    // Mock data for calendrier
    const mockCalendrier: CalendrierItem[] = [
      {
        id: 1,
        action: 'Dépôt des sujets de thèse',
        dateDebut: '2024-01-01',
        dateFin: '2024-02-15'
      },
      {
        id: 2,
        action: 'Candidature des doctorants',
        dateDebut: '2024-02-16',
        dateFin: '2024-03-31'
      },
      {
        id: 3,
        action: 'Présélection des candidats',
        dateDebut: '2024-04-01',
        dateFin: '2024-04-15'
      },
      {
        id: 4,
        action: 'Entretiens oraux',
        dateDebut: '2024-04-20',
        dateFin: '2024-05-10'
      },
      {
        id: 5,
        action: 'Publication des résultats',
        dateDebut: '2024-05-15',
        dateFin: '2024-05-20'
      }
    ];
    setCalendrier(mockCalendrier);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Succès",
        description: "Les sujets ont été publiés avec succès",
      });
    } catch (error) {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Succès",
        description: "La liste principale a été publiée avec succès",
      });
    } catch (error) {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Succès",
        description: "La liste d'attente a été publiée avec succès",
      });
    } catch (error) {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCalendrier(prev => prev.map(item =>
        item.id === id ? { ...item, dateDebut, dateFin } : item
      ));
      toast({
        title: "Succès",
        description: "Les dates ont été mises à jour avec succès",
      });
    } catch (error) {
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
    const matchesLabo = sujet.laboratoire.nom.toLowerCase().includes(laboFilter.toLowerCase());
    const matchesFormation = sujet.formationDoctorale.titre.toLowerCase().includes(formationFilter.toLowerCase());
    const matchesSearch = sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.professeur.nom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSujet && matchesLabo && matchesFormation && (searchTerm === '' || matchesSearch);
  });

  const filteredCandidatures = candidatures.filter(candidature =>
    candidature.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissions = commissions.filter(commission =>
    commission.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.labo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Badge className="bg-yellow-500">En attente</Badge>
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
                {/* Sujets Tab */}
                {activeTab === 'sujets' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre | Sujet | Thème</TableHead>
                        <TableHead>Directeur</TableHead>
                        <TableHead>Co-Directeur</TableHead>
                        <TableHead>Laboratoire</TableHead>
                        <TableHead>Formation Doctorale</TableHead>
                        <TableHead>CED</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSujets.map((sujet) => (
                        <TableRow key={sujet.id}>
                          <TableCell className="font-medium max-w-xs truncate">{sujet.titre}</TableCell>
                          <TableCell>{sujet.professeur.prenom} {sujet.professeur.nom}</TableCell>
                          <TableCell>
                            {sujet.coDirecteur
                              ? `${sujet.coDirecteur.prenom} ${sujet.coDirecteur.nom}`
                              : '-'}
                          </TableCell>
                          <TableCell>{sujet.laboratoire.nom}</TableCell>
                          <TableCell>{sujet.formationDoctorale.titre}</TableCell>
                          <TableCell>{sujet.formationDoctorale.ced.titre}</TableCell>
                          <TableCell>{getPublicationBadge(sujet.publier)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {/* Candidats Tab */}
                {activeTab === 'candidats' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre Sujet</TableHead>
                        <TableHead>Directeur</TableHead>
                        <TableHead>Co-Directeur</TableHead>
                        <TableHead>CNE</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prénom</TableHead>
                        <TableHead>Laboratoire</TableHead>
                        <TableHead>Formation Doctorale</TableHead>
                        <TableHead>CED</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidatures.map((candidature) => (
                        <TableRow key={candidature.id}>
                          <TableCell className="font-medium max-w-xs truncate">{candidature.sujet.titre}</TableCell>
                          <TableCell>{candidature.sujet.professeur.nom} {candidature.sujet.professeur.prenom}</TableCell>
                          <TableCell>
                            {candidature.sujet.coDirecteur
                              ? `${candidature.sujet.coDirecteur.nom} ${candidature.sujet.coDirecteur.prenom}`
                              : '-'}
                          </TableCell>
                          <TableCell>{candidature.candidat.cne}</TableCell>
                          <TableCell>{candidature.candidat.nom}</TableCell>
                          <TableCell>{candidature.candidat.prenom}</TableCell>
                          <TableCell>{candidature.sujet.laboratoire.nom}</TableCell>
                          <TableCell>{candidature.sujet.formationDoctorale.titre}</TableCell>
                          <TableCell>{candidature.sujet.formationDoctorale.ced.titre}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCandidatureDetails(candidature)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {/* Commissions Tab */}
                {activeTab === 'commissions' && (
                  <DataTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Sujets</TableHead>
                        <TableHead>Membres</TableHead>
                        <TableHead>Laboratoire</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell>{new Date(commission.dateCommission).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{commission.heure}</TableCell>
                          <TableCell>{commission.lieu}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {commission.sujets.map((sujet) => (
                                <li key={sujet.id} className="truncate max-w-xs">{sujet.titre}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {commission.participants.map((participant) => (
                                <li key={participant.id}>{participant.nom} {participant.prenom}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>{commission.labo}</TableCell>
                          <TableCell>{getStatusBadge(commission.valider)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                )}

                {/* Calendrier Tab */}
                {activeTab === 'calendrier' && (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {calendrier.map((item) => (
                        <AccordionItem key={item.id} value={`item-${item.id}`}>
                          <AccordionTrigger className="text-left">
                            {item.action}
                          </AccordionTrigger>
                          <AccordionContent>
                            <CalendrierForm
                              item={item}
                              onConfirm={handleConfirmerCalendrier}
                              loading={loading}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Communiquer Tab */}
                {activeTab === 'communiquer' && (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full" defaultValue="sujets">
                      <AccordionItem value="sujets">
                        <AccordionTrigger>Sujets</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Publier les sujets</h5>
                              <p className="text-sm text-muted-foreground">
                                Rendre visibles les sujets de recherche aux candidats
                              </p>
                            </div>
                            <Button onClick={handlePublierSujets} disabled={loading}>
                              <Send className="w-4 h-4 mr-2" />
                              Confirmer
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="liste-principale">
                        <AccordionTrigger>Liste Principale</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Liste Principale</h5>
                              <p className="text-sm text-muted-foreground">
                                Publier et télécharger la liste principale des candidats admis
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button onClick={handlePublierListePrincipale} disabled={loading}>
                                <Send className="w-4 h-4 mr-2" />
                                Publier
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="liste-attente">
                        <AccordionTrigger>Liste D'attente</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <h5 className="font-semibold">Liste D'attente</h5>
                              <p className="text-sm text-muted-foreground">
                                Publier et télécharger la liste d'attente des candidats
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button onClick={handlePublierListeAttente} disabled={loading}>
                                <Send className="w-4 h-4 mr-2" />
                                Publier
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Inscription Tab */}
                {activeTab === 'inscription' && (
                  <div className="text-center py-12">
                    <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Gestion des Inscriptions</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Cette section permettra de gérer les inscriptions des doctorants.
                      Fonctionnalité en cours de développement.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty states */}
            {!loading && activeTab === 'sujets' && filteredSujets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun sujet trouvé
              </div>
            )}

            {!loading && activeTab === 'candidats' && filteredCandidatures.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun candidat trouvé
              </div>
            )}

            {!loading && activeTab === 'commissions' && filteredCommissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune commission trouvée
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
      <Dialog open={isCandidateDetailDialogOpen} onOpenChange={setIsCandidateDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails de la Candidature</DialogTitle>
          </DialogHeader>
          {selectedCandidature && (
            <div className="space-y-6 py-4">
              {/* Candidate Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informations du Candidat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">CNE</Label>
                    <div className="text-base font-semibold">{selectedCandidature.candidat.cne}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                    <div className="text-base">{selectedCandidature.candidat.nom} {selectedCandidature.candidat.prenom}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="text-base">{selectedCandidature.candidat.email}</div>
                  </div>
                </div>
              </div>

              {/* Subject Info */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Sujet de Recherche
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Titre du sujet</Label>
                    <div className="text-base bg-white p-3 rounded border">{selectedCandidature.sujet.titre}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Directeur de Thèse</Label>
                      <div className="text-base bg-white p-3 rounded border">
                        {selectedCandidature.sujet.professeur.prenom} {selectedCandidature.sujet.professeur.nom}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Co-Directeur</Label>
                      <div className="text-base bg-white p-3 rounded border">
                        {selectedCandidature.sujet.coDirecteur
                          ? `${selectedCandidature.sujet.coDirecteur.prenom} ${selectedCandidature.sujet.coDirecteur.nom}`
                          : 'Non assigné'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Laboratoire</Label>
                      <div className="text-base bg-white p-3 rounded border">
                        {selectedCandidature.sujet.laboratoire.nom}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Formation Doctorale</Label>
                      <div className="text-base bg-white p-3 rounded border">
                        {selectedCandidature.sujet.formationDoctorale.titre}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">CED</Label>
                    <div className="text-base bg-white p-3 rounded border">
                      {selectedCandidature.sujet.formationDoctorale.ced.titre}
                    </div>
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

// Calendrier Form Component
interface CalendrierFormProps {
  item: CalendrierItem;
  onConfirm: (id: number, dateDebut: string, dateFin: string) => void;
  loading: boolean;
}

const CalendrierForm: React.FC<CalendrierFormProps> = ({ item, onConfirm, loading }) => {
  const [dateDebut, setDateDebut] = useState(item.dateDebut);
  const [dateFin, setDateFin] = useState(item.dateFin);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">De</span>
      <Input
        type="date"
        value={dateDebut}
        onChange={(e) => setDateDebut(e.target.value)}
        className="w-auto"
      />
      <span className="text-sm font-medium">à</span>
      <Input
        type="date"
        value={dateFin}
        onChange={(e) => setDateFin(e.target.value)}
        className="w-auto"
      />
      <Button
        onClick={() => onConfirm(item.id, dateDebut, dateFin)}
        disabled={loading}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer
      </Button>
    </div>
  );
};

export default DirecteurPoleInterface;
