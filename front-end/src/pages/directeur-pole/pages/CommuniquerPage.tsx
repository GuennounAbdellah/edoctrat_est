import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CommuniquerTab } from '../components';
import directeurPoleService from '@/api/directeurPoleService';

const CommuniquerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePublierSujets = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierSujets();
      toast({
        title: "Succès",
        description: response.message || "Les sujets ont été publiés avec succès",
      });
    } catch (error) {
      console.error('Error publishing sujets:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication des sujets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublierListePrincipale = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierListePrincipale();
      toast({
        title: "Succès",
        description: response.message || "La liste principale a été publiée avec succès",
      });
    } catch (error) {
      console.error('Error publishing liste principale:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication de la liste principale",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublierListeAttente = async () => {
    setLoading(true);
    try {
      const response = await directeurPoleService.publierListeAttente();
      toast({
        title: "Succès",
        description: response.message || "La liste d'attente a été publiée avec succès",
      });
    } catch (error) {
      console.error('Error publishing liste attente:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la publication de la liste d'attente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <CommuniquerTab
          onPublierSujets={handlePublierSujets}
          onPublierListePrincipale={handlePublierListePrincipale}
          onPublierListeAttente={handlePublierListeAttente}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default CommuniquerPage;
