import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InscriptionTab } from '../components';

const InscriptionPage: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <InscriptionTab />
      </CardContent>
    </Card>
  );
};

export default InscriptionPage;
