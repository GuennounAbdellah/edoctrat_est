import { Professeur } from "./Professeur";
import { Sujet } from "./Sujet";


export interface Commission {

   id:number;
   dateCommission:string;
   heure:string; 
   valider:boolean;
   lieu:string;
   labo:number; 
   participants:Professeur[];
   sujets: Sujet[];
}