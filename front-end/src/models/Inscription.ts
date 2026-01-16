import { Candidat } from "./Candidat";
import { Sujet } from "./Sujet";


export interface Inscription {

    id: number;
    candidat: Candidat;
    sujet: Sujet;
    dateDiposeDossier: string;
    remarque: string;
    valider: boolean;
    pathFile: string;

}