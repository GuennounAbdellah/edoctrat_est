import { Professeur } from './Professeur';
import { FormationDoctorale } from './FormationDoctorale';

export interface SujetResponse {
  id: number;
  titre: string;
  description: string;
  motsCles: string;
  dateDepot: string;
  publier: boolean;
  pathFile: string;
  professeur: Professeur;
  formationDoctorale: FormationDoctorale;
  coDirecteur?: Professeur | null;  // Optional coDirecteur field from backend
}