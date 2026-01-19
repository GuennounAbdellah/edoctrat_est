import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table as DataTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Examiner } from '@/models/Examiner';

interface ResultsTabProps {
    results: Examiner[];
    searchTerm: string;
    onViewCandidateDetails: (candidateData: any) => Promise<void>;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ results, searchTerm, onViewCandidateDetails }) => {
    const filteredResults = results.filter(result =>
        result.candidat?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.candidat?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.sujet?.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDecisionBadge = (decision: string) => {
        switch (decision.toLowerCase()) {
            case 'admis':
                return <Badge className="bg-green-500">Admis</Badge>;
            case 'ajourné':
                return <Badge className="bg-yellow-500">Ajourné</Badge>;
            case 'refusé':
                return <Badge className="bg-red-500">Refusé</Badge>;
            default:
                return <Badge variant="secondary">{decision}</Badge>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <DataTable>
                <TableHeader>
                    <TableRow>
                        <TableHead>CNE</TableHead>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Sujet</TableHead>
                        <TableHead>Note de dossier</TableHead>
                        <TableHead>Note d'entretien</TableHead>
                        <TableHead>Moyenne générale</TableHead>
                        <TableHead>Décision</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredResults.map((result) => (
                        <TableRow key={result.id}>
                            <TableCell>
                                <Button 
                                    variant="link" 
                                    className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                                    onClick={async () => {
                                        // Create a joined data object similar to what CandidatesTab uses
                                        const candidateData = {
                                            id: result.candidat?.id || 0,
                                            cne: result.cne,
                                            nom: result.candidat?.nom || '',
                                            prenom: result.candidat?.prenom || '',
                                            sujetPostule: result.sujet?.titre || '',
                                            directeurNom: '', // Not available in this context
                                            directeurPrenom: '',
                                            codirecteurNom: '',
                                            codirecteurPrenom: '',
                                            formationDoctorale: '' // Not available in this context
                                        };
                                        await onViewCandidateDetails(candidateData);
                                    }}
                                >
                                    {result.cne}
                                </Button>
                            </TableCell>
                            <TableCell>{result.candidat?.nom} {result.candidat?.prenom}</TableCell>
                            <TableCell>{result.sujet?.titre}</TableCell>
                            <TableCell>{result.noteDossier}/20</TableCell>
                            <TableCell>{result.noteEntretien}</TableCell>
                            <TableCell>{((result.noteDossier + result.noteEntretien) / 2).toFixed(2)}/20</TableCell>
                            <TableCell>{getDecisionBadge(result.decision)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </DataTable>

            {filteredResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Aucun résultat trouvé
                </div>
            )}
        </motion.div>
    );
};

export default ResultsTab;