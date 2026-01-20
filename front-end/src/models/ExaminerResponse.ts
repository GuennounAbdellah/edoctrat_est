import { Sujet } from './Sujet';
import { Candidat } from './Candidat';

export interface ExaminerResponse {
  id: number;
  sujet: Sujet;
  cne: string;
  noteDossier: number;
  noteEntretien: number;
  decision: string;
  commission: number;
  candidat: Candidat;
  publier: boolean;
}
