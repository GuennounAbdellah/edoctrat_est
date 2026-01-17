import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_BASE_URL, GOOGLE_CLIENT_ID, UNIFIED_LOGIN_ENDPOINT, GOOGLE_OAUTH_ENDPOINT } from '@/config/auth';

declare global {
  interface Window {
    google: any;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isCandidat = true; // Unified login for all users, treating as candidate by default

  const handleGoogleSignIn = useCallback(async (response: any) => {
    setIsGoogleLoading(true);
    try {
      // Using unified Google OAuth endpoint
      const endpoint = GOOGLE_OAUTH_ENDPOINT;
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        // Stocker les tokens
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
        }
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        toast.success('Connexion réussie avec Google !');
        
        // Determine user role and redirect accordingly
        // Check the user's groups/roles from the backend response to determine the role
        const userRole = data.role || data.userRole || (data.groups && data.groups.length > 0 ? data.groups[0] : null);
        
        // Redirect based on user role from backend
        if (userRole && userRole.toLowerCase().includes('directeur_ced')) {
          navigate('/ced-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('directeur_labo')) {
          navigate('/labo-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('scolarite')) {
          navigate('/scolarite-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('professeur')) {
          navigate('/professeur-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('directeur_pole')) {
          navigate('/pole-dashboard');
        } else {
          // Default to candidat for regular users
          navigate('/candidat');
        }
      } else {
        toast.error('Erreur lors de la connexion Google');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [navigate]);

  const handleGoogleClick = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Sign-In n\'est pas encore chargé. Veuillez réessayer.');
    }
  };

  // Charger Google Identity Services
  useEffect(() => {
    if (!window.google && GOOGLE_CLIENT_ID) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [handleGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use unified login endpoint for all users
      const endpoint = '/api/login';
      const requestBody = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Stocker les tokens
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
        }
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        
        toast.success('Connexion réussie !');
        
        // Determine user role and redirect accordingly
        // Check the user's groups/roles from the backend response to determine the role
        const userRole = data.role || data.userRole || (data.groups && data.groups.length > 0 ? data.groups[0] : null);
        
        // Redirect based on user role from backend
        if (userRole && userRole.toLowerCase().includes('directeur_ced')) {
          navigate('/ced-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('directeur_labo')) {
          navigate('/labo-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('scolarite')) {
          navigate('/scolarite-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('professeurs')) {
          navigate('/professeur-dashboard');
        } else if (userRole && userRole.toLowerCase().includes('directeur_pole')) {
          navigate('/pole-dashboard');
        } else {
          // Default to candidat for regular users
          navigate('/candidat');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 && errorData.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Veuillez vérifier votre email avant de vous connecter');
        } else {
          toast.error(errorData.error || 'Identifiants incorrects');
        }
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <div className="bg-card rounded-2xl shadow-medium border border-border/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Connexion
              </h1>
              <p className="text-muted-foreground">
                Entrez vos identifiants pour accéder à votre espace
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-11 pr-11"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-muted-foreground">Se souvenir de moi</span>
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || isGoogleLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Bouton Google OAuth2 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-6"
                size="lg"
                onClick={handleGoogleClick}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connexion Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuer avec Google
                  </>
                )}
              </Button>
            </div>

            {isCandidat && (
              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-muted-foreground text-sm">
                  Pas encore inscrit ?{' '}
                  <Link to="/candidat/pre-inscription" className="text-primary font-semibold hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
