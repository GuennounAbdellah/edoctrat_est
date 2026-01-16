import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';

const events = [
  {
    id: 1,
    titre: 'Ouverture des inscriptions',
    dateDebut: '2024-09-01',
    dateFin: '2024-10-15',
    type: 'inscription',
    description: 'Période d\'inscription pour les nouveaux candidats au doctorat.',
    lieu: 'En ligne',
    public: 'Candidats',
  },
  {
    id: 2,
    titre: 'Dépôt des candidatures',
    dateDebut: '2024-10-01',
    dateFin: '2024-11-30',
    type: 'candidature',
    description: 'Date limite pour le dépôt des dossiers de candidature complets.',
    lieu: 'En ligne',
    public: 'Candidats',
  },
  {
    id: 3,
    titre: 'Commission de sélection',
    dateDebut: '2024-12-15',
    dateFin: '2024-12-20',
    type: 'commission',
    description: 'Réunion de la commission pour l\'examen des candidatures.',
    lieu: 'Présidence USMBA',
    public: 'Professeurs',
  },
  {
    id: 4,
    titre: 'Publication des résultats',
    dateDebut: '2025-01-15',
    dateFin: '2025-01-15',
    type: 'info',
    description: 'Annonce des candidats retenus pour le doctorat.',
    lieu: 'En ligne',
    public: 'Candidats',
  },
  {
    id: 5,
    titre: 'Soutenances de thèse - Session Hiver',
    dateDebut: '2025-01-20',
    dateFin: '2025-02-28',
    type: 'soutenance',
    description: 'Période des soutenances de thèse pour les doctorants en fin de cycle.',
    lieu: 'Facultés USMBA',
    public: 'Doctorants',
  },
  {
    id: 6,
    titre: 'Inscription administrative',
    dateDebut: '2025-02-01',
    dateFin: '2025-02-28',
    type: 'inscription',
    description: 'Inscription administrative des nouveaux doctorants.',
    lieu: 'Service Scolarité',
    public: 'Nouveaux doctorants',
  },
];

const typeColors: Record<string, string> = {
  inscription: 'bg-primary/10 text-primary border-primary/20',
  candidature: 'bg-secondary/20 text-secondary-foreground border-secondary/30',
  commission: 'bg-emerald/10 text-emerald border-emerald/20',
  soutenance: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-muted text-muted-foreground border-border',
};

const typeLabels: Record<string, string> = {
  inscription: 'Inscription',
  candidature: 'Candidature',
  commission: 'Commission',
  soutenance: 'Soutenance',
  info: 'Information',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const Calendrier = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="py-20 lg:py-28 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6">
              Planning
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6">
              Calendrier Académique
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Dates importantes pour les inscriptions, candidatures, soutenances et commissions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl shadow-soft border border-border/50 p-6 lg:p-8 hover:shadow-medium transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Date */}
                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="bg-primary/10 rounded-xl p-4">
                      <CalendarIcon className="w-6 h-6 text-primary mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">
                        {formatDate(event.dateDebut).split(' ')[1]}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {new Date(event.dateDebut).getDate()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className={typeColors[event.type]}>{typeLabels[event.type]}</Badge>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      {event.titre}
                    </h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(event.dateDebut)}
                        {event.dateDebut !== event.dateFin && ` - ${formatDate(event.dateFin)}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.lieu}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.public}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Calendrier;
