import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileText,
  UserCheck,
  LogOut,
  GraduationCap,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

const DirecteurCedLayout: React.FC = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [loggedDirector, setLoggedDirector] = useState<{ nom: string; prenom: string; email: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const directorData = {
          nom: userData.nom || userData.lastName || 'Directeur',
          prenom: userData.prenom || userData.firstName || 'CED',
          email: userData.email || 'directeur@ced.ma'
        };
        setLoggedDirector(directorData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoggedDirector({
          nom: 'Directeur',
          prenom: 'CED',
          email: 'directeur@ced.ma'
        });
      }
    } else {
      setLoggedDirector({
        nom: 'Directeur',
        prenom: 'CED',
        email: 'directeur@ced.ma'
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
    { path: '/ced-dashboard/candidats', label: 'Candidats', icon: Users },
    { path: '/ced-dashboard/sujets', label: 'Sujets', icon: BookOpen },
    { path: '/ced-dashboard/resultats', label: 'Résultats', icon: FileText },
    { path: '/ced-dashboard/inscrits', label: 'Inscrits', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-8 lg:py-16 bg-gradient-to-r from-primary/5 to-secondary/5 mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Espace Directeur du Centre d'Études Doctorales
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestion et supervision des activités du centre d'études doctorales
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Actions Directeur CED</h2>
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

export default DirecteurCedLayout;
