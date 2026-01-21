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
import { Sujet } from '@/models/Sujet';

interface SujetsTabProps {
  sujets: Sujet[];
}

// Function to get publication badge
const getPublicationBadge = (publier: boolean) => {
  return publier ? (
    <Badge variant="default" className="bg-green-500">Publié</Badge>
  ) : (
    <Badge variant="default" className="bg-gray-500">Non publié</Badge>
  );
};

export const SujetsTab: React.FC<SujetsTabProps> = ({ sujets }) => {
  if (sujets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun sujet trouvé
      </div>
    );
  }

  return (
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
        {sujets.map((sujet) => (
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
  );
};
