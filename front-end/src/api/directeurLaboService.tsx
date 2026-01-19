import apiClient from './api';
import { Candidat } from '@/models/Candidat';
import { Sujet } from '@/models/Sujet';
import { Commission } from '@/models/Commission';
import { FormationDoctorale } from '@/models/FormationDoctorale';
import { Examiner } from '@/models/Examiner';
import { Professeur } from '@/models/Professeur';

// Response interfaces matching backend DTOs
interface BaseResponse<T> {
  data: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface ResultResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface CandidatResponse {
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
    sujetPostule: string;
    directeurNom: string;
    directeurPrenom: string;
    codirecteurNom: string;       // Peut être null
    codirecteurPrenom: string;    // Peut être null
    formationDoctorale: string;
}

interface SujetResponse {
  id: number;
  titre: string;
  description: string;
  motsCles: string;
  dateDepot: string;
  publier: boolean;
  pathFile: string;
  professeur: Professeur;
  formationDoctorale: FormationDoctorale;
  coDirecteur?: Professeur | null;  // Optional coDirecteur field from backend
}

interface CommissionResponse {
  id: number;
  dateCommission: string;
  heure: string;
  valider: boolean;
  lieu: string;
  labo: number;
  participants: unknown[];
  sujets: unknown[];
}

interface ExaminerResponse {
  id: number;
  sujet: Sujet;
  cne: string;
  noteDossier: number;
  noteEntretien: number;
  decision: string;
  commission: number;
  candidat: Candidat;
  publier: boolean;
}

interface PostulerJoinedResponse {
  id: number;
  cne: string;
  nom: string;
  prenom: string;
  sujetPostule: string;
  directeurNom: string;
  directeurPrenom: string;
  codirecteurNom: string;
  codirecteurPrenom: string;
  formationDoctorale: string;
}

export const DirecteurLaboService = {

  // Get candidat by ID
  getCandidatById: async (id: number): Promise<CandidatResponse> => {
    try {
      const response = await apiClient.get<CandidatResponse>(`/api/candidat-info/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidat:', error);
      throw error;
    }
  },

  // Get all sujets for labo
  getAllSujets: async (): Promise<ResultResponse<SujetResponse>> => {
    try {
      const response = await apiClient.get<ResultResponse<SujetResponse>>('/api/sujetslabo/');
      console.log('getAllSujets response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sujets:', error);
      throw error;
    }
  },
  // Get sujet by ID
  getSujetById: async (id: number): Promise<SujetResponse> => {
    try {
      const response = await apiClient.get<SujetResponse>(`/api/sujetslabo/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sujet:', error);
      throw error;
    }
  },
  // Create new sujet
  createSujet: async (sujet: Partial<Sujet>): Promise<SujetResponse> => {
    try {
      const response = await apiClient.post<SujetResponse>('/api/sujetslabo/', sujet);
      return response.data;
    } catch (error) {
      console.error('Error creating sujet:', error);
      throw error;
    }
  },

  // Update sujet
  updateSujet: async (id: number, sujet: Partial<Sujet>): Promise<SujetResponse> => {
    try {
      const response = await apiClient.put<SujetResponse>(`/api/sujetslabo/${id}/`, sujet);
      return response.data;
    } catch (error) {
      console.error('Error updating sujet:', error);
      throw error;
    }
  },

  // Delete sujet
  deleteSujet: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/sujetslabo/${id}/`);
    } catch (error) {
      console.error('Error deleting sujet:', error);
      throw error;
    }
  },

  // Get all commissions
  getAllCommissions: async (): Promise<ResultResponse<CommissionResponse>> => {
    try {
      const response = await apiClient.get<ResultResponse<CommissionResponse>>('/api/commission/');
      return response.data;
    } catch (error) {
      console.error('Error fetching commissions:', error);
      throw error;
    }
  },

  // Create new commission
  createCommission: async (commission: Partial<Commission>): Promise<CommissionResponse> => {
    try {
      const response = await apiClient.post<CommissionResponse>('/api/commission/', commission);
      return response.data;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  },

  // Update commission
  updateCommission: async (id: number, commission: Partial<Commission>): Promise<CommissionResponse> => {
    try {
      const response = await apiClient.put<CommissionResponse>(`/api/commission/${id}/`, commission);
      return response.data;
    } catch (error) {
      console.error('Error updating commission:', error);
      throw error;
    }
  },

  // Delete commission
  deleteCommission: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/commission/${id}/`);
    } catch (error) {
      console.error('Error deleting commission:', error);
      throw error;
    }
  },

  // Validate commission
  validateCommission: async (id: number, validationData: { valider: boolean }): Promise<CommissionResponse> => {
    try {
      const response = await apiClient.put<CommissionResponse>(`/api/commission/${id}/`, validationData);
      return response.data;
    } catch (error) {
      console.error('Error validating commission:', error);
      throw error;
    }
  },

  // Get professeurs in labo
  getLaboProfesseurs: async (): Promise<ResultResponse<Professeur>> => {
    try {
      const response = await apiClient.get<ResultResponse<Professeur>>('/api/labo_professeur/');
      return response.data;
    } catch (error) {
      console.error('Error fetching labo professeurs:', error);
      throw error;
    }
  },

  // Get candidats in labo examiners
  getLaboCandidats: async (): Promise<ResultResponse<ExaminerResponse>> => {
    try {
      const response = await apiClient.get<ResultResponse<ExaminerResponse>>('/api/labo_candidat/');
      return response.data;
    } catch (error) {
      console.error('Error fetching labo candidats:', error);
      throw error;
    }
  },

  // Get candidats for a specific sujet
  getSujetCandidats: async (sujetId: number): Promise<ResultResponse<ExaminerResponse>> => {
    try {
      const response = await apiClient.get<ResultResponse<ExaminerResponse>>(`/api/get-sujet-candidat/${sujetId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sujet candidats:', error);
      throw error;
    }
  },

  // Validate examiner
  validateExaminer: async (id: number, validationData: { valider?: boolean; decision?: string }): Promise<ExaminerResponse> => {
    try {
      const response = await apiClient.put<ExaminerResponse>(`/api/labo_valider_examiner/${id}/`, validationData);
      return response.data;
    } catch (error) {
      console.error('Error validating examiner:', error);
      throw error;
    }
  },

  // Send convocation to candidat
  sendConvocation: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/api/convoque-candidat/${id}/`);
    } catch (error) {
      console.error('Error sending convocation:', error);
      throw error;
    }
  },

  // Get candidats with their postulated sujets and related info (joined data)
  getJoinedCandidats: async (): Promise<PostulerJoinedResponse[]> => {
    try {
      const response = await apiClient.get<PostulerJoinedResponse[]>('/api/labo-candidats-joined/');
      console.log('getJoinedCandidats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching joined candidat data:', error);
      throw error;
    }
  },

  // Get all existing formations
  getFormations: async (): Promise<FormationDoctorale[]> => {
    try {
      const response = await apiClient.get<FormationDoctorale[]>('/api/formations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching formations:', error);
      throw error;
    }
  },

};