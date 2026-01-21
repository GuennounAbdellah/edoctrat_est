import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getCandidatNotifications, getCandidatPostulations, NotificationResponse, PostulationResponse } from '@/api/candidatService';

interface Commission {
  dateCommission: string;
  heure: string;
  lieu: string;
}

interface Notification {
  id: number;
  sujet: {
    titre: string;
  };
  commission: Commission;
}

interface Resultat {
  id: number;
  sujet: {
    titre: string;
  };
  selected: boolean;
  status: 'accepted' | 'pending' | 'rejected';
}

interface ApiError extends Error {
  friendlyMessage?: string;
}

const NotificationsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch notifications from API
        const notificationsResponse = await getCandidatNotifications();
        const notifData = notificationsResponse.results || [];
        
        // Map API response to component format
        const mappedNotifications: Notification[] = notifData.map((n: NotificationResponse) => ({
          id: n.id,
          sujet: {
            titre: n.sujet?.titre || n.sujetTitre || ''
          },
          commission: {
            dateCommission: n.dateCommission || n.commission?.dateCommission || '',
            heure: n.heure || n.commission?.heure || '',
            lieu: n.lieu || n.commission?.lieu || ''
          }
        }));
        setNotifications(mappedNotifications);

        // Fetch postulations to get results
        try {
          const postulationsResponse = await getCandidatPostulations();
          const postulations = postulationsResponse.results || [];
          
          // Map postulations to results format
          const mappedResults: Resultat[] = postulations.map((p: PostulationResponse) => {
            let status: 'accepted' | 'pending' | 'rejected' = 'pending';
            if (p.etat === 'accepted' || p.accepted) status = 'accepted';
            else if (p.etat === 'rejected' || p.rejected) status = 'rejected';
            
            return {
              id: p.id,
              sujet: {
                titre: p.sujet?.titre || p.sujetTitre || ''
              },
              selected: p.selected || false,
              status
            };
          });
          setResultats(mappedResults);
        } catch (postErr) {
          console.error('Error fetching postulations for results:', postErr);
        }

      } catch (err: unknown) {
        console.error('Error fetching notifications:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de charger les notifications.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChooseSubject = (resultat: Resultat) => {
    // In production, this would call an API
    setResultats(prev => prev.map(r => ({
      ...r,
      selected: r.id === resultat.id
    })));
  };

  const dossierLinks = [
    { label: "Pièces à fournir", url: "#", icon: FileText },
    { label: "Déclaration sur l'honneur à légaliser", url: "#", icon: Download },
    { label: "Reçu / وصل", url: "#", icon: Download },
    { label: "Demande de bourse / طلب منحة", url: "#", icon: Download },
    { label: "Charte de thèse / ميثاق الاطروحة", url: "#", icon: Download },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500">Vos convocations et résultats de candidature</p>
        </div>
      </div>

      {/* Convocations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Convocations aux commissions
          </CardTitle>
          <CardDescription>
            Présentez-vous aux dates et lieux indiqués avec votre dossier complet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune convocation pour le moment</p>
              <p className="text-sm text-gray-400">
                Vous serez notifié lorsque vous aurez une convocation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Important:</strong> Présentez-vous avec votre CIN et tous les documents requis.
                </AlertDescription>
              </Alert>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2">Commission</Badge>
                        <h4 className="font-medium text-gray-900">
                          {notification.sujet.titre}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(notification.commission.dateCommission).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{notification.commission.heure}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{notification.commission.lieu}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Résultats
          </CardTitle>
          <CardDescription>
            Veuillez confirmer votre choix de sujet parmi les propositions acceptées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resultats.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun résultat disponible</p>
              <p className="text-sm text-gray-400">
                Les résultats seront publiés après les commissions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resultats.map((resultat) => (
                <div
                  key={resultat.id}
                  className={`p-4 border rounded-lg transition-all ${
                    resultat.selected
                      ? 'border-green-300 bg-green-50'
                      : resultat.status === 'accepted'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {resultat.sujet.titre}
                        </h4>
                        {resultat.status === 'accepted' && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepté
                          </Badge>
                        )}
                        {resultat.status === 'pending' && (
                          <Badge variant="outline" className="border-orange-300 text-orange-700">
                            En attente
                          </Badge>
                        )}
                        {resultat.status === 'rejected' && (
                          <Badge variant="destructive">
                            Non retenu
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {resultat.status === 'accepted' && !resultat.selected && (
                        <Button
                          size="sm"
                          onClick={() => handleChooseSubject(resultat)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmer ce sujet
                        </Button>
                      )}
                      
                      {resultat.selected && (
                        <>
                          <Link to="/candidat-dashboard/demande-inscription">
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              Imprimer demande d'inscription
                            </Button>
                          </Link>
                          
                          <Dialog open={showDossierModal} onOpenChange={setShowDossierModal}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Constitution du dossier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Constitution du dossier</DialogTitle>
                                <DialogDescription>
                                  Téléchargez les documents nécessaires pour votre inscription
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2 mt-4">
                                {dossierLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                                  >
                                    <link.icon className="w-5 h-5 text-primary" />
                                    <span className="flex-1 text-sm">{link.label}</span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                  </a>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
