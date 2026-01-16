import { Candidat } from './Candidat';
import { Sujet } from './Sujet';

export interface Postuler {
  pathFile: string | undefined;
  sujet: Sujet;
  candidat : Candidat;
  id: number;
}
