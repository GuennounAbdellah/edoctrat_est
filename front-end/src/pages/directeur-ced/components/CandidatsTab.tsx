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

interface CandidatsTabProps {
  candidats: ExaminerResponse[];
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

export const CandidatsTab: React.FC<CandidatsTabProps> = ({ candidats }) => {
  if (candidats.length === 0) {
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
          <TableHead>CNE</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Sujet</TableHead>
          <TableHead>Décision</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidats.map((examiner) => (
          <TableRow key={examiner.id}>
            <TableCell className="font-medium">{examiner.candidat?.cne || examiner.cne}</TableCell>
            <TableCell>{examiner.candidat?.nom || '-'}</TableCell>
            <TableCell>{examiner.candidat?.prenom || '-'}</TableCell>
            <TableCell>{examiner.candidat?.email || '-'}</TableCell>
            <TableCell>{examiner.candidat?.telCandidat || '-'}</TableCell>
            <TableCell>{examiner.sujet?.titre || '-'}</TableCell>
            <TableCell>{getDecisionBadge(examiner.decision)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};
