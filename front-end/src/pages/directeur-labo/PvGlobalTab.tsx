import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface PvGlobalTabProps {
  onDownloadPV: (format: 'pdf' | 'excel') => void;
}

const PvGlobalTab: React.FC<PvGlobalTabProps> = ({ onDownloadPV }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold mb-2 text-blue-900">Générer le procès-verbal global</h3>
        <p className="text-sm text-blue-700 mb-4">
          Ce document contient l'ensemble des résultats, décisions et statistiques 
          de la session de doctorat en cours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => onDownloadPV('pdf')} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Télécharger PV (PDF)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onDownloadPV('excel')} 
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="w-4 h-4" />
            Télécharger PV (Excel)
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4 text-gray-900">Statistiques générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">24</div>
              <div className="text-sm text-green-700 mt-2">Candidats évalués</div>
            </CardContent>
          </Card>
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">18</div>
              <div className="text-sm text-blue-700 mt-2">Candidats admis</div>
            </CardContent>
          </Card>
          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">6</div>
              <div className="text-sm text-orange-700 mt-2">Candidats ajournés</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4 text-gray-900">Détails par formation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-2">Informatique</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Candidats inscrits:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admis:</span>
                  <span className="font-medium text-green-600">9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ajournés:</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-2">Mathématiques</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Candidats inscrits:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admis:</span>
                  <span className="font-medium text-green-600">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ajournés:</span>
                  <span className="font-medium text-orange-600">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PvGlobalTab;