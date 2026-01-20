import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { CandidatsTab, ResultDTO } from '../components';
import { ExaminerResponse } from '@/models/ExaminerResponse';
import apiClient from '@/api/api';

const CandidatsPage: React.FC = () => {
  const [candidats, setCandidats] = useState<ExaminerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ResultDTO<ExaminerResponse>>('/api/get-ced-candidats/');
      setCandidats(response.data.results || []);
    } catch (error) {
      console.error('Error fetching candidats:', error);
      toast.error('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const filteredCandidats = candidats.filter(examiner =>
    examiner.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.candidat?.cne?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.cne?.toLowerCase().includes(searchTerm.toLowerCase())
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
      a.download = 'rapport-candidats.xlsx';
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom, CNE ou email..."
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
            <CandidatsTab candidats={filteredCandidats} />
          </div>
        )}

        {/* Statistics */}
        <div className="bg-blue-50 p-4 rounded-lg text-center mt-6">
          <div className="text-2xl font-bold text-blue-600">{candidats.length}</div>
          <div className="text-sm text-muted-foreground">Candidats</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatsPage;
