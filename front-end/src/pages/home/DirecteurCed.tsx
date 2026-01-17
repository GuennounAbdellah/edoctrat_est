import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Download, 
  GraduationCap, 
  Eye, 
  EyeOff,
  Search,
  Table,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { directeurCedApi } from '@/api/api';

// Define types based on the backend models
interface Candidat {
  id: number;
  cne: string;
  nom: string;
  prenom: string;
  email: string;
  telCandidat: string;
  dateDeNaissance: string;
  ville: string;
  etatDossier: number;
}

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
}

interface Sujet {
  id: number;
  professeur: Professeur;
  coDirecteur: Professeur | null;
  titre: string;
  description: string;
  publier: boolean;
}

interface Examiner {
  id: number;
  sujet: Sujet;
  cne: string;
  noteDossier: number;
  noteEntretien: number;
  decision: string;
  candidat: Candidat;
  publier: boolean;
}

interface Inscription {
  id: number;
  candidat: Candidat;
  sujet: Sujet;
  dateDiposeDossier: string;
  remarque: string;
  valider: boolean;
  pathFile: string;
}

const DirecteurCed = () => {
  const [activeTab, setActiveTab] = useState<'candidats' | 'sujets' | 'resultats' | 'inscrits'>('candidats');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Mock data - will be replaced with actual API calls
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [resultats, setResultats] = useState<Examiner[]>([]);
  const [inscrits, setInscrits] = useState<Inscription[]>([]);

  // Fetch data from API
  const fetchData = async () => {
    console.log('Fetching data for Directeur CED...');
    setLoading(true);
    try {
      // Fetch candidats
      console.log('Calling getCedCandidats...');
      const candidatsData = await directeurCedApi.getCedCandidats();
      setCandidats(candidatsData.data || []);
      
      // Fetch sujets
      const sujetsData = await directeurCedApi.getCedSujets();
      setSujets(sujetsData.data || []);
      
      // Fetch resultats
      const resultatsData = await directeurCedApi.getCedResultats();
      setResultats(resultatsData.data || []);
      
      // Fetch inscrits
      const inscritsData = await directeurCedApi.getAllInscriptions();
      setInscrits(inscritsData.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search term
  const filteredCandidats = candidats.filter(candidat =>
    candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.cne.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSujets = sujets.filter(sujet =>
    sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResultats = resultats.filter(resultat =>
    resultat.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.decision.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInscrits = inscrits.filter(inscrit =>
    inscrit.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to download report
  const downloadReport = async () => {
    try {
      const blob = await directeurCedApi.downloadRegistrationReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rapport-inscriptions.xlsx'; // Or appropriate file extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Rapport téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Erreur lors du téléchargement du rapport');
    }
  };

  // Function to get decision badge
  const getDecisionBadge = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'accepte':
        return <Badge variant="default" className="bg-green-500">Accepté</Badge>;
      case 'refuse':
        return <Badge variant="default" className="bg-red-500">Refusé</Badge>;
      case 'attente':
        return <Badge variant="default" className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge variant="secondary">{decision}</Badge>;
    }
  };

  // Function to get status badge
  const getStatusBadge = (valider: boolean) => {
    return valider ? (
      <Badge variant="default" className="bg-green-500">Validé</Badge>
    ) : (
      <Badge variant="default" className="bg-yellow-500">Non validé</Badge>
    );
  };

  // Function to get publication badge
  const getPublicationBadge = (publier: boolean) => {
    return publier ? (
      <Badge variant="default" className="bg-green-500">Publié</Badge>
    ) : (
      <Badge variant="default" className="bg-gray-500">Non publié</Badge>
    );
  };

  return (
    <Layout>
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
                Espace Directeur du Centre d'Études Doctorales
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gestion et supervision des activités du centre d'études doctorales
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Actions Directeur CED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Button
                  variant={activeTab === 'candidats' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('candidats')}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Consulter les candidats
                </Button>
                <Button
                  variant={activeTab === 'sujets' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('sujets')}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Consulter les sujets
                </Button>
                <Button
                  variant={activeTab === 'resultats' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('resultats')}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Consulter les résultats
                </Button>
                <Button
                  variant={activeTab === 'inscrits' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('inscrits')}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Consulter les inscrits
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
                <Button
                  variant="outline"
                  onClick={downloadReport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le rapport
                </Button>
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
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Date de naissance</TableHead>
                          <TableHead>Ville</TableHead>
                          <TableHead>État du dossier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidats.map((candidat) => (
                          <TableRow key={candidat.id}>
                            <TableCell className="font-medium">{candidat.cne}</TableCell>
                            <TableCell>{candidat.nom}</TableCell>
                            <TableCell>{candidat.prenom}</TableCell>
                            <TableCell>{candidat.email}</TableCell>
                            <TableCell>{candidat.telCandidat}</TableCell>
                            <TableCell>{new Date(candidat.dateDeNaissance).toLocaleDateString()}</TableCell>
                            <TableCell>{candidat.ville}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {candidat.etatDossier === 1 ? 'En cours' : candidat.etatDossier === 2 ? 'Terminé' : 'Inconnu'}
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
                          <TableHead>Description</TableHead>
                          <TableHead>Professeur</TableHead>
                          <TableHead>Co-directeur</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSujets.map((sujet) => (
                          <TableRow key={sujet.id}>
                            <TableCell className="font-medium">{sujet.titre}</TableCell>
                            <TableCell className="max-w-xs truncate">{sujet.description}</TableCell>
                            <TableCell>{`${sujet.professeur.nom} ${sujet.professeur.prenom}`}</TableCell>
                            <TableCell>
                              {sujet.coDirecteur 
                                ? `${sujet.coDirecteur.nom} ${sujet.coDirecteur.prenom}` 
                                : '-'}
                            </TableCell>
                            <TableCell>{getPublicationBadge(sujet.publier)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </DataTable>
                  )}

                  {activeTab === 'resultats' && (
                    <DataTable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Candidat</TableHead>
                          <TableHead>Note dossier</TableHead>
                          <TableHead>Note entretien</TableHead>
                          <TableHead>Décision</TableHead>
                          <TableHead>Publié</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResultats.map((resultat) => (
                          <TableRow key={resultat.id}>
                            <TableCell className="font-medium">{resultat.sujet.titre}</TableCell>
                            <TableCell>{`${resultat.candidat.nom} ${resultat.candidat.prenom}`}</TableCell>
                            <TableCell>{resultat.noteDossier}</TableCell>
                            <TableCell>{resultat.noteEntretien}</TableCell>
                            <TableCell>{getDecisionBadge(resultat.decision)}</TableCell>
                            <TableCell>{getPublicationBadge(resultat.publier)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </DataTable>
                  )}

                  {activeTab === 'inscrits' && (
                    <DataTable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidat</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Date dépôt</TableHead>
                          <TableHead>Remarque</TableHead>
                          <TableHead>Validé</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInscrits.map((inscrit) => (
                          <TableRow key={inscrit.id}>
                            <TableCell className="font-medium">
                              {`${inscrit.candidat.nom} ${inscrit.candidat.prenom}`}
                            </TableCell>
                            <TableCell>{inscrit.sujet.titre}</TableCell>
                            <TableCell>{new Date(inscrit.dateDiposeDossier).toLocaleDateString()}</TableCell>
                            <TableCell>{inscrit.remarque}</TableCell>
                            <TableCell>{getStatusBadge(inscrit.valider)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </DataTable>
                  )}
                </div>
              )}

              {(!loading && activeTab === 'candidats' && filteredCandidats.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun candidat trouvé
                </div>
              )}

              {(!loading && activeTab === 'sujets' && filteredSujets.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun sujet trouvé
                </div>
              )}

              {(!loading && activeTab === 'resultats' && filteredResultats.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun résultat trouvé
                </div>
              )}

              {(!loading && activeTab === 'inscrits' && filteredInscrits.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun inscrit trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DirecteurCed;