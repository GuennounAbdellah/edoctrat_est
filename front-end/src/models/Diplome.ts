import { Annexe } from './Annexe';

export interface Diplome {
  id: number;
  intitule: string;
  type: string;
  dateCommission: string;
  mention: string;
  pays: string;
  etablissement: string;
  specialite: string;
  ville: string;
  province: string;
  moyen_generale: number;
  annexes: Annexe[];
}
