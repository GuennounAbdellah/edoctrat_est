import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  ShoppingCart,
  Loader2,
  AlertCircle,
  User,
  Building2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { 
  getPublishedSubjects, 
  getCandidatPostulations, 
  createPostulation, 
  deletePostulation,
  getBaseConfig,
  SujetResponse,
  PostulationResponse
} from '@/api/candidatService';

interface Sujet {
  id: number;
  titre: string;
  professeur: {
    nom: string;
    prenom: string;
  };
  formationDoctorale: {
    titre: string;
    ced: {
      titre: string;
    };
  };
  laboratoire: string;
}

interface SelectedSujet extends Sujet {
  postulerId?: number;
}

interface ApiError extends Error {
  friendlyMessage?: string;
}

const PostulerPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [selectedSujets, setSelectedSujets] = useState<SelectedSujet[]>([]);
  const [searchLabo, setSearchLabo] = useState('');
  const [searchSujet, setSearchSujet] = useState('');
  const [searchFormation, setSearchFormation] = useState('');
  const [maxSujets, setMaxSujets] = useState(3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch configuration for max subjects
        try {
          const config = await getBaseConfig();
          setMaxSujets(config.maxSujetPostuler || 3);
        } catch (configErr) {
          console.error('Error fetching config:', configErr);
        }

        // Fetch published subjects
        const sujetsResponse = await getPublishedSubjects(100, 0);
        const publishedSujets = sujetsResponse.results || [];
        
        // Map API response to component format
        const mappedSujets: Sujet[] = publishedSujets.map((s: SujetResponse) => ({
          id: s.id,
          titre: s.titre || s.intitule || '',
          professeur: {
            nom: s.professeurNom || s.professeur?.nom || '',
            prenom: s.professeurPrenom || s.professeur?.prenom || ''
          },
          formationDoctorale: {
            titre: s.formationDoctoraleTitre || s.formationDoctorale?.titre || '',
            ced: {
              titre: s.cedTitre || s.formationDoctorale?.ced?.titre || ''
            }
          },
          laboratoire: s.laboratoireTitre || s.laboratoire || ''
        }));
        setSujets(mappedSujets);

        // Fetch candidate's existing postulations
        try {
          const postulationsResponse = await getCandidatPostulations();
          const postulations = postulationsResponse.results || [];
          
          // Map postulations to selected sujets
          const selectedFromApi: SelectedSujet[] = postulations.map((p: PostulationResponse) => ({
            id: p.sujet?.id || p.sujetId || 0,
            postulerId: p.id,
            titre: p.sujet?.titre || p.sujetTitre || '',
            professeur: {
              nom: p.sujet?.professeur?.nom || p.professeurNom || '',
              prenom: p.sujet?.professeur?.prenom || p.professeurPrenom || ''
            },
            formationDoctorale: {
              titre: p.sujet?.formationDoctorale?.titre || '',
              ced: { titre: p.sujet?.formationDoctorale?.ced?.titre || '' }
            },
            laboratoire: p.sujet?.laboratoire || ''
          }));
          setSelectedSujets(selectedFromApi);
        } catch (postErr) {
          console.error('Error fetching postulations:', postErr);
        }

      } catch (err: unknown) {
        console.error('Error fetching sujets:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de charger les sujets disponibles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectSujet = async (sujet: Sujet, checked: boolean) => {
    if (checked) {
      if (selectedSujets.length < maxSujets) {
        try {
          // Create postulation via API
          const response = await createPostulation(sujet.id);
          setSelectedSujets(prev => [...prev, { ...sujet, postulerId: response.id }]);
        } catch (err: unknown) {
          console.error('Error creating postulation:', err);
          const apiError = err as ApiError;
          setError(apiError.friendlyMessage || 'Impossible de postuler à ce sujet.');
        }
      }
    } else {
      const selected = selectedSujets.find(s => s.id === sujet.id);
      if (selected?.postulerId) {
        try {
          await deletePostulation(selected.postulerId);
          setSelectedSujets(prev => prev.filter(s => s.id !== sujet.id));
        } catch (err: unknown) {
          console.error('Error deleting postulation:', err);
          const apiError = err as ApiError;
          setError(apiError.friendlyMessage || 'Impossible de supprimer cette candidature.');
        }
      } else {
        setSelectedSujets(prev => prev.filter(s => s.id !== sujet.id));
      }
    }
  };

  const filteredSujets = sujets.filter(s => {
    const matchLabo = s.laboratoire.toLowerCase().includes(searchLabo.toLowerCase());
    const matchSujet = s.titre.toLowerCase().includes(searchSujet.toLowerCase());
    const matchFormation = s.formationDoctorale.titre.toLowerCase().includes(searchFormation.toLowerCase());
    return matchLabo && matchSujet && matchFormation;
  });

  const isSelected = (id: number) => selectedSujets.some(s => s.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des sujets disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Postuler aux sujets</h2>
            <p className="text-gray-500">Choisissez jusqu'à {maxSujets} sujets de thèse</p>
          </div>
        </div>
        
        <Link to="/candidat-dashboard/sujets-choisis">
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Mes choix</span>
            <Badge variant="secondary">{selectedSujets.length}</Badge>
          </Button>
        </Link>
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 space-y-1">
              <p className="font-medium">Instructions pour postuler:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vous pouvez choisir jusqu'à {maxSujets} sujets maximum</li>
                <li>Importez votre projet de thèse pour chaque sujet choisi</li>
                <li>Consultez régulièrement vos notifications pour les résultats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par laboratoire..."
                value={searchLabo}
                onChange={(e) => setSearchLabo(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par sujet..."
                value={searchSujet}
                onChange={(e) => setSearchSujet(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par formation..."
                value={searchFormation}
                onChange={(e) => setSearchFormation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sujets disponibles</CardTitle>
          <CardDescription>
            {filteredSujets.length} sujet(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Choisir</TableHead>
                  <TableHead>Laboratoire</TableHead>
                  <TableHead>Professeur</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>CED</TableHead>
                  <TableHead>Formation Doctorale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSujets.map((sujet) => {
                  const selected = isSelected(sujet.id);
                  const disabled = selectedSujets.length >= maxSujets && !selected;
                  
                  return (
                    <TableRow
                      key={sujet.id}
                      className={cn(
                        selected && "bg-primary/5",
                        disabled && "opacity-50"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected}
                          disabled={disabled}
                          onCheckedChange={(checked) => handleSelectSujet(sujet, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{sujet.laboratoire}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {sujet.professeur.prenom} {sujet.professeur.nom}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{sujet.titre}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {sujet.formationDoctorale.ced.titre}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{sujet.formationDoctorale.titre}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredSujets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun sujet trouvé</p>
              <p className="text-sm text-gray-400">Modifiez vos critères de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostulerPage;
