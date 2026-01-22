import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_BASE_URL, GOOGLE_CLIENT_ID, UNIFIED_LOGIN_ENDPOINT, GOOGLE_OAUTH_ENDPOINT } from '@/config/auth';
import { getUserRoleFromToken, isTokenExpired } from '@/utils/authUtils';

declare global {
  interface Window {
    google: any;
  }
}

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check if user is already logged in and redirect to appropriate dashboard
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isTokenExpired(token)) {
      const userRole = getUserRoleFromToken(token);
      if (userRole) {
        redirectToDashboard(userRole);
      }
    }
  }, [navigate]);

  // Fonction pour rediriger selon le rôle
  const redirectToDashboard = (userRole: string) => {
    const role = userRole.toLowerCase();
    
    if (role.includes('directeur_ced') || role === 'ced') {
      navigate('/ced-dashboard');
    } else if (role.includes('directeur_labo') || role === 'labo') {
      navigate('/labo-dashboard');
    } else if (role.includes('directeur_pole') || role === 'pole') {
      navigate('/pole-dashboard');
    } else if (role === 'scolarite') {
      navigate('/scolarite-dashboard');
    } else if (role === 'professeur') {
      navigate('/professeur-dashboard');
    } else if (role === 'candidat') {
      navigate('/candidat-dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    try {
      console.log('Google Sign-In response received');
      
      const res = await fetch(`${API_BASE_URL}${GOOGLE_OAUTH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('OAuth response:', data);
        
        // Stocker les tokens
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
        }
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        
        toast.success('Connexion réussie avec Google !');
        
        // Extraire le rôle de l'utilisateur
        let userRole = null;
        if (data.role) {
          userRole = data.role;
        } else if (data.groups && data.groups.length > 0) {
          userRole = data.groups[0];
        } else if (data.authorities && data.authorities.length > 0) {
          userRole = data.authorities[0];
        } else if (data.roles && data.roles.length > 0) {
          userRole = data.roles[0];
        } else {
          userRole = 'professeur'; // Default for OAuth users
        }
        
        // Rediriger selon le rôle
        redirectToDashboard(userRole);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('OAuth error:', errorData);
        
        if (errorData.error && errorData.error.includes('Candidat')) {
          toast.error('Les candidats doivent utiliser l\'authentification par email/mot de passe', {
            description: 'Google OAuth est réservé aux professeurs et directeurs',
            duration: 5000,
          });
        } else {
          toast.error('Erreur lors de la connexion Google', {
            description: 'Assurez-vous d\'utiliser un compte professeur autorisé',
          });
        }
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    toast.error('Échec de la connexion Google');
    setIsGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${UNIFIED_LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
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
        
        // Extraire le rôle
        let userRole = null;
        if (data.role) {
          userRole = data.role;
        } else if (data.groups && data.groups.length > 0) {
          userRole = data.groups[0];
        } else if (data.authorities && data.authorities.length > 0) {
          userRole = data.authorities[0];
        } else if (data.roles && data.roles.length > 0) {
          userRole = data.roles[0];
        } else {
          userRole = 'candidat';
        }
        
        // Rediriger selon le rôle
        redirectToDashboard(userRole);
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403 && errorData.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Veuillez vérifier votre email avant de vous connecter', {
            description: 'Un email de vérification vous a été envoyé lors de l\'inscription',
          });
        } else {
          toast.error(errorData.error || 'Identifiants incorrects');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion au serveur');
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
            to="/"
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
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Bouton Google OAuth2 - Pour professeurs et directeurs uniquement */}
            {GOOGLE_CLIENT_ID && (
              <>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Ou</span>
                    </div>
                  </div>
                  <div className="w-full">
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>

                {/* Avertissement pour les candidats */}
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      <strong>Note :</strong> L'authentification Google est réservée aux professeurs et directeurs. 
                      Les candidats doivent utiliser leur email et mot de passe.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Lien d'inscription pour les candidats */}
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm">
                Pas encore inscrit ?{' '}
                <Link to="/candidat/pre-inscription" className="text-primary font-semibold hover:underline">
                  Créer un compte candidat
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;