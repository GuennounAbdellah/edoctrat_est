import api from './api';
import { Sujet } from '@/models/Sujet';
import { SujetResponse } from '@/models/SujetResponse';
import { Commission } from '@/models/Commission';
import { Examiner } from '@/models/Examiner';
import { ExaminerResponse } from '@/models/ExaminerResponse';
import { FormationDoctorale } from '@/models/FormationDoctorale';
import { Professeur } from '@/models/Professeur';
import { Inscription } from '@/models/Inscription';
import { Postuler } from '@/models/Postuler';

// Result interface for paginated responses
interface ResultResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const ProfesseurService = {
  // Get formations doctorales
  getFormationsDoctorales: async (): Promise<ResultResponse<FormationDoctorale>> => {
    try {
      const response = await api.get<ResultResponse<FormationDoctorale>>('/api/formations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching formations doctorales:', error);
      throw error;
    }
  },

  // Get all professeurs
  getProfesseurs: async (): Promise<ResultResponse<Professeur>> => {
    try {
      const response = await api.get<ResultResponse<Professeur>>('/api/get-professeurs/');
      return response.data;
    } catch (error) {
      console.error('Error fetching professeurs:', error);
      throw error;
    }
  },

  // Get sujets for current professeur
  getSujets: async (): Promise<ResultResponse<SujetResponse>> => {
    try {
      const response = await api.get<ResultResponse<SujetResponse>>('/api/sujets/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sujets:', error);
      throw error;
    }
  },

  // Get sujet by ID
  getSujetById: async (id: number): Promise<SujetResponse> => {
    try {
      const response = await api.get<SujetResponse>(`/api/sujets/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sujet:', error);
      throw error;
    }
  },

  // Create a new sujet
  createSujet: async (sujet: {
    titre: string;
    description: string;
    formationDoctorale?: number;
    coDirecteur?: number;
  }): Promise<SujetResponse> => {
    try {
      const response = await api.post<SujetResponse>('/api/sujets/', sujet);
      return response.data;
    } catch (error) {
      console.error('Error creating sujet:', error);
      throw error;
    }
  },

  // Update a sujet
  updateSujet: async (id: number, sujet: {
    titre?: string;
    description?: string;
    formationDoctorale?: number;
    coDirecteur?: number;
  }): Promise<SujetResponse> => {
    try {
      const response = await api.put<SujetResponse>(`/api/sujets/${id}/`, sujet);
      return response.data;
    } catch (error) {
      console.error('Error updating sujet:', error);
      throw error;
    }
  },

  // Delete a sujet
  deleteSujet: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/sujets/${id}/`);
    } catch (error) {
      console.error('Error deleting sujet:', error);
      throw error;
    }
  },

  // Get commissions for current professeur (participant)
  getCommissions: async (): Promise<ResultResponse<Commission>> => {
    try {
      const response = await api.get<ResultResponse<Commission>>('/api/participant/');
      return response.data;
    } catch (error) {
      console.error('Error fetching commissions:', error);
      throw error;
    }
  },

  // Get examiner results for current professeur
  getResultats: async (limit?: number, offset?: number): Promise<ResultResponse<ExaminerResponse>> => {
    try {
      let url = '/api/examiner/';
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get<ResultResponse<ExaminerResponse>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching resultats:', error);
      throw error;
    }
  },

  // Get inscriptions for current professeur's sujets
  getInscrits: async (limit?: number, offset?: number): Promise<ResultResponse<Inscription>> => {
    try {
      let url = '/api/inscrits/';
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get<ResultResponse<Inscription>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching inscrits:', error);
      throw error;
    }
  },

  // Get candidats who applied to professeur's sujets
  getCandidats: async (limit?: number, offset?: number): Promise<ResultResponse<Postuler>> => {
    try {
      let url = '/api/get-professeur-candidats/';
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get<ResultResponse<Postuler>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidats:', error);
      throw error;
    }
  },
};

export default ProfesseurService;
