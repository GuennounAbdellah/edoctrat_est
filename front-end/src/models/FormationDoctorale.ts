

import { CED } from './CED';

export interface FormationDoctorale {

    id: number;
    ced: CED ;
    etablissement: number;
    axeDeRecherche: string;
    pathImage: string;
    titre: string;
    initiale: string;
    dateAccreditation: string;

}