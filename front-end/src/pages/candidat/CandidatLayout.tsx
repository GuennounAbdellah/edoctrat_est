import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  FileText,
  Bell,
  BookOpen,
  LogOut,
  ChevronRight,
  Mail,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { getCandidatInfo, getCandidatNotifications, getCandidatParcours } from '@/api/candidatService';

interface CandidatInfo {
  nom: string;
  prenom: string;
  email: string;
  pathPhoto?: string;
}

const CandidatLayout: React.FC = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [candidatInfo, setCandidatInfo] = useState<CandidatInfo | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCandidatData = async () => {
      setIsLoading(true);
      try {
        // Fetch candidat info from API
        const candidatData = await getCandidatInfo();
        setCandidatInfo({
          nom: candidatData.nom || 'Candidat',
          prenom: candidatData.prenom || '',
          email: candidatData.email || 'candidat@email.com',
          pathPhoto: candidatData.pathPhoto
        });

        // Update localStorage with latest user info
        localStorage.setItem('user', JSON.stringify({
          nom: candidatData.nom,
          prenom: candidatData.prenom,
          email: candidatData.email,
          pathPhoto: candidatData.pathPhoto
        }));

        // Fetch notifications count
        try {
          const notifications = await getCandidatNotifications();
          setNotificationCount(notifications.results?.length || 0);
        } catch (notifErr) {
          console.error('Error fetching notifications:', notifErr);
          setNotificationCount(0);
        }

        // Fetch parcours to calculate progress
        try {
          const parcours = await getCandidatParcours();
          const diplomesCount = parcours.results?.length || 0;
          const totalRequiredSteps = 5; // BAC, Licence, Master, DUT, Ingenieur
          
          // Calculate progress based on completed steps
          // Assuming personal info is filled if we got candidat data successfully
          const personalInfoCompleted = candidatData.cne && candidatData.cin ? 25 : 0;
          const parcoursCompleted = Math.min((diplomesCount / 2) * 50, 50); // Max 50% for parcours
          const calculatedProgress = personalInfoCompleted + parcoursCompleted;
          setProgressPercentage(Math.min(calculatedProgress, 100));
        } catch (parcoursErr) {
          console.error('Error fetching parcours:', parcoursErr);
          setProgressPercentage(25); // Default if parcours fetch fails
        }

      } catch (error) {
        console.error('Error fetching candidat data:', error);
        // Fallback to localStorage if API fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setCandidatInfo({
              nom: userData.nom || 'Candidat',
              prenom: userData.prenom || '',
              email: userData.email || 'candidat@email.com',
              pathPhoto: userData.pathPhoto
            });
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            setCandidatInfo({
              nom: 'Candidat',
              prenom: '',
              email: 'candidat@email.com'
            });
          }
        } else {
          setCandidatInfo({
            nom: 'Candidat',
            prenom: '',
            email: 'candidat@email.com'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidatData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    setShowLogoutConfirmation(false);
  };

  const navItems = [
    {
      path: '/candidat-dashboard/info-personnelles',
      label: 'Informations Personnelles',
      icon: User,
      description: 'Gérer vos données personnelles'
    },
    {
      path: '/candidat-dashboard/parcours',
      label: 'Parcours Académique',
      icon: GraduationCap,
      description: 'Votre historique académique'
    },
    {
      path: '/candidat-dashboard/postuler',
      label: 'Postuler',
      icon: FileText,
      description: 'Choisir et postuler aux sujets'
    },
    {
      path: '/candidat-dashboard/notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Vos convocations et résultats',
      badge: notificationCount
    }
  ];

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Espace Candidat</h1>
                <p className="text-xs text-gray-500">Gestion de votre candidature doctorale</p>
              </div>
            </div>

            {candidatInfo && (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {candidatInfo.prenom} {candidatInfo.nom}
                  </p>
                  <p className="text-xs text-gray-500">{candidatInfo.email}</p>
                </div>
                <AlertDialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Déconnexion</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre espace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Déconnexion</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - 30% width on large screens */}
          <aside className="w-full lg:w-[30%] lg:max-w-xs">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Profile Card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
                    <AvatarImage src={candidatInfo?.pathPhoto} alt="Photo de profil" />
                    <AvatarFallback className="text-lg font-semibold bg-white text-primary">
                      {candidatInfo ? getInitials(candidatInfo.nom, candidatInfo.prenom) : 'C'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900">
                    {candidatInfo?.prenom} {candidatInfo?.nom}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{candidatInfo?.email}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path || 
                        (item.path.includes('parcours') && location.pathname.includes('parcours'));
                      
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 flex-shrink-0",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <Badge 
                                  variant={isActive ? "secondary" : "destructive"} 
                                  className="ml-2 text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className={cn(
                              "text-xs truncate mt-0.5",
                              isActive ? "text-white/80" : "text-gray-400"
                            )}>
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4 flex-shrink-0 transition-transform",
                            isActive ? "text-white" : "text-gray-300 group-hover:translate-x-1"
                          )} />
                        </NavLink>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Progression du dossier
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Complétude</span>
                      <span className="font-medium text-primary">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Complétez votre parcours pour finaliser votre dossier
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content - 70% width on large screens */}
          <main className="flex-1 lg:w-[70%]">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CandidatLayout;
