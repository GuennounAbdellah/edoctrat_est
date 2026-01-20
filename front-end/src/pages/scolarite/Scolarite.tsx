import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  FileCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';
import { CandidatsTable, CandidatDetailsDialog } from './components';
import { CandidatResponse } from '@/models/CandidatResponse';
import scolariteService from '@/api/scolariteService';

const Scolarite: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  // State for data
  const [candidats, setCandidats] = useState<CandidatResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState<CandidatResponse | null>(null);

  // Fetch candidats
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const result = await scolariteService.getScolariteCandidats();
      if (result.results) {
        setCandidats(result.results);
        setTotalCount(result.count);
      } else {
        throw new Error('No data received');
      }
      toast({
        title: "Succès",
        description: "Les candidats ont été chargés avec succès",
      });
    } catch (error) {
      console.error('Error fetching candidats:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des candidats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle view details
  const handleViewDetails = (candidat: CandidatResponse) => {
    setSelectedCandidat(candidat);
    setIsDetailsDialogOpen(true);
  };

  // Handle validate dossier
  const handleValider = async (candidat: CandidatResponse, commentaire?: string) => {
    setActionLoading(true);
    try {
      const updatedCandidat = await scolariteService.validerDossier(candidat.id, commentaire);
      
      // Update the candidat in the list
      setCandidats(prev => 
        prev.map(c => c.id === candidat.id ? { ...c, etatDossier: 1, commentaireScolarite: commentaire } : c)
      );
      
      toast({
        title: "Succès",
        description: `Le dossier de ${candidat.prenom} ${candidat.nom} a été validé`,
      });
      
      setIsDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error validating dossier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation du dossier",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle invalidate dossier
  const handleInvalider = async (candidat: CandidatResponse, commentaire?: string) => {
    setActionLoading(true);
    try {
      const updatedCandidat = await scolariteService.invaliderDossier(candidat.id, commentaire);
      
      // Update the candidat in the list
      setCandidats(prev => 
        prev.map(c => c.id === candidat.id ? { ...c, etatDossier: 0, commentaireScolarite: commentaire } : c)
      );
      
      toast({
        title: "Succès",
        description: `Le dossier de ${candidat.prenom} ${candidat.nom} a été invalidé`,
      });
      
      setIsDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error invalidating dossier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'invalidation du dossier",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter candidats based on search term
  const filteredCandidats = candidats.filter(candidat =>
    candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidat.sujetPostule && candidat.sujetPostule.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (candidat.formationDoctorale && candidat.formationDoctorale.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistics
  const validatedCount = candidats.filter(c => c.etatDossier === 1).length;
  const invalidatedCount = candidats.filter(c => c.etatDossier === 0).length;
  const pendingCount = candidats.filter(c => c.etatDossier === undefined || c.etatDossier === null).length;

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
              Espace Scolarité
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestion et validation des dossiers des candidats au doctorat
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <p className="text-center text-primary font-medium">
                💡 Double-cliquez sur une ligne pour valider ou invalider le dossier du candidat
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6" />
                  Validation des Dossiers
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCandidats}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, prénom, CNE, email, sujet ou formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Candidats Table */}
              <div className="overflow-x-auto">
                <CandidatsTable
                  candidats={filteredCandidats}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              </div>

              {/* Pagination Info */}
              {!loading && candidats.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Affichage de {filteredCandidats.length} sur {totalCount} candidat(s)
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Total Candidats</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{validatedCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Dossiers Validés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-2">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600">{invalidatedCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Dossiers Invalidés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-2">
                <FileCheck className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-muted-foreground mt-2">En Attente</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Candidat Details Dialog */}
      <CandidatDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        candidat={selectedCandidat}
        onValider={handleValider}
        onInvalider={handleInvalider}
        loading={actionLoading}
      />
    </div>
  );
};

export default Scolarite;