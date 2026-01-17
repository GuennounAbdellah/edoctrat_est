import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_BASE_URL, RESEND_VERIFICATION_ENDPOINT } from '@/config/auth';

const ResendVerification = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${RESEND_VERIFICATION_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Email de vérification renvoyé !');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors du renvoi de l\'email');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
              <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
                Email renvoyé !
              </h1>
              <p className="text-muted-foreground mb-8">
                Un nouvel email de vérification a été envoyé à{' '}
                <span className="font-semibold text-foreground">{email}</span>. 
                Veuillez vérifier votre boîte de réception.
              </p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full" size="lg">
                    Aller à la page de connexion
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full" size="lg">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Renvoyer l'email de vérification
              </h1>
              <p className="text-muted-foreground">
                Entrez votre adresse email pour recevoir un nouveau lien de vérification
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Renvoyer l\'email'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm">
                Déjà vérifié ?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResendVerification;
