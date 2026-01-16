import { motion } from 'framer-motion';
import { FlaskConical, Users, BookOpen, ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const laboratoires = [
  {
    id: 1,
    nom: 'Laboratoire de Mathématiques Appliquées',
    description: 'Recherche en analyse numérique, optimisation et modélisation mathématique.',
    directeur: 'Pr. Ahmed El Mansouri',
    etablissement: 'Faculté des Sciences',
    doctorants: 45,
    axes: ['Analyse numérique', 'Optimisation', 'Modélisation'],
  },
  {
    id: 2,
    nom: 'Laboratoire de Chimie Organique',
    description: 'Synthèse de molécules organiques et applications en pharmacologie.',
    directeur: 'Pr. Fatima Benali',
    etablissement: 'Faculté des Sciences',
    doctorants: 38,
    axes: ['Synthèse organique', 'Pharmacologie', 'Chimie verte'],
  },
  {
    id: 3,
    nom: "Laboratoire d'Informatique et Systèmes",
    description: "Intelligence artificielle, systèmes distribués et sécurité informatique.",
    directeur: 'Pr. Karim Alaoui',
    etablissement: 'Faculté des Sciences et Techniques',
    doctorants: 52,
    axes: ['IA', 'Big Data', 'Cybersécurité'],
  },
  {
    id: 4,
    nom: 'Laboratoire de Physique des Matériaux',
    description: 'Étude des propriétés physiques des matériaux et nanotechnologies.',
    directeur: 'Pr. Youssef Tazi',
    etablissement: 'Faculté des Sciences',
    doctorants: 35,
    axes: ['Nanomatériaux', 'Physique du solide', 'Énergies renouvelables'],
  },
  {
    id: 5,
    nom: 'Laboratoire de Biologie Moléculaire',
    description: 'Recherche en génétique moléculaire et biotechnologies.',
    directeur: 'Pr. Laila Chraibi',
    etablissement: 'Faculté des Sciences',
    doctorants: 42,
    axes: ['Génétique', 'Biotechnologie', 'Bioinformatique'],
  },
  {
    id: 6,
    nom: 'Laboratoire de Génie Civil',
    description: 'Mécanique des structures, matériaux de construction et géotechnique.',
    directeur: 'Pr. Mohammed Hajji',
    etablissement: 'École Nationale des Sciences Appliquées',
    doctorants: 28,
    axes: ['Structures', 'Matériaux', 'Géotechnique'],
  },
];

const Laboratoires = () => {
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
              Recherche
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6">
              Laboratoires de Recherche
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Découvrez nos laboratoires de recherche accrédités et leurs axes de recherche.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <FlaskConical className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">80+</div>
              <div className="text-sm text-muted-foreground">Laboratoires</div>
            </div>
            <div>
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">2,500+</div>
              <div className="text-sm text-muted-foreground">Chercheurs</div>
            </div>
            <div>
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Publications/an</div>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratoires Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {laboratoires.map((labo, index) => (
              <motion.div
                key={labo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 overflow-hidden"
              >
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FlaskConical className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {labo.nom}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {labo.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Directeur:</span>{' '}
                      <span className="text-foreground">{labo.directeur}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Établissement:</span>{' '}
                      <span className="text-foreground">{labo.etablissement}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Doctorants:</span>{' '}
                      <span className="text-foreground font-semibold">{labo.doctorants}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {labo.axes.map((axe) => (
                      <span
                        key={axe}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                      >
                        {axe}
                      </span>
                    ))}
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

export default Laboratoires;
