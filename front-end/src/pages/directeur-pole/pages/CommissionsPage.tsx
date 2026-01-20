import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CommissionsTab } from '../components';
import { Commission } from '@/models/Commission';
import directeurPoleService from '@/api/directeurPoleService';

const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const result = await directeurPoleService.getAllCommissions();
      if (result.results) {
        setCommissions(result.results as Commission[]);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des commissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCommissions = commissions.filter(commission =>
    commission.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.labo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par lieu ou laboratoire..."
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
            <CommissionsTab commissions={filteredCommissions} />
          </div>
        )}

        {/* Statistics */}
        <div className="bg-purple-50 p-4 rounded-lg text-center mt-6">
          <div className="text-2xl font-bold text-purple-600">{commissions.length}</div>
          <div className="text-sm text-muted-foreground">Commissions</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionsPage;
