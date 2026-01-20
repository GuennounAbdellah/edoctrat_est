import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { SujetsTab, ResultDTO } from '../components';
import { Sujet } from '@/models/Sujet';
import apiClient from '@/api/api';

const SujetsPage: React.FC = () => {
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSujets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ResultDTO<Sujet>>('/api/get-ced-sujets/');
      setSujets(response.data.results || []);
    } catch (error) {
      console.error('Error fetching sujets:', error);
      toast.error('Erreur lors du chargement des sujets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSujets();
  }, []);

  const filteredSujets = sujets.filter(sujet =>
    sujet.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sujet.professeur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, description ou professeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
        <div className="bg-green-50 p-4 rounded-lg text-center mt-6">
          <div className="text-2xl font-bold text-green-600">{sujets.length}</div>
          <div className="text-sm text-muted-foreground">Sujets</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SujetsPage;
