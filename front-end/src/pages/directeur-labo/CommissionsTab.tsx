import React, { useState, useEffect } from 'react';
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
import { Commission } from '@/models/Commission';
import { Professeur } from '@/models/Professeur';
import { Sujet } from '@/models/Sujet';
import { Eye, CheckCircle } from 'lucide-react';
import { DirecteurLaboService } from '@/api/directeurLaboService';

interface CommissionsTabProps {
    searchTerm: string;
    onCreateCommission: () => void;
    onValidateCommission: (commissionId: number) => Promise<void>;
}

const CommissionsTab: React.FC<CommissionsTabProps> = ({
    searchTerm,
    onCreateCommission,
    onValidateCommission
}) => {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const response = await DirecteurLaboService.getAllCommissions();
            console.log('Fetched commissions:', response);
            
            // Convert CommissionResponse[] to Commission[] by properly typing participants
            const convertedCommissions: Commission[] = (response.results || []).map(commission => ({
                id: commission.id,
                dateCommission: commission.dateCommission,
                heure: commission.heure,
                valider: commission.valider,
                lieu: commission.lieu,
                labo: commission.labo,
                participants: (commission.participants as unknown[]).map(p => {
                    // Type guard to check if participant has required Professeur fields
                    const participant = p as Record<string, unknown>;
                    return {
                        id: typeof participant.id === 'number' ? participant.id : 0,
                        nom: typeof participant.nom === 'string' ? participant.nom : '',
                        prenom: typeof participant.prenom === 'string' ? participant.prenom : ''
                    };
                }),
                sujets: [] // subjects field is also unknown in response, initialize as empty array
            }));
            
            setCommissions(convertedCommissions);
        } catch (error) {
            console.error('Error fetching commissions:', error);
            setCommissions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCommissions = commissions.filter(commission =>
        commission.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (valider: boolean) => {
        return valider ? (
            <Badge className="bg-green-500">Validé</Badge>
        ) : (
            <Badge className="bg-yellow-500">Non validé</Badge>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex justify-end">
                <Button onClick={onCreateCommission} className="flex items-center gap-2">
                    Créer une commission
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Lieu</TableHead>
                            <TableHead>Heure</TableHead>
                            <TableHead>Membres</TableHead>
                            <TableHead>Sujets</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCommissions.length > 0 ? (
                            filteredCommissions.map((commission) => (
                                <TableRow key={commission.id}>
                                    <TableCell>
                                        {new Date(commission.dateCommission).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>{commission.lieu}</TableCell>
                                    <TableCell>{commission.heure}</TableCell>
                                    <TableCell>{commission.participants.map((participant) => participant.nom).join(', ')}</TableCell>
                                    <TableCell>{commission.sujets.map((sujet) => <div key={sujet.id}></div>)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {!commission.valider && (
                                                <Button 
                                                    variant="default" 
                                                    size="sm"
                                                    onClick={() => onValidateCommission(commission.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Valider
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Aucune commission trouvée
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </DataTable>
            )}

            {filteredCommissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Aucune commission trouvée
                </div>
            )}
        </motion.div>
    );
};

export default CommissionsTab;