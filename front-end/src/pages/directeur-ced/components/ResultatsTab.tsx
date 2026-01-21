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
import { ExaminerResponse } from '@/models/ExaminerResponse';

interface ResultatsTabProps {
  resultats: ExaminerResponse[];
}

// Function to get decision badge
const getDecisionBadge = (decision: string) => {
  if (!decision) return <Badge variant="secondary">Non défini</Badge>;
  switch (decision.toLowerCase()) {
    case 'accepte':
    case 'accepté':
    case 'admis':
      return <Badge variant="default" className="bg-green-500">Accepté</Badge>;
    case 'refuse':
    case 'refusé':
      return <Badge variant="default" className="bg-red-500">Refusé</Badge>;
    case 'attente':
    case 'en attente':
      return <Badge variant="default" className="bg-yellow-500">En attente</Badge>;
    default:
      return <Badge variant="secondary">{decision}</Badge>;
  }
};

// Function to get publication badge
const getPublicationBadge = (publier: boolean) => {
  return publier ? (
    <Badge variant="default" className="bg-green-500">Publié</Badge>
  ) : (
    <Badge variant="default" className="bg-gray-500">Non publié</Badge>
  );
};

export const ResultatsTab: React.FC<ResultatsTabProps> = ({ resultats }) => {
  if (resultats.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <DataTable>
      <TableHeader>
        <TableRow>
          <TableHead>Sujet</TableHead>
          <TableHead>Candidat</TableHead>
          <TableHead>Note dossier</TableHead>
          <TableHead>Note entretien</TableHead>
          <TableHead>Décision</TableHead>
          <TableHead>Publié</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resultats.map((resultat) => (
          <TableRow key={resultat.id}>
            <TableCell className="font-medium">{resultat.sujet?.titre || '-'}</TableCell>
            <TableCell>{resultat.candidat ? `${resultat.candidat.nom} ${resultat.candidat.prenom}` : '-'}</TableCell>
            <TableCell>{resultat.noteDossier ?? '-'}</TableCell>
            <TableCell>{resultat.noteEntretien ?? '-'}</TableCell>
            <TableCell>{getDecisionBadge(resultat.decision)}</TableCell>
            <TableCell>{getPublicationBadge(resultat.publier)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};
