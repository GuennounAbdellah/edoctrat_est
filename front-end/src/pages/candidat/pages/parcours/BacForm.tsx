import React, { useState, useEffect } from 'react';
import {
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BacFormData {
  intitule: string;
  type: string;
  specialite: string;
  dateCommission: string;
  pays: string;
  ville: string;
  province: string;
  mention: string;
  etablissement: string;
  moyenGenerale: string;
  diplomeFile?: File;
  releveFile?: File;
}

const bacTypes = [
  { value: 'Sciences Mathématiques A' },
  { value: 'Sciences Mathématiques B' },
  { value: 'Sciences Expérimentales' },
  { value: 'Sciences Physiques' },
  { value: 'Sciences de la Vie et de la Terre' },
  { value: 'Sciences Economiques' },
  { value: 'Lettres' },
  { value: 'Sciences Humaines' },
  { value: 'Technique' },
];

const mentions = [
  { value: 'Très Bien' },
  { value: 'Bien' },
  { value: 'Assez Bien' },
  { value: 'Passable' },
];

const countries = [
  { country: 'Maroc' },
  { country: 'France' },
  { country: 'Algérie' },
  { country: 'Tunisie' },
  { country: 'Autre' }
];

const BacForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [diplomeFileName, setDiplomeFileName] = useState<string | null>(null);
  const [releveFileName, setReleveFileName] = useState<string | null>(null);

  const [formData, setFormData] = useState<BacFormData>({
    intitule: 'Baccalauréat',
    type: 'BAC',
    specialite: '',
    dateCommission: '',
    pays: 'Maroc',
    ville: '',
    province: '',
    mention: '',
    etablissement: '',
    moyenGenerale: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setFormData({
          intitule: 'Baccalauréat',
          type: 'BAC',
          specialite: 'Sciences Mathématiques A',
          dateCommission: '2015-06-15',
          pays: 'Maroc',
          ville: 'Casablanca',
          province: 'Casablanca-Settat',
          mention: 'Bien',
          etablissement: 'Lycée Mohammed V',
          moyenGenerale: '15.50'
        });
        setDiplomeFileName('bac_diplome.pdf');
        setReleveFileName('bac_releve.pdf');
      } catch (err) {
        setError('Impossible de charger les données du BAC.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field: keyof BacFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'diplome' | 'releve') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4000000) {
        setError('La taille du fichier ne peut pas dépasser 4 Mo.');
        return;
      }
      if (type === 'diplome') {
        setFormData(prev => ({ ...prev, diplomeFile: file }));
        setDiplomeFileName(file.name);
      } else {
        setFormData(prev => ({ ...prev, releveFile: file }));
        setReleveFileName(file.name);
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Les informations du Baccalauréat ont été enregistrées avec succès.');
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Baccalauréat</CardTitle>
        <CardDescription>
          Renseignez les informations relatives à votre diplôme du Baccalauréat
        </CardDescription>
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
          {/* Diploma Type Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Intitulé</Label>
              <Input value={formData.intitule} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type</Label>
              <Input value={formData.type} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Spécialité <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.specialite} onValueChange={(v) => handleInputChange('specialite', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {bacTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date du BAC <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.dateCommission}
                onChange={(e) => handleInputChange('dateCommission', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Pays <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.pays} onValueChange={(v) => handleInputChange('pays', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.country} value={c.country}>{c.country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ville <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                placeholder="Ville d'obtention"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Province <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="Province/Région"
                required
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Mention <span className="text-red-500">*</span>
              </Label>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Établissement <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.etablissement}
                onChange={(e) => handleInputChange('etablissement', e.target.value)}
                placeholder="Nom du lycée"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Moyenne générale <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="20"
                value={formData.moyenGenerale}
                onChange={(e) => handleInputChange('moyenGenerale', e.target.value)}
                placeholder="Ex: 15.50"
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Documents à joindre</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Diplôme BAC (PDF) <span className="text-red-500">*</span>
                </Label>
                {diplomeFileName && (
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Fichier actuel: {diplomeFileName}</span>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'diplome')}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Taille max: 4 Mo</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Relevé de notes (PDF) <span className="text-red-500">*</span>
                </Label>
                {releveFileName && (
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Fichier actuel: {releveFileName}</span>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'releve')}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Taille max: 4 Mo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Confirmer
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BacForm;
