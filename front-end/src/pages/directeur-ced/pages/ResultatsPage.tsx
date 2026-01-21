import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ResultatsTab, ResultDTO } from '../components';
import { ExaminerResponse } from '@/models/ExaminerResponse';
import apiClient from '@/api/api';

const ResultatsPage: React.FC = () => {
  const [resultats, setResultats] = useState<ExaminerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResultats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ResultDTO<ExaminerResponse>>('/api/get-ced-resultats/');
      setResultats(response.data.results || []);
    } catch (error) {
      console.error('Error fetching resultats:', error);
      toast.error('Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultats();
  }, []);

  const filteredResultats = resultats.filter(resultat =>
    resultat.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultat.decision?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculations
  const acceptedCount = resultats.filter(r => 
    r.decision?.toLowerCase() === 'accepte' || 
    r.decision?.toLowerCase() === 'accepté' || 
    r.decision?.toLowerCase() === 'admis'
  ).length;
  
  const refusedCount = resultats.filter(r => 
    r.decision?.toLowerCase() === 'refuse' || 
    r.decision?.toLowerCase() === 'refusé'
  ).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par candidat, sujet ou décision..."
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
            <ResultatsTab resultats={filteredResultats} />
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{resultats.length}</div>
            <div className="text-sm text-muted-foreground">Total Résultats</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
            <div className="text-sm text-muted-foreground">Acceptés</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{refusedCount}</div>
            <div className="text-sm text-muted-foreground">Refusés</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultatsPage;
