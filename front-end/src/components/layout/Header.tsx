import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, GraduationCap, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/api/authService';

interface JwtPayload {
  exp: number;
  iat: number;
  authorities?: string[];
  roles?: string[];
  groups?: string[];
  [key: string]: any;
}

const navItems = [
  { label: 'Accueil', href: '/' },
  {
    label: 'Pôle Doctorat',
    href: '/description',
    submenu: [
      { label: 'Description', href: '/description' },
      { label: "Centre d'Études Doctorales", href: '/ced' },
    ],
  },
  { label: 'Laboratoires', href: '/laboratoires' },
  { label: 'Formations', href: '/formations' },
  { label: 'Calendrier', href: '/calendrier' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            setIsLoggedIn(true);
            
            // Extract user role from token
            let roles: string[] = [];
            if (decoded.roles && Array.isArray(decoded.roles)) {
              roles = decoded.roles;
            } else if (decoded.authorities && Array.isArray(decoded.authorities)) {
              roles = decoded.authorities.map((auth: string) => auth.replace('ROLE_', '').toLowerCase());
            } else if (decoded.groups && Array.isArray(decoded.groups)) {
              roles = decoded.groups;
            }
            
            if (roles.length > 0) {
              setUserRole(roles[0].toLowerCase()); // Use first role
            }
          } else {
            setIsLoggedIn(false);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes to handle logout from other tabs
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local storage and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserRole(null);
      navigate('/');
    }
  };

  const isActive = (href: string) => location.pathname === href;

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!userRole) return '/login';
    
    if (userRole.includes('directeur_ced')) return '/ced-dashboard';
    if (userRole.includes('directeur_labo')) return '/labo-dashboard';
    if (userRole.includes('scolarite')) return '/scolarite-dashboard';
    if (userRole.includes('directeur_pole')) return '/pole-dashboard';
    // Directeur roles also have professeur privileges, but we direct them to their specific dashboard first
    if (userRole.includes('professeur')) return '/professeur-dashboard';
    
    return '/candidat-dashboard'; // default
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-medium transition-shadow">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-bold text-foreground">eDoctorat</h1>
              <p className="text-xs text-muted-foreground">USMBA - Fès</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.submenu ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors hover:bg-muted ${
                        isActive(item.href) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.label} asChild>
                        <Link to={subItem.href} className="cursor-pointer">
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                    isActive(item.href) ? 'text-primary bg-primary/5' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to={getDashboardLink()}>
                  <Button variant="default" size="icon" className="shadow-sm rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="outline" size="default">
                    <LogIn className="w-4 h-4" />
                    Se connecter
                  </Button>
                </Link>
                <Link to="/candidat/pre-inscription">
                  <Button variant="gold" size="default">
                    Candidater
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-border/50">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div className="space-y-1">
                        <span className="block px-4 py-2 text-sm font-semibold text-muted-foreground">
                          {item.label}
                        </span>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-8 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`block px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted ${
                          isActive(item.href) ? 'text-primary bg-primary/5' : 'text-foreground'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 px-4 sm:hidden">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full mb-2">
                      <LogIn className="w-4 h-4" />
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;