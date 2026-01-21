import React, { useState, useEffect } from 'react';
import { UserCheck, Search, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';
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
import { Inscription } from '@/models/Inscription';

const InscritsPage: React.FC = () => {
  const [inscrits, setInscrits] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchInscrits();
  }, []);

  const fetchInscrits = async () => {
    setLoading(true);
    try {
      const response = await ProfesseurService.getInscrits(50, 0);
      setInscrits(response.results || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching inscrits:', error);
      setInscrits([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInscrits = inscrits.filter(inscrit =>
    inscrit.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscrit.candidat?.cne?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getValidationBadge = (valider: boolean) => {
    return valider ? (
      <Badge className="bg-green-500 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Validé
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        En attente
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Candidats Inscrits
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {totalCount} inscrit(s) au total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, CNE ou sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredInscrits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun inscrit trouvé</p>
            <p className="text-sm mt-1">Les candidats inscrits à vos sujets apparaîtront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CNE</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Date de dépôt</TableHead>
                  <TableHead>Remarque</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInscrits.map((inscrit) => (
                  <TableRow key={inscrit.id}>
                    <TableCell className="font-mono">
                      {inscrit.candidat?.cne || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {inscrit.candidat 
                            ? `${inscrit.candidat.prenom || ''} ${inscrit.candidat.nom || ''}`.trim() || '-'
                            : '-'}
                        </span>
                        {inscrit.candidat?.email && (
                          <span className="text-xs text-muted-foreground">
                            {inscrit.candidat.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{inscrit.sujet?.titre || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(inscrit.dateDiposeDossier)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {inscrit.remarque || '-'}
                    </TableCell>
                    <TableCell>{getValidationBadge(inscrit.valider)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Statistics Summary */}
        {inscrits.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {inscrits.length}
              </p>
              <p className="text-sm text-muted-foreground">Total inscrits</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {inscrits.filter(i => i.valider).length}
              </p>
              <p className="text-sm text-muted-foreground">Validés</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {inscrits.filter(i => !i.valider).length}
              </p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InscritsPage;
