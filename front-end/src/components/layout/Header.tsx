import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, GraduationCap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

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
            <Link to="/connexion" className="hidden sm:block">
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
                  <Link to="/connexion" onClick={() => setMobileMenuOpen(false)}>
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
