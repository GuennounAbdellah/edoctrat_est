import React from 'react';
import { ClipboardList } from 'lucide-react';

export const InscriptionTab: React.FC = () => {
  return (
    <div className="text-center py-12">
      <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Gestion des Inscriptions</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Cette section permettra de gérer les inscriptions des doctorants.
        Fonctionnalité en cours de développement.
      </p>
    </div>
  );
};
