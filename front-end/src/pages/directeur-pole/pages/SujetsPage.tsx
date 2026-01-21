import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { SujetsTab } from '../components';
import { Sujet } from '@/models/Sujet';
import directeurPoleService from '@/api/directeurPoleService';

const SujetsPage: React.FC = () => {
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [loading, setLoading] = useState(false);
  const [sujetFilter, setSujetFilter] = useState('');
  const [laboFilter, setLaboFilter] = useState('');
  const [formationFilter, setFormationFilter] = useState('');
  const { toast } = useToast();

  const fetchSujets = async () => {
    setLoading(true);
    try {
      const result = await directeurPoleService.getAllSujets();
      if (result.results) {
        setSujets(result.results as Sujet[]);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching sujets:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des sujets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSujets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSujets = sujets.filter(sujet => {
    const matchesSujet = sujet.titre.toLowerCase().includes(sujetFilter.toLowerCase());
    const matchesFormation = sujet.formationDoctorale.titre.toLowerCase().includes(formationFilter.toLowerCase());
    return matchesSujet && matchesFormation;
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Filtrer par sujet..."
            value={sujetFilter}
            onChange={(e) => setSujetFilter(e.target.value)}
          />
          <Input
            placeholder="Filtrer par laboratoire..."
            value={laboFilter}
            onChange={(e) => setLaboFilter(e.target.value)}
          />
          <Input
            placeholder="Filtrer par formation doctorale..."
            value={formationFilter}
            onChange={(e) => setFormationFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <SujetsTab sujets={filteredSujets} />
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{sujets.length}</div>
            <div className="text-sm text-muted-foreground">Sujets proposés</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sujets.filter(s => s.publier).length}
            </div>
            <div className="text-sm text-muted-foreground">Sujets publiés</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SujetsPage;
