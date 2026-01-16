import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  User, 
  School, 
  Building2, 
  FlaskConical, 
  Landmark,
  ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const roleOptions = [
  {
    id: 'candidat',
    label: 'Candidat',
    description: 'Espace dédié aux candidats au doctorat',
    icon: GraduationCap,
    href: '/connexion/candidat',
    color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground',
  },
  {
    id: 'professeur',
    label: 'Professeur',
    description: 'Gérez vos doctorants et sujets de recherche',
    icon: User,
    href: '/connexion/professeur',
    color: 'bg-emerald/10 text-emerald border-emerald/20 hover:bg-emerald hover:text-emerald-foreground',
  },
  {
    id: 'scolarite',
    label: 'Scolarité',
    description: 'Administration des inscriptions',
    icon: School,
    href: '/connexion/scolarite',
    color: 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary hover:text-secondary-foreground',
  },
  {
    id: 'ced',
    label: 'Directeur CED',
    description: "Direction du centre d'études doctorales",
    icon: Building2,
    href: '/connexion/ced',
    color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground',
  },
  {
    id: 'labo',
    label: 'Directeur Labo',
    description: 'Gestion du laboratoire de recherche',
    icon: FlaskConical,
    href: '/connexion/labo',
    color: 'bg-emerald/10 text-emerald border-emerald/20 hover:bg-emerald hover:text-emerald-foreground',
  },
  {
    id: 'pole',
    label: 'Directeur Pôle',
    description: 'Coordination du pôle doctoral',
    icon: Landmark,
    href: '/connexion/pole',
    color: 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary hover:text-secondary-foreground',
  },
];

const Connexion = () => {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              Choisissez votre espace
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Sélectionnez votre profil pour accéder à votre espace personnel sur la plateforme eDoctorat.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleOptions.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={role.href}>
                  <div
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${role.color}`}
                  >
                    <role.icon className="w-12 h-12 mb-6 transition-transform group-hover:scale-110" />
                    <h3 className="text-xl font-semibold mb-2">{role.label}</h3>
                    <p className="text-sm opacity-80">{role.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/candidat/pre-inscription" className="text-primary font-semibold hover:underline">
                Créer un compte candidat
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;
