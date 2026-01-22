import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Download, 
  GraduationCap, 
  Search,
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
import Header from '@/components/layout/Header';
import { toast } from 'sonner';
import apiClient from '@/api/api';

// Import models from existing project models
import { Candidat } from '@/models/Candidat';
import { Sujet } from '@/models/Sujet';
import { ExaminerResponse } from '@/models/ExaminerResponse';

// Response interface matching backend ResultDTO
interface ResultDTO<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Define Inscription interface based on backend InscriptionResponse
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
  
  // State for data - using proper types
  const [candidats, setCandidats] = useState<ExaminerResponse[]>([]);
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [resultats, setResultats] = useState<ExaminerResponse[]>([]);
  const [inscrits, setInscrits] = useState<Inscription[]>([]);

  // Fetch data from API using apiClient (axios) following project pattern
  const fetchData = async () => {
    console.log('Fetching data for Directeur CED...');
    setLoading(true);
    try {
      // Fetch candidats (examiners) - backend returns ResultDTO<ExaminerResponse>
      console.log('Calling getCedCandidats...');
      const candidatsResponse = await apiClient.get<ResultDTO<ExaminerResponse>>('/api/get-ced-candidats/');
      setCandidats(candidatsResponse.data.results || []);
      
      // Fetch sujets - backend returns ResultDTO<SujetResponse>
      const sujetsResponse = await apiClient.get<ResultDTO<Sujet>>('/api/get-ced-sujets/');
      setSujets(sujetsResponse.data.results || []);
      
      // Fetch resultats (published examiners) - backend returns ResultDTO<ExaminerResponse>
      const resultatsResponse = await apiClient.get<ResultDTO<ExaminerResponse>>('/api/get-ced-resultats/');
      setResultats(resultatsResponse.data.results || []);
      
      // Fetch inscrits - backend returns ResultDTO<InscriptionResponse>
      const inscritsResponse = await apiClient.get<ResultDTO<Inscription>>('/api/get-ced-inscriptions/');
      setInscrits(inscritsResponse.data.results || []);
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

  // Filter data based on search term - updated for ExaminerResponse structure
  const filteredCandidats = candidats.filter(examiner =>
    examiner.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.cne?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.cne?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSujets = sujets.filter(sujet =>
    sujet.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResultats = resultats.filter(resultat =>
    resultat.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.decision?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInscrits = inscrits.filter(inscrit =>
    inscrit.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to download report
  const downloadReport = async () => {
    try {
      const response = await apiClient.get('/api/download-registration-report', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rapport-inscriptions.xlsx';
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
    if (!decision) return <Badge variant="secondary">Non défini</Badge>;
    switch (decision.toLowerCase()) {
      case 'accepte':
      case 'accepté':
      case 'admis':
        return <Badge variant="default" className="bg-green-500">Accepté</Badge>;
      case 'refuse':
      case 'refusé':
        return <Badge variant="default" className="bg-red-500">Refusé</Badge>;
      case 'attente':
      case 'en attente':
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
        <Header />
        {/* Header Section */}
        <section className="py-8 lg:py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
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
                          <TableHead>Sujet</TableHead>
                          <TableHead>Décision</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidats.map((examiner) => (
                          <TableRow key={examiner.id}>
                            <TableCell className="font-medium">{examiner.candidat?.cne || examiner.cne}</TableCell>
                            <TableCell>{examiner.candidat?.nom || '-'}</TableCell>
                            <TableCell>{examiner.candidat?.prenom || '-'}</TableCell>
                            <TableCell>{examiner.candidat?.email || '-'}</TableCell>
                            <TableCell>{examiner.candidat?.telCandidat || '-'}</TableCell>
                            <TableCell>{examiner.sujet?.titre || '-'}</TableCell>
                            <TableCell>{getDecisionBadge(examiner.decision)}</TableCell>
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
                            <TableCell>{sujet.professeur ? `${sujet.professeur.nom} ${sujet.professeur.prenom}` : '-'}</TableCell>
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
                            <TableCell className="font-medium">{resultat.sujet?.titre || '-'}</TableCell>
                            <TableCell>{resultat.candidat ? `${resultat.candidat.nom} ${resultat.candidat.prenom}` : '-'}</TableCell>
                            <TableCell>{resultat.noteDossier ?? '-'}</TableCell>
                            <TableCell>{resultat.noteEntretien ?? '-'}</TableCell>
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
                              {inscrit.candidat ? `${inscrit.candidat.nom} ${inscrit.candidat.prenom}` : '-'}
                            </TableCell>
                            <TableCell>{inscrit.sujet?.titre || '-'}</TableCell>
                            <TableCell>{inscrit.dateDiposeDossier ? new Date(inscrit.dateDiposeDossier).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>{inscrit.remarque || '-'}</TableCell>
                            <TableCell>{getStatusBadge(inscrit.valider)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </DataTable>
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

              {!loading && activeTab === 'resultats' && filteredResultats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun résultat trouvé
                </div>
              )}

              {!loading && activeTab === 'inscrits' && filteredInscrits.length === 0 && (
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

export default DirecteurCed