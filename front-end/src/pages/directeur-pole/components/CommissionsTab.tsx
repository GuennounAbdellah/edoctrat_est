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
import { Commission } from 'src/models/Commission';

interface CommissionsTabProps {
  commissions: Commission[];
}

export const CommissionsTab: React.FC<CommissionsTabProps> = ({ commissions }) => {
  const getStatusBadge = (valider: boolean) => {
    return valider ? (
      <Badge className="bg-green-500">Validé</Badge>
    ) : (
      <Badge className="bg-yellow-500">En attente</Badge>
    );
  };

  if (commissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune commission trouvée
      </div>
    );
  }

  return (
    <DataTable>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Heure</TableHead>
          <TableHead>Lieu</TableHead>
          <TableHead>Sujets</TableHead>
          <TableHead>Membres</TableHead>
          <TableHead>Laboratoire</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commissions.map((commission) => (
          <TableRow key={commission.id}>
            <TableCell>{new Date(commission.dateCommission).toLocaleDateString('fr-FR')}</TableCell>
            <TableCell>{commission.heure}</TableCell>
            <TableCell>{commission.lieu}</TableCell>
            <TableCell>
              <ul className="list-disc list-inside text-sm">
                {commission.sujets.map((sujet) => (
                  <li key={sujet.id} className="truncate max-w-xs">{sujet.titre}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>
              <ul className="list-disc list-inside text-sm">
                {commission.participants.map((participant) => (
                  <li key={participant.id}>{participant.nom} {participant.prenom}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>{commission.labo}</TableCell>
            <TableCell>{getStatusBadge(commission.valider)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};
