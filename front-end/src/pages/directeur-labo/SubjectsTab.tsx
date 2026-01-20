import React, { useState, useEffect, ChangeEvent } from 'react';
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

// Import service
import { DirecteurLaboService } from '@/api/directeurLaboService';

interface SubjectsTabProps {
    searchTerm: string;
    onAddSubject: () => void;
}

const SubjectsTab: React.FC<SubjectsTabProps> = ({
    searchTerm,
    onAddSubject
}) => {
    const [sujets, setSujets] = useState<Sujet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for edit dialog
    const [editingSujet, setEditingSujet] = useState<Sujet | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    // State for delete confirmation
    const [deletingSujetId, setDeletingSujetId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // State for form data
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        publier: false,
    });

    // Fetch subjects from API
    useEffect(() => {
        const fetchSujets = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await DirecteurLaboService.getAllSujets();
                // Transform SujetResponse to Sujet type
                const subjectsData = response.results.map(item => ({
                    id: item.id,
                    professeur: item.professeur,
                    coDirecteur: item.coDirecteur || null,
                    titre: item.titre,
                    description: item.description,
                    formationDoctorale: item.formationDoctorale,
                    publier: item.publier
                })) as Sujet[];
                setSujets(subjectsData);
            } catch (err) {
                console.error('Error fetching subjects:', err);
                setError('Failed to load subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchSujets();
    }, []);

    const filteredSujets = sujets.filter(sujet =>
        sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sujet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Handle edit button click
    const handleEditClick = (sujet: Sujet) => {
        console.log('Edit button clicked for sujet:', sujet);
        setEditingSujet(sujet);
        setFormData({
            titre: sujet.titre,
            description: sujet.description,
            publier: sujet.publier,
        });
        setIsEditDialogOpen(true);
        console.log('Edit dialog should be open now');
    };
    
    // Handle form input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    // Handle subject update
    const handleUpdateSubject = async () => {
        if (!editingSujet) return;
        
        try {
            const updatedSujet = {
                ...editingSujet,
                titre: formData.titre,
                description: formData.description,
                publier: formData.publier,
            };
            
            const response = await DirecteurLaboService.updateSujet(editingSujet.id, updatedSujet);
            
            // Transform SujetResponse to Sujet type
            const transformedResponse = {
                id: response.id,
                professeur: response.professeur,
                coDirecteur: response.coDirecteur || null,
                titre: response.titre,
                description: response.description,
                formationDoctorale: response.formationDoctorale,
                publier: response.publier
            } as Sujet;
            
            // Update the subject in the list
            setSujets(prevSujets => 
                prevSujets.map(sujet => 
                    sujet.id === transformedResponse.id ? transformedResponse : sujet
                )
            );
            
            setIsEditDialogOpen(false);
            setEditingSujet(null);
        } catch (err) {
            console.error('Error updating subject:', err);
            setError('Failed to update subject');
        }
    };
    
    // Handle delete button click
    const handleDeleteClick = (id: number) => {
        console.log('Delete button clicked for id:', id);
        setDeletingSujetId(id);
        setIsDeleteDialogOpen(true);
        console.log('Delete dialog should be open now');
    };
    
    // Confirm delete action
    const confirmDelete = async () => {
        if (deletingSujetId !== null) {
            try {
                await DirecteurLaboService.deleteSujet(deletingSujetId);
                // Refresh the subjects list
                setSujets(prevSujets => prevSujets.filter(sujet => sujet.id !== deletingSujetId));
                setIsDeleteDialogOpen(false);
                setDeletingSujetId(null);
            } catch (err) {
                console.error('Error deleting subject:', err);
                setError('Failed to delete subject');
            }
        }
    };

    const getPublicationBadge = (publier: boolean) => {
        return publier ? (
            <Badge className="bg-green-500">Publié</Badge>
        ) : (
            <Badge className="bg-gray-500">Non publié</Badge>
        );
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-8"
            >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-red-500"
            >
                {error}
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <DataTable>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Directeur</TableHead>
                            <TableHead>Co-Directeur</TableHead>
                            <TableHead>Formation Doctorale</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSujets.map((sujet) => (
                            <TableRow key={sujet.id}>
                                <TableCell className="font-medium">{sujet.titre}</TableCell>
                                <TableCell>{sujet.professeur.nom} {sujet.professeur.prenom}</TableCell>
                                <TableCell>{sujet.coDirecteur?.nom} {sujet.coDirecteur?.prenom}</TableCell>
                                <TableCell>{sujet.formationDoctorale.titre}</TableCell>
                                <TableCell>{getPublicationBadge(sujet.publier)}</TableCell>
                                <TableCell
  className="relative z-50 pointer-events-auto"
  onClick={(e) => e.stopPropagation()}
>
  <div className="flex gap-2">
    {/* <Button
      variant="default"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        handleEditClick(sujet);
      }}
      className="pointer-events-auto z-50"
    >
      <Edit className="w-4 h-4 mr-1" />
      Edit
    </Button> */}

    <Button
      variant="destructive"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteClick(sujet.id);
      }}
      className="pointer-events-auto z-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Delete
    </Button>
  </div>
</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </DataTable>
            </motion.div>
            
            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce sujet ? Cette action est irréversible.</p>
                        <div className="flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button 
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubjectsTab;