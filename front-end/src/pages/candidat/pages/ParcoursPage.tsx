import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCandidatParcours, DiplomeResponse } from '@/api/candidatService';

interface DiplomaStep {
  id: string;
  path: string;
  label: string;
  labelFr: string;
  completed: boolean;
  required: boolean;
}

interface ApiError extends Error {
  friendlyMessage?: string;
}

const ParcoursPage: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diplomes, setDiplomes] = useState<DiplomeResponse[]>([]);
  
  // Define diploma steps
  const [diplomaSteps, setDiplomaSteps] = useState<DiplomaStep[]>([
    { id: 'bac', path: '/candidat-dashboard/parcours/bac', label: 'BAC', labelFr: 'Baccalauréat', completed: false, required: true },
    { id: 'licence', path: '/candidat-dashboard/parcours/licence', label: 'Licence', labelFr: 'Licence', completed: false, required: false },
    { id: 'master', path: '/candidat-dashboard/parcours/master', label: 'Master', labelFr: 'Master', completed: false, required: true },
    { id: 'dut', path: '/candidat-dashboard/parcours/dut', label: 'DUT', labelFr: 'DUT', completed: false, required: false },
    { id: 'ingenieur', path: '/candidat-dashboard/parcours/ingenieur', label: 'Ingénieur', labelFr: 'Cycle Ingénieur', completed: false, required: false },
  ]);

  useEffect(() => {
    const fetchDiplomes = async () => {
      setIsLoading(true);
      try {
        const response = await getCandidatParcours();
        const fetchedDiplomes = response.results || [];
        setDiplomes(fetchedDiplomes);

        // Update diploma steps based on fetched data
        setDiplomaSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: fetchedDiplomes.some(
              (d: DiplomeResponse) => d.type?.toLowerCase() === step.id.toLowerCase()
            )
          }))
        );
      } catch (err: unknown) {
        console.error('Error fetching diplomes:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de charger votre parcours académique.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiplomes();
  }, []);

  const completedCount = diplomaSteps.filter(s => s.completed).length;
  const requiredCount = diplomaSteps.filter(s => s.required).length;
  const requiredCompleted = diplomaSteps.filter(s => s.required && s.completed).length;
  const progressPercentage = (completedCount / diplomaSteps.length) * 100;

  const getCurrentStep = () => {
    const current = diplomaSteps.find(s => location.pathname.includes(s.id));
    return current || diplomaSteps[0];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parcours Académique</h2>
          <p className="text-gray-500">Renseignez vos diplômes et formations</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progression du parcours
                </span>
                <span className="text-sm text-gray-500">
                  {completedCount}/{diplomaSteps.length} diplômes renseignés
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex items-center gap-2">
              {requiredCompleted === requiredCount ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Diplômes requis complétés
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {requiredCount - requiredCompleted} diplôme(s) requis manquant(s)
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important</p>
              <p>
                Veuillez renseigner votre parcours académique en commençant par le Baccalauréat. 
                Les diplômes marqués d'un astérisque (*) sont obligatoires pour valider votre candidature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diploma Navigation Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-2">
            {diplomaSteps.map((step) => {
              const isActive = location.pathname.includes(step.id);
              
              return (
                <NavLink
                  key={step.id}
                  to={step.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : step.completed
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {step.completed ? (
                    <CheckCircle2 className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-green-600"
                    )} />
                  ) : (
                    <Circle className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-gray-400"
                    )} />
                  )}
                  <span>{step.label}</span>
                  {step.required && (
                    <span className={cn(
                      "text-xs",
                      isActive ? "text-white/80" : "text-red-500"
                    )}>*</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diploma Form Content */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default ParcoursPage;
