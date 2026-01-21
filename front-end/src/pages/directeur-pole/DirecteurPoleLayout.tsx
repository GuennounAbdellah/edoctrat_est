import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  Building2,
  MessageSquare,
  ClipboardList,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

const DirecteurPoleLayout: React.FC = () => {
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
          prenom: userData.prenom || userData.firstName || 'Pôle',
          email: userData.email || 'directeur@pole.ma'
        };
        setLoggedDirector(directorData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoggedDirector({
          nom: 'Directeur',
          prenom: 'Pôle',
          email: 'directeur@pole.ma'
        });
      }
    } else {
      setLoggedDirector({
        nom: 'Directeur',
        prenom: 'Pôle',
        email: 'directeur@pole.ma'
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
    { path: '/pole-dashboard/sujets', label: 'Sujets', icon: BookOpen },
    { path: '/pole-dashboard/candidats', label: 'Candidats', icon: Users },
    { path: '/pole-dashboard/commissions', label: 'Commissions', icon: FileText },
    { path: '/pole-dashboard/calendrier', label: 'Calendrier', icon: Calendar },
    { path: '/pole-dashboard/communiquer', label: 'Communiquer', icon: MessageSquare },
    { path: '/pole-dashboard/inscription', label: 'Inscription', icon: ClipboardList },
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
              Espace Directeur de Pôle
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestion et supervision des sujets, candidats, commissions et calendrier du pôle doctoral
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Actions Directeur de Pôle</h2>
          </div>
          <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

export default DirecteurPoleLayout;
