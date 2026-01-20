import { Candidat } from '@/models/Candidat';
import { Sujet } from '@/models/Sujet';

// Response interface matching backend ResultDTO
export interface ResultDTO<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Define Inscription interface based on backend InscriptionResponse
export interface Inscription {
  id: number;
  candidat: Candidat;
  sujet: Sujet;
  dateDiposeDossier: string;
  remarque: string;
  valider: boolean;
  pathFile: string;
}
