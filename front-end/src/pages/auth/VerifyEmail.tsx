import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_BASE_URL, VERIFY_EMAIL_ENDPOINT } from '@/config/auth';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Token de vérification manquant');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${VERIFY_EMAIL_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          toast.success('Email vérifié avec succès !');
          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.error || 'Erreur lors de la vérification');
          toast.error(data.error || 'Erreur lors de la vérification');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
        toast.error('Erreur de connexion au serveur');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
                Vérification en cours...
              </h1>
              <p className="text-muted-foreground">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

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
                Email vérifié avec succès !
              </h1>
              <p className="text-muted-foreground mb-8">
                Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
              </p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full" size="lg">
                    Se connecter
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
            <div className="w-20 h-20 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Erreur de vérification
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || 'Une erreur est survenue lors de la vérification de votre email.'}
            </p>
            <div className="space-y-3">
              <Link to="/candidat/pre-inscription">
                <Button className="w-full" size="lg">
                  Réessayer l'inscription
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full" size="lg">
                  Aller à la connexion
                </Button>
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">
                Besoin d'un nouveau lien de vérification ?
              </p>
              <Link
                to="/resend-verification"
                className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Renvoyer l'email de vérification
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
