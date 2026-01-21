import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Loader2,
  Trash2,
  ArrowLeft,
  Send,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  getCandidatPostulations, 
  deletePostulation,
  confirmPostulations,
  getBaseConfig,
  PostulationResponse
} from '@/api/candidatService';

interface SelectedSujet {
  id: number;
  postulerId?: number;
  titre: string;
  professeur: {
    nom: string;
    prenom: string;
  };
  formationDoctorale: {
    titre: string;
    ced: {
      titre: string;
    };
  };
  laboratoire: string;
  pathFile?: string;
  confirmed?: boolean;
}

interface ApiError extends Error {
  friendlyMessage?: string;
}

const SujetsChoisisPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedSujets, setSelectedSujets] = useState<SelectedSujet[]>([]);
  const [maxSujets, setMaxSujets] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch configuration for max subjects
        try {
          const config = await getBaseConfig();
          setMaxSujets(config.maxSujetPostuler || 3);
        } catch (configErr) {
          console.error('Error fetching config:', configErr);
        }

        // Fetch candidate's existing postulations
        const postulationsResponse = await getCandidatPostulations();
        const postulations = postulationsResponse.results || [];
        
        // Map postulations to selected sujets
        const selectedFromApi: SelectedSujet[] = postulations.map((p: PostulationResponse) => ({
          id: p.sujet?.id || p.sujetId || 0,
          postulerId: p.id,
          titre: p.sujet?.titre || p.sujetTitre || '',
          professeur: {
            nom: p.sujet?.professeur?.nom || p.professeurNom || '',
            prenom: p.sujet?.professeur?.prenom || p.professeurPrenom || ''
          },
          formationDoctorale: {
            titre: p.sujet?.formationDoctorale?.titre || '',
            ced: { titre: p.sujet?.formationDoctorale?.ced?.titre || '' }
          },
          laboratoire: p.sujet?.laboratoire || '',
          pathFile: p.pathFile,
          confirmed: p.confirmed
        }));
        setSelectedSujets(selectedFromApi);

      } catch (err: unknown) {
        console.error('Error fetching postulations:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de charger vos candidatures.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveSujet = async (sujetId: number) => {
    const sujet = selectedSujets.find(s => s.id === sujetId);
    
    // Prevent removal of confirmed sujets
    if (sujet?.confirmed) {
      setError('Impossible de supprimer un sujet déjà confirmé.');
      return;
    }
    
    if (sujet?.postulerId) {
      try {
        await deletePostulation(sujet.postulerId);
        setSelectedSujets(prev => prev.filter(s => s.id !== sujetId));
        setSuccessMessage('Candidature supprimée avec succès.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: unknown) {
        console.error('Error deleting postulation:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de supprimer cette candidature.');
      }
    } else {
      setSelectedSujets(prev => prev.filter(s => s.id !== sujetId));
    }
  };

  const handleConfirmSelection = async () => {
    setShowConfirmDialog(false);
    setIsConfirming(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get all unconfirmed postulation IDs
      const unconfirmedPostulationIds = selectedSujets
        .filter(s => s.postulerId && !s.confirmed)
        .map(s => s.postulerId as number);

      if (unconfirmedPostulationIds.length === 0) {
        setError('Aucun sujet à confirmer.');
        setIsConfirming(false);
        return;
      }

      await confirmPostulations(unconfirmedPostulationIds);
      
      // Update local state to mark all as confirmed
      setSelectedSujets(prev => prev.map(s => ({ ...s, confirmed: true })));
      setSuccessMessage('Vos candidatures ont été confirmées avec succès ! Vous recevrez une notification pour les prochaines étapes.');
    } catch (err: unknown) {
      console.error('Error confirming postulations:', err);
      const apiError = err as ApiError;
      setError(apiError.friendlyMessage || 'Impossible de confirmer vos candidatures. Veuillez réessayer.');
    } finally {
      setIsConfirming(false);
    }
  };

  const hasUnconfirmedSujets = selectedSujets.some(s => !s.confirmed);
  const allConfirmed = selectedSujets.length > 0 && selectedSujets.every(s => s.confirmed);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes sujets choisis</h2>
            <p className="text-gray-500">Gérez vos candidatures aux sujets de thèse</p>
          </div>
        </div>
        
        <Link to="/candidat-dashboard/postuler">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour aux sujets</span>
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Selected Subjects */}
      {selectedSujets.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Sujets sélectionnés ({selectedSujets.length}/{maxSujets})
                </div>
                {allConfirmed && (
                  <Badge className="bg-green-100 text-green-800">
                    Tous confirmés
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSujets.map((sujet) => (
                <div
                  key={sujet.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 ${
                    sujet.confirmed 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{sujet.titre}</h4>
                      {sujet.confirmed ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Confirmé
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-400 text-xs">
                          En attente de confirmation
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Prof. {sujet.professeur.prenom} {sujet.professeur.nom}
                    </p>
                    {sujet.pathFile && (
                      <p className="text-sm text-primary mt-1">
                        📄 Projet de thèse: {sujet.pathFile}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!sujet.confirmed && (
                      <>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="application/pdf"
                            className="max-w-[200px] text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveSujet(sujet.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Confirmation Button */}
          {hasUnconfirmedSujets && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Confirmez vos choix</p>
                      <p className="text-sm text-gray-600">
                        Une fois confirmés, vos choix de sujets seront envoyés aux professeurs concernés. 
                        Vous ne pourrez plus modifier votre sélection.
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="gap-2 whitespace-nowrap"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirmation...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirmer mes choix
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Aucun sujet sélectionné</p>
              <p className="text-sm text-gray-400 mt-1">
                Vous n'avez pas encore choisi de sujet de thèse.
              </p>
              <Link to="/candidat-dashboard/postuler">
                <Button className="mt-4 gap-2">
                  <FileText className="w-4 h-4" />
                  Parcourir les sujets disponibles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer vos choix de sujets</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de confirmer vos choix de sujets de thèse. 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-3">Sujets à confirmer :</p>
            <ul className="space-y-2">
              {selectedSujets.filter(s => !s.confirmed).map((sujet) => (
                <li key={sujet.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{sujet.titre}</span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmSelection} className="gap-2">
              <Send className="w-4 h-4" />
              Confirmer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SujetsChoisisPage;
