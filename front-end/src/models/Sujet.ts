import { FormationDoctorale } from "./FormationDoctorale";
import { Professeur } from "./Professeur";


export interface Sujet {
    
    id: number;
    professeur: Professeur;
    coDirecteur: Professeur | null;
    titre: string;
    description: string;
    formationDoctorale: FormationDoctorale;
    publier: boolean;

}