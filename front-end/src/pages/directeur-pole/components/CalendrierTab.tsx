import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendrier } from 'src/models/Calendrier';

interface CalendrierTabProps {
  calendrier: Calendrier[];
  onConfirm: (id: number, dateDebut: string, dateFin: string) => void;
  loading: boolean;
}

export const CalendrierTab: React.FC<CalendrierTabProps> = ({ calendrier, onConfirm, loading }) => {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {calendrier.map((item) => (
          <AccordionItem key={item.id} value={`item-${item.id}`}>
            <AccordionTrigger className="text-left">
              {item.action}
            </AccordionTrigger>
            <AccordionContent>
              <CalendrierForm
                item={item}
                onConfirm={onConfirm}
                loading={loading}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Calendrier Form Component
interface CalendrierFormProps {
  item: Calendrier;
  onConfirm: (id: number, dateDebut: string, dateFin: string) => void;
  loading: boolean;
}

const CalendrierForm: React.FC<CalendrierFormProps> = ({ item, onConfirm, loading }) => {
  const [dateDebut, setDateDebut] = useState(item.dateDebut);
  const [dateFin, setDateFin] = useState(item.dateFin);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">De</span>
      <Input
        type="date"
        value={dateDebut}
        onChange={(e) => setDateDebut(e.target.value)}
        className="w-auto"
      />
      <span className="text-sm font-medium">à</span>
      <Input
        type="date"
        value={dateFin}
        onChange={(e) => setDateFin(e.target.value)}
        className="w-auto"
      />
      <Button
        onClick={() => onConfirm(item.id, dateDebut, dateFin)}
        disabled={loading}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer
      </Button>
    </div>
  );
};
