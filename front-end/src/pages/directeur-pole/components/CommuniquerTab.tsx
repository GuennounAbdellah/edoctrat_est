import React from 'react';
import { Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CommuniquerTabProps {
  onPublierSujets: () => void;
  onPublierListePrincipale: () => void;
  onPublierListeAttente: () => void;
  loading: boolean;
}

export const CommuniquerTab: React.FC<CommuniquerTabProps> = ({
  onPublierSujets,
  onPublierListePrincipale,
  onPublierListeAttente,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full" defaultValue="sujets">
        <AccordionItem value="sujets">
          <AccordionTrigger>Sujets</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <h5 className="font-semibold">Publier les sujets</h5>
                <p className="text-sm text-muted-foreground">
                  Rendre visibles les sujets de recherche aux candidats
                </p>
              </div>
              <Button onClick={onPublierSujets} disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                Confirmer
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="liste-principale">
          <AccordionTrigger>Liste Principale</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <h5 className="font-semibold">Liste Principale</h5>
                <p className="text-sm text-muted-foreground">
                  Publier et télécharger la liste principale des candidats admis
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={onPublierListePrincipale} disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="liste-attente">
          <AccordionTrigger>Liste D'attente</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <h5 className="font-semibold">Liste D'attente</h5>
                <p className="text-sm text-muted-foreground">
                  Publier et télécharger la liste d'attente des candidats
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={onPublierListeAttente} disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
