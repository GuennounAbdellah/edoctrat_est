import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { InscritsTab, ResultDTO, Inscription } from '../components';
import apiClient from '@/api/api';

const InscritsPage: React.FC = () => {
  const [inscrits, setInscrits] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInscrits = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ResultDTO<Inscription>>('/api/get-ced-inscriptions/');
      setInscrits(response.data.results || []);
    } catch (error) {
      console.error('Error fetching inscrits:', error);
      toast.error('Erreur lors du chargement des inscrits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscrits();
  }, []);

  const filteredInscrits = inscrits.filter(inscrit =>
    inscrit.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadReport = async () => {
    try {
      const response = await apiClient.get('/api/download-registration-report', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rapport-inscriptions.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Rapport téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Erreur lors du téléchargement du rapport');
    }
  };

  // Statistics calculations
  const validatedCount = inscrits.filter(i => i.valider).length;
  const pendingCount = inscrits.filter(i => !i.valider).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par candidat ou sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={downloadReport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger le rapport
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <InscritsTab inscrits={filteredInscrits} />
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{inscrits.length}</div>
            <div className="text-sm text-muted-foreground">Total Inscrits</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{validatedCount}</div>
            <div className="text-sm text-muted-foreground">Validés</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InscritsPage;
