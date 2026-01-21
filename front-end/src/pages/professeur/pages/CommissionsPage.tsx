import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProfesseurService } from '@/api/professeurService';
import { Commission } from '@/models/Commission';

const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await ProfesseurService.getCommissions();
      setCommissions(response.results || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommissions = commissions.filter(commission =>
    commission.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.dateCommission?.includes(searchTerm)
  );

  const getStatusBadge = (valider: boolean) => {
    return valider ? (
      <Badge className="bg-green-500">Validée</Badge>
    ) : (
      <Badge variant="secondary">En attente</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Mes Commissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par lieu ou date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredCommissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune commission trouvée</p>
            <p className="text-sm mt-1">Vous n'êtes participant à aucune commission pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Sujets</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(commission.dateCommission)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {commission.heure}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {commission.lieu}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {commission.participants?.length || 0} participant(s)
                      </div>
                    </TableCell>
                    <TableCell>
                      {commission.sujets?.length || 0} sujet(s)
                    </TableCell>
                    <TableCell>{getStatusBadge(commission.valider)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Commission Cards for mobile view */}
        <div className="md:hidden space-y-4 mt-4">
          {filteredCommissions.map((commission) => (
            <Card key={commission.id} className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{formatDate(commission.dateCommission)}</p>
                    <p className="text-sm text-muted-foreground">{commission.heure}</p>
                  </div>
                  {getStatusBadge(commission.valider)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{commission.lieu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{commission.participants?.length || 0} participant(s)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionsPage;
