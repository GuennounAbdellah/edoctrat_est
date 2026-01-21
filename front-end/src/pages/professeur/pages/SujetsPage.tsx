import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProfesseurService } from '@/api/professeurService';
import { SujetResponse } from '@/models/SujetResponse';
import { FormationDoctorale } from '@/models/FormationDoctorale';
import { Professeur } from '@/models/Professeur';
import { useToast } from '@/hooks/use-toast';

const SujetsPage: React.FC = () => {
  const [sujets, setSujets] = useState<SujetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSujetDialogOpen, setIsSujetDialogOpen] = useState(false);
  const [formations, setFormations] = useState<FormationDoctorale[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const { toast } = useToast();

  const [sujetFormData, setSujetFormData] = useState({
    titre: '',
    description: '',
    formationDoctorale: '',
    coDirecteur: '',
  });

  useEffect(() => {
    fetchSujets();
    fetchFormations();
    fetchProfesseurs();
  }, []);

  const fetchSujets = async () => {
    setLoading(true);
    try {
      const response = await ProfesseurService.getSujets();
      setSujets(response.results || []);
    } catch (error) {
      console.error('Error fetching sujets:', error);
      setSujets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await ProfesseurService.getFormationsDoctorales();
      setFormations(response.results || []);
    } catch (error) {
      console.error('Error fetching formations:', error);
      setFormations([]);
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const response = await ProfesseurService.getProfesseurs();
      setProfesseurs(response.results || []);
    } catch (error) {
      console.error('Error fetching professeurs:', error);
      setProfesseurs([]);
    }
  };

  const handleCreateSujet = async () => {
    try {
      const newSujet = {
        titre: sujetFormData.titre,
        description: sujetFormData.description,
        formationDoctorale: sujetFormData.formationDoctorale ? parseInt(sujetFormData.formationDoctorale) : undefined,
        coDirecteur: sujetFormData.coDirecteur ? parseInt(sujetFormData.coDirecteur) : undefined,
      };

      await ProfesseurService.createSujet(newSujet);
      toast({
        title: "Succès",
        description: "Le sujet a été créé avec succès",
      });
      setSujetFormData({ titre: '', description: '', formationDoctorale: '', coDirecteur: '' });
      setIsSujetDialogOpen(false);
      await fetchSujets();
    } catch (error) {
      console.error('Error creating sujet:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du sujet",
        variant: "destructive",
      });
    }
  };

  const filteredSujets = sujets.filter(sujet =>
    sujet.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.motsCles?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (publier: boolean) => {
    return publier ? (
      <Badge className="bg-green-500">Publié</Badge>
    ) : (
      <Badge variant="secondary">Non publié</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mes Sujets de Recherche
          </CardTitle>
          <Button onClick={() => setIsSujetDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un sujet
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, description ou mots-clés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredSujets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun sujet trouvé</p>
            <p className="text-sm mt-1">Vous n'avez pas encore créé de sujet de recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Formation Doctorale</TableHead>
                  <TableHead>Date de Dépôt</TableHead>
                  <TableHead>Co-Directeur</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSujets.map((sujet) => (
                  <TableRow key={sujet.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sujet.titre}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {sujet.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sujet.formationDoctorale?.titre || 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(sujet.dateDepot)}</TableCell>
                    <TableCell>
                      {sujet.coDirecteur 
                        ? `${sujet.coDirecteur.prenom} ${sujet.coDirecteur.nom}`
                        : 'Aucun'}
                    </TableCell>
                    <TableCell>{getStatusBadge(sujet.publier)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Sujet Cards for mobile view */}
        <div className="md:hidden space-y-4 mt-4">
          {filteredSujets.map((sujet) => (
            <Card key={sujet.id} className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{sujet.titre}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {sujet.description}
                    </p>
                  </div>
                  {getStatusBadge(sujet.publier)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{sujet.formationDoctorale?.titre || 'N/A'}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Déposé le {formatDate(sujet.dateDepot)}
                  </p>
                  {sujet.coDirecteur && (
                    <p className="text-muted-foreground">
                      Co-directeur: {sujet.coDirecteur.prenom} {sujet.coDirecteur.nom}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Dialog pour ajouter un sujet */}
      <Dialog open={isSujetDialogOpen} onOpenChange={setIsSujetDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau sujet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titre" className="text-right">Titre</Label>
              <Input
                id="titre"
                value={sujetFormData.titre}
                onChange={(e) => setSujetFormData({ ...sujetFormData, titre: e.target.value })}
                className="col-span-3"
                placeholder="Titre du sujet de recherche"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={sujetFormData.description}
                onChange={(e) => setSujetFormData({ ...sujetFormData, description: e.target.value })}
                className="col-span-3"
                placeholder="Description du sujet de recherche"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formation" className="text-right">Formation Doctorale</Label>
              <Select
                value={sujetFormData.formationDoctorale}
                onValueChange={(value) => setSujetFormData({ ...sujetFormData, formationDoctorale: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={String(formation.id)}>
                      {formation.titre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coDirecteur" className="text-right">Co-directeur</Label>
              <Select
                value={sujetFormData.coDirecteur}
                onValueChange={(value) => setSujetFormData({ ...sujetFormData, coDirecteur: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un co-directeur (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {professeurs.map((professeur) => (
                    <SelectItem key={professeur.id} value={String(professeur.id)}>
                      {professeur.prenom} {professeur.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSujetDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateSujet} disabled={!sujetFormData.titre}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SujetsPage;
