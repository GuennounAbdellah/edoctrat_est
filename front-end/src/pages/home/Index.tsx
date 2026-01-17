import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, BookOpen, Award, Calendar, FlaskConical, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import heroImage from '@/assets/hero-university.jpg';

const stats = [
  { label: 'Doctorants', value: '2,500+', icon: Users },
  { label: 'Formations', value: '45+', icon: BookOpen },
  { label: 'Laboratoires', value: '80+', icon: FlaskConical },
  { label: 'Professeurs', value: '500+', icon: Award },
];

const features = [
  {
    title: 'Candidature simplifiée',
    description: 'Processus de candidature entièrement en ligne, suivi en temps réel de votre dossier.',
    icon: GraduationCap,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Formations doctorales',
    description: "Découvrez nos programmes d'excellence dans divers domaines de recherche.",
    icon: BookOpen,
    color: 'bg-emerald/10 text-emerald',
  },
  {
    title: 'Laboratoires de recherche',
    description: 'Accédez à nos laboratoires équipés des dernières technologies.',
    icon: FlaskConical,
    color: 'bg-secondary/20 text-secondary-foreground',
  },
  {
    title: 'Calendrier académique',
    description: 'Consultez les dates importantes : inscriptions, soutenances, commissions.',
    icon: Calendar,
    color: 'bg-primary/10 text-primary',
  },
];

const roles = [
  { label: 'Candidat', href: '/connexion/candidat', description: 'Accédez à votre espace candidat' },
  { label: 'Professeur', href: '/connexion/professeur', description: 'Gérez vos doctorants et sujets' },
  { label: 'Scolarité', href: '/connexion/scolarite', description: 'Administration des inscriptions' },
  { label: 'Directeur CED', href: '/connexion/ced', description: "Direction du centre d'études" },
  { label: 'Directeur Labo', href: '/connexion/labo', description: 'Gestion du laboratoire' },
  { label: 'Directeur Pôle', href: '/connexion/pole', description: 'Coordination du pôle doctoral' },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Campus universitaire"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-90" />
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 lg:px-8 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6 backdrop-blur-sm">
                Université Sidi Mohammed Ben Abdellah - Fès
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6"
            >
              Plateforme de Gestion des{' '}
              <span className="text-gradient">Études Doctorales</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-foreground/80 mb-10 leading-relaxed"
            >
              Simplifiez votre parcours doctoral. Candidatez, suivez votre dossier et accédez à
              toutes les ressources depuis une seule plateforme.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/candidat/pre-inscription">
                <Button variant="hero" size="xl">
                  Déposer ma candidature
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/connexion">
                <Button variant="heroOutline" size="xl">
                  Se connecter
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 glass-dark border-t border-primary-foreground/10"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-primary-foreground/10">
              {stats.map((stat, index) => (
                <div key={stat.label} className="py-1 lg:py-2 px-4 lg:px-8 text-center">
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              Nos Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-serif font-bold text-foreground mt-3 mb-4"
            >
              Tout pour votre réussite doctorale
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Une plateforme complète pour accompagner candidats, professeurs et administrateurs.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              Espace Utilisateur
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-serif font-bold text-foreground mt-3 mb-4"
            >
              Accédez à votre espace
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Choisissez votre profil pour accéder à votre espace personnel.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={role.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={role.href}
                  className="group block p-6 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 hover:border-primary/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {role.label}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6">
              Prêt à commencer votre aventure doctorale ?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Rejoignez des milliers de doctorants et chercheurs qui ont choisi l'USMBA pour leur parcours académique.
            </p>
            <Link to="/candidat/pre-inscription">
              <Button variant="hero" size="xl">
                Commencer ma candidature
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
