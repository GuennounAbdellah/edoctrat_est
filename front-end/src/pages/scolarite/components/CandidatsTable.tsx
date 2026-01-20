import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CandidatResponse } from '@/models/CandidatResponse';

interface CandidatsTableProps {
  candidats: CandidatResponse[];
  onViewDetails: (candidat: CandidatResponse) => void;
  loading?: boolean;
}

export const CandidatsTable: React.FC<CandidatsTableProps> = ({ 
  candidats, 
  onViewDetails,
  loading 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (candidats.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun candidat trouvé
      </div>
    );
  }

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
    <DataTable>
      <TableHeader>
        <TableRow className="bg-primary/5">
          <TableHead>CNE</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Sujet Postulé</TableHead>
          <TableHead>Formation Doctorale</TableHead>
          <TableHead>Directeur</TableHead>
          <TableHead>État Dossier</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidats.map((candidat) => (
          <TableRow 
            key={candidat.id}
            className="cursor-pointer hover:bg-muted/50"
            onDoubleClick={() => onViewDetails(candidat)}
          >
            <TableCell className="font-medium">{candidat.cne}</TableCell>
            <TableCell>{candidat.nom}</TableCell>
            <TableCell>{candidat.prenom}</TableCell>
            <TableCell className="max-w-xs truncate">{candidat.sujetPostule || '-'}</TableCell>
            <TableCell>{candidat.formationDoctorale || '-'}</TableCell>
            <TableCell>
              {candidat.directeurNom && candidat.directeurPrenom 
                ? `${candidat.directeurPrenom} ${candidat.directeurNom}` 
                : '-'}
            </TableCell>
            <TableCell>{getEtatDossierBadge(candidat.etatDossier)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(candidat)}
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

export default CandidatsTable;
