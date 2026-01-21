import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const mentions = [
  { value: 'Très Bien' },
  { value: 'Bien' },
  { value: 'Assez Bien' },
  { value: 'Passable' },
];

const LicenceForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    intitule: 'Licence',
    type: 'LICENCE',
    specialite: '',
    dateObtention: '',
    etablissement: '',
    ville: '',
    mention: '',
    moyenGenerale: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setFormData({
          intitule: 'Licence',
          type: 'LICENCE',
          specialite: 'Informatique',
          dateObtention: '2018-06-20',
          etablissement: 'Faculté des Sciences',
          ville: 'Rabat',
          mention: 'Bien',
          moyenGenerale: '14.50'
        });
      } catch (err) {
        setError('Impossible de charger les données.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Les informations de la Licence ont été enregistrées avec succès.');
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Licence</CardTitle>
        <CardDescription>Renseignez les informations de votre diplôme de Licence</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Intitulé</Label>
              <Input value={formData.intitule} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Spécialité <span className="text-red-500">*</span></Label>
              <Input
                value={formData.specialite}
                onChange={(e) => handleInputChange('specialite', e.target.value)}
                placeholder="Ex: Informatique"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date d'obtention <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={formData.dateObtention}
                onChange={(e) => handleInputChange('dateObtention', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Établissement <span className="text-red-500">*</span></Label>
              <Input
                value={formData.etablissement}
                onChange={(e) => handleInputChange('etablissement', e.target.value)}
                placeholder="Nom de l'établissement"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Ville <span className="text-red-500">*</span></Label>
              <Input
                value={formData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                placeholder="Ville"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mention <span className="text-red-500">*</span></Label>
              <Select value={formData.mention} onValueChange={(v) => handleInputChange('mention', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {mentions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Moyenne générale <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="20"
                value={formData.moyenGenerale}
                onChange={(e) => handleInputChange('moyenGenerale', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Diplôme (PDF)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <Input type="file" accept="application/pdf" />
                <p className="text-xs text-gray-500 mt-2">Taille max: 4 Mo</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Confirmer</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LicenceForm;
