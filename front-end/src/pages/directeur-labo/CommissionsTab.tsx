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
import { Commission } from '@/models/Commission';
import { Eye, CheckCircle } from 'lucide-react';

interface CommissionsTabProps {
    commissions: Commission[];
    searchTerm: string;
    onCreateCommission: () => void;
    onValidateCommission: (commissionId: number) => void;
}

const CommissionsTab: React.FC<CommissionsTabProps> = ({
    commissions,
    searchTerm,
    onCreateCommission,
    onValidateCommission
}) => {
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
                    
                </TableBody>
            </DataTable>

            {filteredCommissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Aucune commission trouvée
                </div>
            )}
        </motion.div>
    );
};

export default CommissionsTab;