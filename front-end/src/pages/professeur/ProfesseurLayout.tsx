import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  FileText,
  UserCheck,
  LogOut,
  GraduationCap,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

interface LoggedProfesseur {
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
}

const ProfesseurLayout: React.FC = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [loggedProfesseur, setLoggedProfesseur] = useState<LoggedProfesseur | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const professeurData: LoggedProfesseur = {
          nom: userData.nom || userData.lastName || 'Professeur',
          prenom: userData.prenom || userData.firstName || '',
          email: userData.email || 'professeur@univ.ma',
          grade: userData.grade || ''
        };
        setLoggedProfesseur(professeurData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoggedProfesseur({
          nom: 'Professeur',
          prenom: '',
          email: 'professeur@univ.ma'
        });
      }
    } else {
      setLoggedProfesseur({
        nom: 'Professeur',
        prenom: '',
        email: 'professeur@univ.ma'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    setShowLogoutConfirmation(false);
  };

  const navItems = [
    { path: '/professeur-dashboard/sujets', label: 'Mes Sujets', icon: BookOpen },
    { path: '/professeur-dashboard/commissions', label: 'Commissions', icon: Calendar },
    { path: '/professeur-dashboard/resultats', label: 'Résultats', icon: FileText },
    { path: '/professeur-dashboard/inscrits', label: 'Inscrits', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="py-6 lg:py-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Espace Professeur
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Gestion de vos sujets de recherche, commissions et résultats
              </p>
            </motion.div>
            
            {loggedProfesseur && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border min-w-[200px] order-1 lg:order-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                    <p className="font-medium text-sm">
                      {loggedProfesseur.grade && `${loggedProfesseur.grade}. `}
                      {loggedProfesseur.prenom} {loggedProfesseur.nom}
                    </p>
                  </div>
                </div>
                <AlertDialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <LogOut className="w-4 h-4" />
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
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Actions Professeur</h2>
          </div>
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProfesseurLayout;
