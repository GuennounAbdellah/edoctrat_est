import { apiClient } from './api';
import { Diplome } from '@/models/Diplome';

// Response interfaces
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
  situation_familiale: string | undefined;
  fonctionnaire: string | undefined;
}

export interface DiplomeResponse {
  id: number;
  intitule: string;
  type: string;
  dateCommission: string;
  mention: string;
  pays: string;
  etablissement: string;
  specialite: string;
  ville: string;
  province: string;
  moyen_generale: number;
  annexes: unknown[];
}

export interface ResultDTO<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface ConfigResponse {
  maxSujetPostuler: number;
  dateDebutPostulerSujetCandidat: string;
  dateFinPostulerSujetCandidat: string;
  dateDebutModifierSujetProf: string;
  dateFinModifierSujetProf: string;
}

export interface NotificationResponse {
  id: number;
  sujet?: { titre: string };
  sujetTitre?: string;
  dateCommission?: string;
  heure?: string;
  lieu?: string;
  commission?: {
    dateCommission: string;
    heure: string;
    lieu: string;
  };
}

export interface PostulationResponse {
  id: number;
  sujet?: {
    id: number;
    titre: string;
    professeur?: { nom: string; prenom: string };
    formationDoctorale?: { titre: string; ced?: { titre: string } };
    laboratoire?: string;
  };
  sujetId?: number;
  sujetTitre?: string;
  professeurNom?: string;
  professeurPrenom?: string;
  pathFile?: string;
  etat?: string;
  accepted?: boolean;
  rejected?: boolean;
  selected?: boolean;
}

export interface SujetResponse {
  id: number;
  titre?: string;
  intitule?: string;
  professeurNom?: string;
  professeurPrenom?: string;
  professeur?: { nom: string; prenom: string };
  formationDoctoraleTitre?: string;
  formationDoctorale?: { titre: string; ced?: { titre: string } };
  cedTitre?: string;
  laboratoireTitre?: string;
  laboratoire?: string;
}

// Candidat Info API calls
export const getCandidatInfo = async (): Promise<CandidatResponse> => {
  const response = await apiClient.get<CandidatResponse>('/api/candidat-info/');
  return response.data;
};

export const updateCandidatInfo = async (data: Partial<CandidatResponse>): Promise<CandidatResponse> => {
  const response = await apiClient.put<CandidatResponse>('/api/candidat-info/', data);
  return response.data;
};

// Diplome/Parcours API calls
export const getCandidatParcours = async (): Promise<ResultDTO<DiplomeResponse>> => {
  const response = await apiClient.get<ResultDTO<DiplomeResponse>>('/api/candidat-parcours/');
  return response.data;
};

export const addDiplome = async (diplome: Partial<Diplome>): Promise<ResultDTO<DiplomeResponse>> => {
  const response = await apiClient.post<ResultDTO<DiplomeResponse>>('/api/candidat-parcours/', diplome);
  return response.data;
};

export const updateDiplome = async (id: number, diplome: Partial<Diplome>): Promise<DiplomeResponse> => {
  const response = await apiClient.patch<DiplomeResponse>(`/api/candidat-parcours/${id}/`, diplome);
  return response.data;
};

export const deleteDiplome = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/candidat-parcours/${id}/`);
};

// Configuration API calls
export const getBaseConfig = async (): Promise<ConfigResponse> => {
  const response = await apiClient.get<ConfigResponse>('/api/get-base-config/');
  return response.data;
};

// Notifications API calls
export const getCandidatNotifications = async (): Promise<ResultDTO<NotificationResponse>> => {
  const response = await apiClient.get<ResultDTO<NotificationResponse>>('/api/get-candidat-notifications');
  return response.data;
};

// Postulations API calls
export const getCandidatPostulations = async (): Promise<ResultDTO<PostulationResponse>> => {
  const response = await apiClient.get<ResultDTO<PostulationResponse>>('/api/candidat-postules/');
  return response.data;
};

export const createPostulation = async (sujetId: number): Promise<PostulationResponse> => {
  const response = await apiClient.post<PostulationResponse>('/api/candidat-postules/', { sujet: sujetId });
  return response.data;
};

export const deletePostulation = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/candidat-postules/${id}`);
};

// Published subjects API calls
export const getPublishedSubjects = async (limit = 10, offset = 0): Promise<ResultDTO<SujetResponse>> => {
  const response = await apiClient.get<ResultDTO<SujetResponse>>(`/api/get-published-subjects?limit=${limit}&offset=${offset}`);
  return response.data;
};

export default {
  getCandidatInfo,
  updateCandidatInfo,
  getCandidatParcours,
  addDiplome,
  updateDiplome,
  deleteDiplome,
  getBaseConfig,
  getCandidatNotifications,
  getCandidatPostulations,
  createPostulation,
  deletePostulation,
  getPublishedSubjects
};
