import { Candidat } from "./Candidat";
import { Commission } from "./Commission";
import { Sujet } from "./Sujet";


export interface Examiner {

    id:number;
    sujet:Sujet;
    cne:string;
    noteDossier:number;
    noteEntretien:number;
    decision:string;
    commission:number;
    candidat:Candidat;
    publier:boolean;

}