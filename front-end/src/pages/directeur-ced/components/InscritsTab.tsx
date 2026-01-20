import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Inscription } from './types';

interface InscritsTabProps {
  inscrits: Inscription[];
}

// Function to get status badge
const getStatusBadge = (valider: boolean) => {
  return valider ? (
    <Badge variant="default" className="bg-green-500">Validé</Badge>
  ) : (
    <Badge variant="default" className="bg-yellow-500">Non validé</Badge>
  );
};

export const InscritsTab: React.FC<InscritsTabProps> = ({ inscrits }) => {
  if (inscrits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun inscrit trouvé
      </div>
    );
  }

  return (
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
        {inscrits.map((inscrit) => (
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
  );
};
