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
import { Send } from 'lucide-react';

interface PreselectionTabProps {
    onSendInvitations: () => void;
}

const PreselectionTab: React.FC<PreselectionTabProps> = ({ onSendInvitations }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Candidats présélectionnés</h3>
                <Button variant="outline" onClick={onSendInvitations} className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer convocations
                </Button>
            </div>

            <DataTable>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Sujet</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   
                </TableBody>
            </DataTable>
        </motion.div>
    );
};

export default PreselectionTab;