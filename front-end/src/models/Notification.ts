import { Commission } from "./Commission";
import { Sujet } from "./Sujet";


export interface Notification {

    id:number;
    commission:Commission;
    sujet:Sujet;
    type:string;

}