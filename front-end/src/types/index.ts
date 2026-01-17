// User roles enum
export enum UserRole {
  CANDIDAT = 'candidat',
  PROFESSEUR = 'professeur',
  DIRECTEUR_CED = 'directeur_ced',
  DIRECTEUR_LABO = 'directeur_labo',
  DIRECTEUR_POLE = 'directeur_pole',
  SCOLARITE = 'scolarite',
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  avatar?: string;
}

export interface Formation {
  id: string;
  nom: string;
  description: string;
  responsable: string;
  laboratoire: string;
}

export interface Laboratoire {
  id: string;
  nom: string;
  description: string;
  directeur: string;
  etablissement: string;
  nombreDoctorants: number;
}

export interface Sujet {
  id: string;
  titre: string;
  description: string;
  professeur: string;
  laboratoire: string;
  status: 'disponible' | 'pris' | 'ferme';
}

export interface Calendrier {
  id: string;
  titre: string;
  dateDebut: Date;
  dateFin: Date;
  type: 'inscription' | 'candidature' | 'soutenance' | 'commission';
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  date: Date;
  lu: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
