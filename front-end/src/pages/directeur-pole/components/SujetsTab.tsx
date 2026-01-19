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

export const SujetsTab: React.FC<SujetsTabProps> = ({ sujets }) => {
  const getPublicationBadge = (publier: boolean) => {
    return publier ? (
      <Badge className="bg-green-500">Publié</Badge>
    ) : (
      <Badge className="bg-gray-500">Non publié</Badge>
    );
  };

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
          <TableHead>Titre | Sujet | Thème</TableHead>
          <TableHead>Directeur</TableHead>
          <TableHead>Co-Directeur</TableHead>
          <TableHead>Formation Doctorale</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sujets.map((sujet) => (
          <TableRow key={sujet.id}>
            <TableCell className="font-medium max-w-xs truncate">{sujet.titre}</TableCell>
            <TableCell>
              {sujet.professeur 
                ? `${sujet.professeur.prenom || ''} ${sujet.professeur.nom || ''}`.trim() || '-'
                : '-'}
            </TableCell>
            <TableCell>
              {sujet.coDirecteur
                ? `${sujet.coDirecteur.prenom || ''} ${sujet.coDirecteur.nom || ''}`.trim() || '-'
                : '-'}
            </TableCell>
            <TableCell>{sujet.formationDoctorale?.titre || '-'}</TableCell>
            <TableCell>{getPublicationBadge(sujet.publier)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};
