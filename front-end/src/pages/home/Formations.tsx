import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, ExternalLink, GraduationCap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const formations = [
  {
    id: 1,
    nom: 'Sciences et Technologies',
    description: 'Formation doctorale en sciences fondamentales et appliquées.',
    responsable: 'Pr. Hassan Boutaleb',
    duree: '3-4 ans',
    places: 50,
    specialites: ['Mathématiques', 'Physique', 'Chimie', 'Informatique'],
  },
  {
    id: 2,
    nom: 'Sciences de la Vie et de la Santé',
    description: 'Recherche en biologie, biotechnologie et sciences médicales.',
    responsable: 'Pr. Amina Benjelloun',
    duree: '3-4 ans',
    places: 40,
    specialites: ['Biologie', 'Biochimie', 'Pharmacologie', 'Médecine'],
  },
  {
    id: 3,
    nom: 'Sciences Juridiques et Économiques',
    description: 'Formation en droit, économie et sciences de gestion.',
    responsable: 'Pr. Rachid El Filali',
    duree: '3-4 ans',
    places: 35,
    specialites: ['Droit', 'Économie', 'Gestion', 'Finance'],
  },
  {
    id: 4,
    nom: 'Lettres et Sciences Humaines',
    description: 'Recherche en littérature, linguistique et sciences sociales.',
    responsable: 'Pr. Naima Sahraoui',
    duree: '3-4 ans',
    places: 30,
    specialites: ['Littérature', 'Linguistique', 'Histoire', 'Sociologie'],
  },
  {
    id: 5,
    nom: 'Sciences de l\'Ingénieur',
    description: 'Formation en ingénierie et technologies avancées.',
    responsable: 'Pr. Omar Moussaoui',
    duree: '3-4 ans',
    places: 45,
    specialites: ['Génie Civil', 'Génie Électrique', 'Génie Mécanique', 'Génie Industriel'],
  },
  {
    id: 6,
    nom: 'Sciences de l\'Environnement',
    description: 'Recherche sur l\'environnement et le développement durable.',
    responsable: 'Pr. Fatima Zahra Bennani',
    duree: '3-4 ans',
    places: 25,
    specialites: ['Écologie', 'Géologie', 'Hydrologie', 'Climatologie'],
  },
];

const Formations = () => {
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
              Programmes
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6">
              Formations Doctorales
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Découvrez nos programmes de doctorat accrédités dans différents domaines de recherche.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">45+</div>
              <div className="text-sm text-muted-foreground">Formations</div>
            </div>
            <div>
              <GraduationCap className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">2,500+</div>
              <div className="text-sm text-muted-foreground">Doctorants</div>
            </div>
            <div>
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">3-4</div>
              <div className="text-sm text-muted-foreground">Années</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((formation, index) => (
              <motion.div
                key={formation.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 overflow-hidden"
              >
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center mb-6 group-hover:bg-emerald group-hover:text-emerald-foreground transition-colors">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {formation.nom}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {formation.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Responsable:</span>{' '}
                      <span className="text-foreground">{formation.responsable}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Durée:</span>{' '}
                      <span className="text-foreground">{formation.duree}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Places:</span>{' '}
                      <span className="text-foreground font-semibold">{formation.places}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formation.specialites.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                    {formation.specialites.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        +{formation.specialites.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-8 py-4 bg-muted/50 border-t border-border/50">
                  <Button variant="ghost" className="w-full" size="sm">
                    Voir les détails
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Formations;
