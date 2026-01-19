import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Postuler } from 'src/models/Postuler';

interface CandidatsTabProps {
  candidatures: Postuler[];
  onViewDetails: (candidature: Postuler) => void;
}

export const CandidatsTab: React.FC<CandidatsTabProps> = ({ candidatures, onViewDetails }) => {
  if (candidatures.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun candidat trouvé
      </div>
    );
  }

  return (
    <DataTable>
      <TableHeader>
        <TableRow>
          <TableHead>Titre Sujet</TableHead>
          <TableHead>Directeur</TableHead>
          <TableHead>Co-Directeur</TableHead>
          <TableHead>CNE</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Formation Doctorale</TableHead>
          <TableHead>CED</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidatures.map((candidature) => (
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
            <TableCell>{candidature.sujet.formationDoctorale.titre}</TableCell>
            <TableCell>{candidature.sujet.formationDoctorale.ced.toString()}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(candidature)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};

// Candidature Details Dialog Component
interface CandidatureDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature: Postuler | null;
}

export const CandidatureDetailsDialog: React.FC<CandidatureDetailsDialogProps> = ({
  open,
  onOpenChange,
  candidature,
}) => {
  if (!candidature) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails de la Candidature</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Candidate Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Informations du Candidat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">CNE</Label>
                <div className="text-base font-semibold">{candidature.candidat.cne}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                <div className="text-base">{candidature.candidat.nom} {candidature.candidat.prenom}</div>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <div className="text-base">{candidature.candidat.email}</div>
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
                <div className="text-base bg-white p-3 rounded border">{candidature.sujet.titre}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Directeur de Thèse</Label>
                  <div className="text-base bg-white p-3 rounded border">
                    {candidature.sujet.professeur.prenom} {candidature.sujet.professeur.nom}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Co-Directeur</Label>
                  <div className="text-base bg-white p-3 rounded border">
                    {candidature.sujet.coDirecteur
                      ? `${candidature.sujet.coDirecteur.prenom} ${candidature.sujet.coDirecteur.nom}`
                      : 'Non assigné'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Formation Doctorale</Label>
                  <div className="text-base bg-white p-3 rounded border">
                    {candidature.sujet.formationDoctorale.titre}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">CED</Label>
                <div className="text-base bg-white p-3 rounded border">
                  {candidature.sujet.formationDoctorale.ced.toString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
