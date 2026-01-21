import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CandidatsTab, CandidatureDetailsDialog } from '../components';
import { Postuler } from '@/models/Postuler';
import directeurPoleService from '@/api/directeurPoleService';

const CandidatsPage: React.FC = () => {
  const [candidatures, setCandidatures] = useState<Postuler[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCandidateDetailDialogOpen, setIsCandidateDetailDialogOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Postuler | null>(null);
  const { toast } = useToast();

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const result = await directeurPoleService.getAllCandidats();
      if (result.results) {
        setCandidatures(result.results as Postuler[]);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewCandidatureDetails = (candidature: Postuler) => {
    setSelectedCandidature(candidature);
    setIsCandidateDetailDialogOpen(true);
  };

  const filteredCandidatures = candidatures.filter(candidature =>
    candidature.candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.candidat.cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.sujet.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom, CNE ou sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <CandidatsTab
                candidatures={filteredCandidatures}
                onViewDetails={handleViewCandidatureDetails}
              />
            </div>
          )}

          {/* Statistics */}
          <div className="bg-green-50 p-4 rounded-lg text-center mt-6">
            <div className="text-2xl font-bold text-green-600">{candidatures.length}</div>
            <div className="text-sm text-muted-foreground">Candidatures</div>
          </div>
        </CardContent>
      </Card>

      <CandidatureDetailsDialog
        open={isCandidateDetailDialogOpen}
        onOpenChange={setIsCandidateDetailDialogOpen}
        candidature={selectedCandidature}
      />
    </>
  );
};

export default CandidatsPage;
