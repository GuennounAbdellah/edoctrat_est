import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CalendrierTab } from '../components';
import directeurPoleService, { DirecteurPoleCalendrier } from '@/api/directeurPoleService';

const CalendrierPage: React.FC = () => {
  const [calendrier, setCalendrier] = useState<DirecteurPoleCalendrier[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCalendrier = async () => {
    setLoading(true);
    try {
      const data = await directeurPoleService.getCalendrier();
      setCalendrier(data);
    } catch (error) {
      console.error('Error fetching calendrier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du calendrier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendrier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmerCalendrier = async (id: number, dateDebut: string, dateFin: string) => {
    setLoading(true);
    try {
      setCalendrier(prev => prev.map(item =>
        item.id === id ? { ...item, dateDebut, dateFin } : item
      ));
      toast({
        title: "Succès",
        description: "Les dates ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating calendrier:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des dates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <CalendrierTab
            calendrier={calendrier}
            onConfirm={handleConfirmerCalendrier}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CalendrierPage;
