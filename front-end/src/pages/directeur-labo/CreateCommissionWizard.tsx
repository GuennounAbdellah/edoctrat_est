import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Users, BookOpen, GraduationCap, Check } from 'lucide-react';
import { Professeur } from '@/models/Professeur';
import { SujetResponse } from '@/models/SujetResponse';
import { DirecteurLaboService } from '@/api/directeurLaboService';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
    cne: string;
    nom: string;
    prenom: string;
    email: string;
    sujetId: number;
    sujetTitre: string;
}

interface CreateCommissionWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    laboratoireId?: number;
}

const CreateCommissionWizard: React.FC<CreateCommissionWizardProps> = ({
    isOpen,
    onClose,
    onSuccess,
    laboratoireId
}) => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Basic info
    const [formData, setFormData] = useState({
        dateCommission: '',
        heure: '',
        lieu: ''
    });

    // Step 2: Professors
    const [allProfesseurs, setAllProfesseurs] = useState<Professeur[]>([]);
    const [selectedProfesseurs, setSelectedProfesseurs] = useState<number[]>([]);

    // Step 3: Subjects (filtered by selected professors)
    const [allSujets, setAllSujets] = useState<SujetResponse[]>([]);
    const [filteredSujets, setFilteredSujets] = useState<SujetResponse[]>([]);
    const [selectedSujets, setSelectedSujets] = useState<number[]>([]);

    // Step 4: Candidates (from selected subjects)
    const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([]);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]); // CNE list

    // Fetch professors and subjects on mount
    useEffect(() => {
        if (isOpen) {
            fetchProfesseurs();
            fetchSujets();
        }
    }, [isOpen]);

    // Filter subjects when professors are selected
    useEffect(() => {
        if (selectedProfesseurs.length > 0) {
            const filtered = allSujets.filter(sujet => 
                selectedProfesseurs.includes(sujet.professeur?.id) ||
                (sujet.coDirecteur && selectedProfesseurs.includes(sujet.coDirecteur.id))
            );
            setFilteredSujets(filtered);
        } else {
            setFilteredSujets([]);
        }
        // Reset subject selection when professors change
        setSelectedSujets([]);
    }, [selectedProfesseurs, allSujets]);

    const fetchCandidatesForSujets = useCallback(async () => {
        setLoading(true);
        try {
            const allCandidates: Candidate[] = [];
            for (const sujetId of selectedSujets) {
                try {
                    const response = await DirecteurLaboService.getSujetCandidats(sujetId);
                    const sujet = allSujets.find(s => s.id === sujetId);
                    if (response.results) {
                        response.results.forEach(examiner => {
                            if (examiner.candidat && !allCandidates.find(c => c.cne === examiner.cne)) {
                                allCandidates.push({
                                    cne: examiner.cne || examiner.candidat.cne,
                                    nom: examiner.candidat.nom,
                                    prenom: examiner.candidat.prenom,
                                    email: examiner.candidat.email || '',
                                    sujetId: sujetId,
                                    sujetTitre: sujet?.titre || ''
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error(`Error fetching candidates for sujet ${sujetId}:`, e);
                }
            }
            setAvailableCandidates(allCandidates);
        } finally {
            setLoading(false);
        }
    }, [selectedSujets, allSujets]);

    // Fetch candidates when subjects are selected
    useEffect(() => {
        if (selectedSujets.length > 0) {
            fetchCandidatesForSujets();
        } else {
            setAvailableCandidates([]);
        }
        setSelectedCandidates([]);
    }, [selectedSujets, fetchCandidatesForSujets]);

    const fetchProfesseurs = async () => {
        try {
            const response = await DirecteurLaboService.getProfesseurs();
            setAllProfesseurs(response || []);
        } catch (error) {
            console.error('Error fetching professeurs:', error);
            setAllProfesseurs([]);
        }
    };

    const fetchSujets = async () => {
        try {
            const response = await DirecteurLaboService.getAllSujets();
            setAllSujets(response.results || []);
        } catch (error) {
            console.error('Error fetching sujets:', error);
            setAllSujets([]);
        }
    };

    const handleProfesseurToggle = (professeurId: number) => {
        setSelectedProfesseurs(prev => 
            prev.includes(professeurId)
                ? prev.filter(id => id !== professeurId)
                : [...prev, professeurId]
        );
    };

    const handleSujetToggle = (sujetId: number) => {
        setSelectedSujets(prev => 
            prev.includes(sujetId)
                ? prev.filter(id => id !== sujetId)
                : [...prev, sujetId]
        );
    };

    const handleCandidateToggle = (cne: string) => {
        setSelectedCandidates(prev => 
            prev.includes(cne)
                ? prev.filter(c => c !== cne)
                : [...prev, cne]
        );
    };

    const canProceedToNextStep = (): boolean => {
        switch (currentStep) {
            case 1:
                return formData.dateCommission !== '' && formData.heure !== '' && formData.lieu !== '';
            case 2:
                return selectedProfesseurs.length > 0;
            case 3:
                return selectedSujets.length > 0;
            case 4:
                return selectedCandidates.length > 0;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Check if laboratory ID is available
            if (!laboratoireId) {
                toast({
                    title: "Erreur",
                    description: "ID du laboratoire non disponible. Veuillez vous reconnecter.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            const commissionData = {
                dateCommission: formData.dateCommission,
                heure: formData.heure,
                lieu: formData.lieu,
                labo: laboratoireId,
                participantIds: selectedProfesseurs,
                sujetIds: selectedSujets,
                candidatCnes: selectedCandidates
            };

            await DirecteurLaboService.createCommissionWithDetails(commissionData);
            
            toast({
                title: "Succès",
                description: "La commission a été créée avec succès",
            });
            
            resetForm();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating commission:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la création de la commission",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setFormData({ dateCommission: '', heure: '', lieu: '' });
        setSelectedProfesseurs([]);
        setSelectedSujets([]);
        setSelectedCandidates([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const steps = [
        { number: 1, title: 'Informations', icon: Calendar },
        { number: 2, title: 'Professeurs', icon: Users },
        { number: 3, title: 'Sujets', icon: BookOpen },
        { number: 4, title: 'Candidats', icon: GraduationCap }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Créer une nouvelle commission</DialogTitle>
                </DialogHeader>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-8 px-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                    currentStep >= step.number 
                                        ? 'bg-primary text-primary-foreground border-primary' 
                                        : 'bg-muted text-muted-foreground border-muted'
                                }`}>
                                    {currentStep > step.number ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-6 h-6" />
                                    )}
                                </div>
                                <span className={`text-sm mt-2 font-medium ${
                                    currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                                }`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${
                                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                                }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[300px]"
                >
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Informations de la commission</h3>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dateCommission" className="text-right font-medium">Date</Label>
                                    <Input 
                                        id="dateCommission" 
                                        type="date"
                                        value={formData.dateCommission}
                                        onChange={(e) => setFormData({...formData, dateCommission: e.target.value})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="heure" className="text-right font-medium">Heure</Label>
                                    <Input 
                                        id="heure" 
                                        type="time"
                                        value={formData.heure}
                                        onChange={(e) => setFormData({...formData, heure: e.target.value})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lieu" className="text-right font-medium">Lieu</Label>
                                    <Input 
                                        id="lieu" 
                                        value={formData.lieu}
                                        onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                                        className="col-span-3" 
                                        placeholder="Salle de réunion, Amphithéâtre..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Professors */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Sélectionner les professeurs participants</h3>
                                <Badge variant="secondary">
                                    {selectedProfesseurs.length} sélectionné(s)
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                                {allProfesseurs.map((professeur) => (
                                    <Card 
                                        key={professeur.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                            selectedProfesseurs.includes(professeur.id) 
                                                ? 'ring-2 ring-primary bg-primary/5' 
                                                : ''
                                        }`}
                                        onClick={() => handleProfesseurToggle(professeur.id)}
                                    >
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <Checkbox 
                                                checked={selectedProfesseurs.includes(professeur.id)}
                                                onChange={() => {}}
                                            />
                                            <div>
                                                <p className="font-medium">{professeur.prenom} {professeur.nom}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {allProfesseurs.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucun professeur disponible
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Select Subjects */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Sélectionner les sujets</h3>
                                <Badge variant="secondary">
                                    {selectedSujets.length} sélectionné(s)
                                </Badge>
                            </div>
                            {filteredSujets.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                                    {filteredSujets.map((sujet) => (
                                        <Card 
                                            key={sujet.id}
                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                selectedSujets.includes(sujet.id) 
                                                    ? 'ring-2 ring-primary bg-primary/5' 
                                                    : ''
                                            }`}
                                            onClick={() => handleSujetToggle(sujet.id)}
                                        >
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <Checkbox 
                                                    checked={selectedSujets.includes(sujet.id)}
                                                    onChange={() => {}}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{sujet.titre}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Directeur: {sujet.professeur?.prenom} {sujet.professeur?.nom}
                                                        {sujet.coDirecteur && ` | Co-directeur: ${sujet.coDirecteur.prenom} ${sujet.coDirecteur.nom}`}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucun sujet trouvé pour les professeurs sélectionnés
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 4: Select Candidates */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Sélectionner les candidats</h3>
                                <Badge variant="secondary">
                                    {selectedCandidates.length} sélectionné(s)
                                </Badge>
                            </div>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : availableCandidates.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                                    {availableCandidates.map((candidate) => (
                                        <Card 
                                            key={candidate.cne}
                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                selectedCandidates.includes(candidate.cne) 
                                                    ? 'ring-2 ring-primary bg-primary/5' 
                                                    : ''
                                            }`}
                                            onClick={() => handleCandidateToggle(candidate.cne)}
                                        >
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <Checkbox 
                                                    checked={selectedCandidates.includes(candidate.cne)}
                                                    onChange={() => {}}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{candidate.prenom} {candidate.nom}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        CNE: {candidate.cne} | Sujet: {candidate.sujetTitre}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Aucun candidat trouvé pour les sujets sélectionnés
                                </p>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={currentStep === 1 ? handleClose : handleBack}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {currentStep === 1 ? 'Annuler' : 'Retour'}
                    </Button>
                    
                    {currentStep < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceedToNextStep()}
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canProceedToNextStep() || loading}
                        >
                            {loading ? 'Création...' : 'Créer la commission'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCommissionWizard;
