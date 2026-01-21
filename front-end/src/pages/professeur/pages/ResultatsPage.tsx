import React, { useState, useEffect } from 'react';
import { FileText, Search, User, BookOpen } from 'lucide-react';
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
import { ExaminerResponse } from '@/models/ExaminerResponse';

const ResultatsPage: React.FC = () => {
  const [resultats, setResultats] = useState<ExaminerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchResultats();
  }, []);

  const fetchResultats = async () => {
    setLoading(true);
    try {
      const response = await ProfesseurService.getResultats(50, 0);
      setResultats(response.results || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching resultats:', error);
      setResultats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResultats = resultats.filter(result =>
    result.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.cne?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDecisionBadge = (decision: string) => {
    if (!decision) return <Badge variant="secondary">En attente</Badge>;
    
    switch (decision.toLowerCase()) {
      case 'admis':
      case 'accepté':
        return <Badge className="bg-green-500">Admis</Badge>;
      case 'ajourné':
      case 'en attente':
        return <Badge className="bg-yellow-500">Ajourné</Badge>;
      case 'refusé':
      case 'rejeté':
        return <Badge className="bg-red-500">Refusé</Badge>;
      default:
        return <Badge variant="secondary">{decision}</Badge>;
    }
  };

  const getPublicationBadge = (publier: boolean) => {
    return publier ? (
      <Badge className="bg-blue-500">Publié</Badge>
    ) : (
      <Badge variant="outline">Non publié</Badge>
    );
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
            <FileText className="w-5 h-5" />
            Résultats des Examens
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {totalCount} résultat(s) au total
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

        {filteredResultats.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun résultat trouvé</p>
            <p className="text-sm mt-1">Les résultats des examens apparaîtront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CNE</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Note Dossier</TableHead>
                  <TableHead>Note Entretien</TableHead>
                  <TableHead>Décision</TableHead>
                  <TableHead>Publication</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResultats.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-mono">{result.cne || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {result.candidat 
                            ? `${result.candidat.prenom || ''} ${result.candidat.nom || ''}`.trim() || '-'
                            : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{result.sujet?.titre || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        result.noteDossier >= 14 ? 'text-green-600' :
                        result.noteDossier >= 10 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {result.noteDossier != null ? `${result.noteDossier}/20` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        result.noteEntretien >= 14 ? 'text-green-600' :
                        result.noteEntretien >= 10 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {result.noteEntretien != null ? `${result.noteEntretien}/20` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>{getDecisionBadge(result.decision)}</TableCell>
                    <TableCell>{getPublicationBadge(result.publier)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Statistics Summary */}
        {resultats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {resultats.filter(r => r.decision?.toLowerCase() === 'admis').length}
              </p>
              <p className="text-sm text-muted-foreground">Admis</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {resultats.filter(r => r.decision?.toLowerCase() === 'ajourné').length}
              </p>
              <p className="text-sm text-muted-foreground">Ajournés</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {resultats.filter(r => r.decision?.toLowerCase() === 'refusé').length}
              </p>
              <p className="text-sm text-muted-foreground">Refusés</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {resultats.filter(r => r.publier).length}
              </p>
              <p className="text-sm text-muted-foreground">Publiés</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultatsPage;
