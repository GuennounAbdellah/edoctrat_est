import React, { useState, useEffect } from 'react';
import { Users, Search, BookOpen, Mail, Phone, MapPin, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProfesseurService } from '@/api/professeurService';
import { Postuler } from '@/models/Postuler';

const MesCandidatsPage: React.FC = () => {
  const [candidats, setCandidats] = useState<Postuler[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCandidat, setSelectedCandidat] = useState<Postuler | null>(null);

  useEffect(() => {
    fetchCandidats();
  }, []);

  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const response = await ProfesseurService.getCandidats(50, 0);
      setCandidats(response.results || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching candidats:', error);
      setCandidats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidats = candidats.filter(postuler =>
    postuler.candidat?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postuler.candidat?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postuler.sujet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postuler.candidat?.cne?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postuler.candidat?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group candidats by sujet
  const candidatsBySujet = filteredCandidats.reduce((acc, postuler) => {
    const sujetTitre = postuler.sujet?.titre || 'Sans sujet';
    if (!acc[sujetTitre]) {
      acc[sujetTitre] = [];
    }
    acc[sujetTitre].push(postuler);
    return acc;
  }, {} as Record<string, Postuler[]>);

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
            <Users className="w-5 h-5" />
            Mes Candidats
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {totalCount} candidat(s) au total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, CNE, email ou sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredCandidats.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun candidat trouvé</p>
            <p className="text-sm mt-1">Les candidats qui postulent à vos sujets apparaîtront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CNE</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Sujet postulé</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidats.map((postuler) => (
                  <TableRow key={postuler.id}>
                    <TableCell className="font-mono">
                      {postuler.candidat?.cne || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {postuler.candidat 
                            ? `${postuler.candidat.prenom || ''} ${postuler.candidat.nom || ''}`.trim() || '-'
                            : '-'}
                        </span>
                        {postuler.candidat?.ville && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {postuler.candidat.ville}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {postuler.candidat?.email ? (
                        <a 
                          href={`mailto:${postuler.candidat.email}`} 
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{postuler.candidat.email}</span>
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {postuler.candidat?.telCandidat ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {postuler.candidat.telCandidat}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{postuler.sujet?.titre || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCandidat(postuler)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du candidat</DialogTitle>
                            <DialogDescription>
                              Informations complètes sur le candidat
                            </DialogDescription>
                          </DialogHeader>
                          {postuler.candidat && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                                  <p className="text-lg font-semibold">
                                    {postuler.candidat.prenom} {postuler.candidat.nom}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">CNE</label>
                                  <p className="font-mono">{postuler.candidat.cne || '-'}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">CIN</label>
                                  <p>{postuler.candidat.cin || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Date de naissance</label>
                                  <p>{postuler.candidat.dateDeNaissance || '-'}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                                  <p className="text-primary">{postuler.candidat.email || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                                  <p>{postuler.candidat.telCandidat || '-'}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ville</label>
                                  <p>{postuler.candidat.ville || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Pays</label>
                                  <p>{postuler.candidat.pays || '-'}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                                <p>{postuler.candidat.adresse || '-'}</p>
                              </div>
                              <div className="border-t pt-4">
                                <label className="text-sm font-medium text-muted-foreground">Sujet postulé</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  <p className="font-medium">{postuler.sujet?.titre || '-'}</p>
                                </div>
                                {postuler.sujet?.description && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {postuler.sujet.description}
                                  </p>
                                )}
                              </div>
                              {postuler.pathFile && (
                                <div className="border-t pt-4">
                                  <label className="text-sm font-medium text-muted-foreground">Document joint</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <a 
                                      href={postuler.pathFile} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      Voir le document
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Statistics Summary */}
        {candidats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {candidats.length}
              </p>
              <p className="text-sm text-muted-foreground">Total candidats</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {Object.keys(candidatsBySujet).length}
              </p>
              <p className="text-sm text-muted-foreground">Sujets concernés</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {candidats.filter(c => c.pathFile).length}
              </p>
              <p className="text-sm text-muted-foreground">Avec documents</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MesCandidatsPage;
