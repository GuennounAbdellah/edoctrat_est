import React, { useEffect, useState } from 'react';
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
import { DirecteurLaboService } from '@/api/directeurLaboService';

interface PostulerJoinedResponse {
    id: number;
    cne: string;
    nom: string;
    prenom: string;
    sujetPostule: string;
    directeurNom: string;
    directeurPrenom: string;
    codirecteurNom: string;
    codirecteurPrenom: string;
    formationDoctorale: string;
}

interface CandidatesTabProps {
    searchTerm: string;
    onViewCandidateDetails: (candidateId: number) => void;
}

const CandidatesTab: React.FC<CandidatesTabProps> = ({
    searchTerm,
    onViewCandidateDetails
}) => {
    const [joinedData, setJoinedData] = useState<PostulerJoinedResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DirecteurLaboService.getJoinedCandidats();
                setJoinedData(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching joined data:', error);
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const filteredData = joinedData.filter(data =>
        data.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.cne?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.sujetPostule?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Chargement...
            </div>
        );
    }

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
                        <TableHead>Directeur</TableHead>
                        <TableHead>Co-Directeur</TableHead>
                        <TableHead>Formation Doctorale</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((data) => (
                        <TableRow key={data.id}>
                            <TableCell>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                                    onClick={() => onViewCandidateDetails(data.id)}
                                >
                                    {data.cne}
                                </Button>
                            </TableCell>
                            <TableCell className="font-medium">{data.nom} {data.prenom}</TableCell>
                            <TableCell>{data.sujetPostule}</TableCell>
                            <TableCell>{data.directeurNom} {data.directeurPrenom}</TableCell>
                            <TableCell>{data.codirecteurNom || ''} {data.codirecteurPrenom || ''}</TableCell>
                            <TableCell>{data.formationDoctorale}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </DataTable>
            {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Aucun candidat trouvé
                </div>
            )}
        </motion.div>
    );
};

export default CandidatesTab;