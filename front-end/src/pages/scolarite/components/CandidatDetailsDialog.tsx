import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, FileText, GraduationCap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CandidatResponse } from '@/models/CandidatResponse';

interface CandidatDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidat: CandidatResponse | null;
  onValider: (candidat: CandidatResponse, commentaire?: string) => void;
  onInvalider: (candidat: CandidatResponse, commentaire?: string) => void;
  loading?: boolean;
}

export const CandidatDetailsDialog: React.FC<CandidatDetailsDialogProps> = ({
  open,
  onOpenChange,
  candidat,
  onValider,
  onInvalider,
  loading = false,
}) => {
  const [commentaire, setCommentaire] = useState('');

  // Reset comment when dialog opens with a new candidat
  useEffect(() => {
    if (candidat) {
      setCommentaire(candidat.commentaireScolarite || '');
    }
  }, [candidat]);

  if (!candidat) return null;

  const getEtatDossierBadge = (etatDossier: number | undefined) => {
    if (etatDossier === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Validé
        </Badge>
      );
    } else if (etatDossier === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Non validé
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        En attente
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Validation du Dossier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Candidate Personal Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du Candidat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">CNE</Label>
                <div className="text-base font-semibold">{candidat.cne}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">CIN</Label>
                <div className="text-base">{candidat.cin}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Nom</Label>
                <div className="text-base">{candidat.nom}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                <div className="text-base">{candidat.prenom}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <div className="text-base">{candidat.email}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                <div className="text-base">{candidat.telCandidat || '-'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Date de Naissance</Label>
                <div className="text-base">{candidat.dateDeNaissance || '-'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Ville de Naissance</Label>
                <div className="text-base">{candidat.villeDeNaissance || '-'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Sexe</Label>
                <div className="text-base">{candidat.sexe || '-'}</div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-sm font-medium text-gray-500">Adresse</Label>
                <div className="text-base">{candidat.adresse || '-'}</div>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Informations Académiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-500">Sujet Postulé</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidat.sujetPostule || 'Non spécifié'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Formation Doctorale</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidat.formationDoctorale || 'Non spécifiée'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Directeur de Thèse</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidat.directeurNom && candidat.directeurPrenom
                    ? `${candidat.directeurPrenom} ${candidat.directeurNom}`
                    : 'Non assigné'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Co-Directeur</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidat.codirecteurNom && candidat.codirecteurPrenom
                    ? `${candidat.codirecteurPrenom} ${candidat.codirecteurNom}`
                    : 'Non assigné'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Pays</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidat.pays || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-500">État Actuel du Dossier</Label>
              <div className="mt-1">{getEtatDossierBadge(candidat.etatDossier)}</div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Commentaire
            </h3>
            <Textarea
              placeholder="Ajoutez un commentaire..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => onInvalider(candidat, commentaire)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Invalider
          </Button>
          <Button
            variant="default"
            onClick={() => onValider(candidat, commentaire)}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidatDetailsDialog;
