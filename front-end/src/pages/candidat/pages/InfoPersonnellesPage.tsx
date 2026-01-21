import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  Camera,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getCandidatInfo, updateCandidatInfo, CandidatResponse } from '@/api/candidatService';

interface CandidatInfo {
  nom: string;
  prenom: string;
  nomCandidatAr: string;
  prenomCandidatAr: string;
  cin: string;
  cne: string;
  dateDeNaissance: string;
  sexe: string;
  villeDeNaissance: string;
  villeDeNaissanceAr: string;
  adresse: string;
  ville: string;
  telCandidat: string;
  pays: string;
  fonctionnaire: string;
  pathPhoto?: string;
}

interface ApiError extends Error {
  friendlyMessage?: string;
}

const countries = [
  { country: 'Maroc' },
  { country: 'France' },
  { country: 'Algérie' },
  { country: 'Tunisie' },
  { country: 'Espagne' },
  { country: 'Belgique' },
  { country: 'Canada' },
  { country: 'Autre' }
];

const InfoPersonnellesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<CandidatInfo>({
    nom: '',
    prenom: '',
    nomCandidatAr: '',
    prenomCandidatAr: '',
    cin: '',
    cne: '',
    dateDeNaissance: '',
    sexe: 'm',
    villeDeNaissance: '',
    villeDeNaissanceAr: '',
    adresse: '',
    ville: '',
    telCandidat: '',
    pays: 'Maroc',
    fonctionnaire: 'non'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const candidatData = await getCandidatInfo();
        
        // Map API response to form data
        setFormData({
          nom: candidatData.nom || '',
          prenom: candidatData.prenom || '',
          nomCandidatAr: candidatData.nomCandidatAr || '',
          prenomCandidatAr: candidatData.prenomCandidatAr || '',
          cin: candidatData.cin || '',
          cne: candidatData.cne || '',
          dateDeNaissance: candidatData.dateDeNaissance || '',
          sexe: candidatData.sexe || 'm',
          villeDeNaissance: candidatData.villeDeNaissance || '',
          villeDeNaissanceAr: candidatData.villeDeNaissanceAr || '',
          adresse: candidatData.adresse || '',
          ville: candidatData.ville || '',
          telCandidat: candidatData.telCandidat || '',
          pays: candidatData.pays || 'Maroc',
          fonctionnaire: candidatData.fonctionnaire || 'non',
          pathPhoto: candidatData.pathPhoto
        });

        // Update localStorage with latest user info
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({
            ...userData,
            nom: candidatData.nom,
            prenom: candidatData.prenom,
            email: candidatData.email,
            pathPhoto: candidatData.pathPhoto
          }));
        }
      } catch (err: unknown) {
        console.error('Error fetching candidat info:', err);
        const apiError = err as ApiError;
        setError(apiError.friendlyMessage || 'Impossible de charger vos informations. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof CandidatInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1000000) {
        setError('La taille du fichier ne peut pas être supérieure à 1 Mo.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for API
      const updateData: Partial<CandidatResponse> = {
        cne: formData.cne,
        cin: formData.cin,
        nomCandidatAr: formData.nomCandidatAr,
        prenomCandidatAr: formData.prenomCandidatAr,
        adresse: formData.adresse,
        sexe: formData.sexe,
        villeDeNaissance: formData.villeDeNaissance,
        villeDeNaissanceAr: formData.villeDeNaissanceAr,
        ville: formData.ville,
        dateDeNaissance: formData.dateDeNaissance,
        telCandidat: formData.telCandidat,
        pays: formData.pays,
        fonctionnaire: formData.fonctionnaire
      };

      await updateCandidatInfo(updateData);
      setSuccess('Vos informations ont été mises à jour avec succès.');

      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          nom: formData.nom,
          prenom: formData.prenom
        }));
      }
    } catch (err: unknown) {
      console.error('Error updating candidat info:', err);
      const apiError = err as ApiError;
      setError(apiError.friendlyMessage || "Une erreur s'est produite lors de la mise à jour. Revérifiez vos données ou réessayez plus tard.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement de vos informations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations Personnelles</h2>
          <p className="text-gray-500">Gérez vos données personnelles et votre profil</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Photo Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Photo de profil</CardTitle>
            <CardDescription>Importez une photo d'identité (Taille max: 1 Mo)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-2 border-gray-200">
                  <AvatarImage src={previewUrl || formData.pathPhoto} />
                  <AvatarFallback className="text-xl bg-gray-100 text-gray-600">
                    {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>
              <div className="flex-1">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/bmp"
                  onChange={handleFileSelect}
                  className="max-w-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés: PNG, JPEG, BMP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Identité</CardTitle>
            <CardDescription>Vos informations d'identité officielles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cin" className="text-sm font-medium">
                  CIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cin"
                  value={formData.cin}
                  onChange={(e) => handleInputChange('cin', e.target.value)}
                  placeholder="AB123456"
                  maxLength={12}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cne" className="text-sm font-medium">
                  CNE <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cne"
                  value={formData.cne}
                  onChange={(e) => handleInputChange('cne', e.target.value)}
                  placeholder="R123456789"
                  maxLength={12}
                  required
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomAr" className="text-sm font-medium">
                  الاسم العائلي (Nom en arabe)
                </Label>
                <Input
                  id="nomAr"
                  value={formData.nomCandidatAr}
                  onChange={(e) => handleInputChange('nomCandidatAr', e.target.value)}
                  placeholder="الاسم العائلي"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenomAr" className="text-sm font-medium">
                  الاسم الشخصي (Prénom en arabe)
                </Label>
                <Input
                  id="prenomAr"
                  value={formData.prenomCandidatAr}
                  onChange={(e) => handleInputChange('prenomCandidatAr', e.target.value)}
                  placeholder="الاسم الشخصي"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance" className="text-sm font-medium">
                  Date de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateDeNaissance}
                  onChange={(e) => handleInputChange('dateDeNaissance', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexe" className="text-sm font-medium">
                  Sexe <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Masculin</SelectItem>
                    <SelectItem value="f">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Adresse et Contact</CardTitle>
            <CardDescription>Vos coordonnées de contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="villeNaissance" className="text-sm font-medium">
                  Lieu de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="villeNaissance"
                  value={formData.villeDeNaissance}
                  onChange={(e) => handleInputChange('villeDeNaissance', e.target.value)}
                  placeholder="Ville de naissance"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="villeNaissanceAr" className="text-sm font-medium">
                  مكان الازدياد (Lieu en arabe)
                </Label>
                <Input
                  id="villeNaissanceAr"
                  value={formData.villeDeNaissanceAr}
                  onChange={(e) => handleInputChange('villeDeNaissanceAr', e.target.value)}
                  placeholder="مكان الازدياد"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-sm font-medium">
                  Adresse de résidence <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Votre adresse complète"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville" className="text-sm font-medium">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  placeholder="Ville actuelle"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-sm font-medium">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telCandidat}
                  onChange={(e) => handleInputChange('telCandidat', e.target.value)}
                  placeholder="0612345678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays" className="text-sm font-medium">
                  Pays <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.pays} onValueChange={(value) => handleInputChange('pays', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.country} value={c.country}>
                        {c.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fonctionnaire" className="text-sm font-medium">
                  Fonctionnaire <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.fonctionnaire} onValueChange={(value) => handleInputChange('fonctionnaire', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
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
    </div>
  );
};

export default InfoPersonnellesPage;
