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
import { Sujet } from '@/models/Sujet';
import { Edit, Trash2 } from 'lucide-react';

interface SubjectsTabProps {
    sujets: Sujet[];
    searchTerm: string;
    onAddSubject: () => void;
}

const SubjectsTab: React.FC<SubjectsTabProps> = ({
    sujets,
    searchTerm,
    onAddSubject
}) => {
    const filteredSujets = sujets.filter(sujet =>
        sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sujet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPublicationBadge = (publier: boolean) => {
        return publier ? (
            <Badge className="bg-green-500">Publié</Badge>
        ) : (
            <Badge className="bg-gray-500">Non publié</Badge>
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
                <Button onClick={onAddSubject} className="flex items-center gap-2">
                    Ajouter un sujet
                </Button>
            </div>

            <DataTable>
                <TableHeader>
                    <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Directeur</TableHead>
                        <TableHead>Co-Directeur</TableHead>
                        <TableHead>Formation Doctorale</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSujets.map((sujet) => (
                        <TableRow key={sujet.id}>
                            <TableCell className="font-medium">{sujet.titre}</TableCell>
                            <TableCell>{sujet.professeur.nom} {sujet.professeur.prenom}</TableCell>
                            <TableCell>{sujet.coDirecteur?.nom} {sujet.coDirecteur?.prenom}</TableCell>
                            <TableCell>{sujet.formationDoctorale.nom}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </DataTable>
        </motion.div>
    );
};

export default SubjectsTab;