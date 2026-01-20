export interface CandidatResponse {
    id: number;
    cne: string;
    pays: string;
    nom: string;
    prenom: string;
    email: string;
    cin: string;
    nomCandidatAr: string | undefined;
    prenomCandidatAr: string | undefined;
    adresse: string;
    adresseAr: string | undefined;
    sexe: string;
    villeDeNaissance: string;
    villeDeNaissanceAr: string | undefined;
    ville: string;
    dateDeNaissance: string;
    typeDeHandiCape: string;
    academie: string | undefined;
    telCandidat: string;
    pathCv: string | undefined;
    pathPhoto: string | undefined;
    etatDossier: number | undefined;
    commentaireScolarite: string | undefined;
    situation_familiale: string | undefined;
    fonctionnaire: string | undefined;
    sujetPostule: string;
    directeurNom: string;
    directeurPrenom: string;
    codirecteurNom: string;       // Peut être null
    codirecteurPrenom: string;    // Peut être null
    formationDoctorale: string;
}
