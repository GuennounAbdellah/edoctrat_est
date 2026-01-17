import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_BASE_URL, PERFORM_PASSWORD_RESET_ENDPOINT } from '@/config/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Token de réinitialisation manquant');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 3) {
      toast.error('Le mot de passe doit contenir au moins 3 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${PERFORM_PASSWORD_RESET_ENDPOINT}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          token: token,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Mot de passe réinitialisé avec succès !');
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const data = await response.json();
        const errorMessage = data.error || 'Erreur lors de la réinitialisation';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      toast.error('Erreur de connexion au serveur');
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
                Mot de passe réinitialisé !
              </h1>
              <p className="text-muted-foreground mb-8">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
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

  if (error && !token) {
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
                Lien invalide
              </h1>
              <p className="text-muted-foreground mb-8">
                Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
              </p>
              <div className="space-y-3">
                <Link to="/mot-de-passe-oublie">
                  <Button className="w-full" size="lg">
                    Demander un nouveau lien
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full" size="lg">
                    Aller à la connexion
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
          <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Réinitialiser le mot de passe
              </h1>
              <p className="text-muted-foreground">
                Entrez votre nouveau mot de passe
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20">
                <p className="text-sm text-red">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre nouveau mot de passe"
                    className="pl-11 pr-11"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmez votre mot de passe"
                    className="pl-11 pr-11"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full" size="lg" disabled={isLoading || !token}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Réinitialisation en cours...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm">
                Vous vous souvenez de votre mot de passe ?{' '}
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

export default ResetPassword;
