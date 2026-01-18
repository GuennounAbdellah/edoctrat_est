import { api } from './api';

const BASE_URL = '/api/directeur-labo';

export const DirecteurLaboService = {
  // Candidats endpoints
  getAllCandidats: async () => {
    try {
      const response = await api.get(`${BASE_URL}/candidats`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching candidats:', error);
      return { results: [] };
    }
  },

  getCandidatById: async (id: number) => {
    try {
      const response = await api.get(`${BASE_URL}/candidats/${id}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidat ${id}:`, error);
      throw error;
    }
  },

  // Sujets endpoints
  getAllSujets: async () => {
    try {
      const response = await api.get(`${BASE_URL}/sujets`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching sujets:', error);
      return { results: [] };
    }
  },

  createSujet: async (sujetData: Record<string, unknown>) => {
    try {
      const response = await api.post(`${BASE_URL}/sujets`, sujetData, {});
      return response.data;
    } catch (error) {
      console.error('Error creating sujet:', error);
      throw error;
    }
  },

  updateSujet: async (id: number, sujetData: Record<string, unknown>) => {
    try {
      const response = await api.put(`${BASE_URL}/sujets/${id}`, sujetData, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating sujet ${id}:`, error);
      throw error;
    }
  },

  deleteSujet: async (id: number) => {
    try {
      const response = await api.delete(`${BASE_URL}/sujets/${id}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error deleting sujet ${id}:`, error);
      throw error;
    }
  },

  // Commissions endpoints
  getAllCommissions: async () => {
    try {
      const response = await api.get(`${BASE_URL}/commissions`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching commissions:', error);
      return { results: [] };
    }
  },

  createCommission: async (commissionData: Record<string, unknown>) => {
    try {
      const response = await api.post(`${BASE_URL}/commissions`, commissionData, {});
      return response.data;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  },

  updateCommission: async (id: number, commissionData: Record<string, unknown>) => {
    try {
      const response = await api.put(`${BASE_URL}/commissions/${id}`, commissionData, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating commission ${id}:`, error);
      throw error;
    }
  },

  validateCommission: async (id: number, validationData: Record<string, unknown>) => {
    try {
      const response = await api.put(`${BASE_URL}/commissions/${id}/validate`, validationData, {});
      return response.data;
    } catch (error) {
      console.error(`Error validating commission ${id}:`, error);
      throw error;
    }
  },

  // Laboratoire endpoints
  getLaboCandidats: async () => {
    try {
      const response = await api.get(`${BASE_URL}/labo/candidats`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching labo candidats:', error);
      return { results: [] };
    }
  },

  getLaboProfesseurs: async () => {
    try {
      const response = await api.get(`${BASE_URL}/labo/professeurs`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching labo professeurs:', error);
      return { results: [] };
    }
  },

  // Results endpoints
  getAllResults: async () => {
    try {
      const response = await api.get(`${BASE_URL}/results`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      return { results: [] };
    }
  },

  updateResult: async (id: number, resultData: Record<string, unknown>) => {
    try {
      const response = await api.put(`${BASE_URL}/results/${id}`, resultData, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating result ${id}:`, error);
      throw error;
    }
  },

  // PV (Procès-Verbal) endpoints
  downloadPV: async (format: 'pdf' | 'excel') => {
    try {
      const response = await api.get(`${BASE_URL}/pv/download?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading PV in ${format} format:`, error);
      throw error;
    }
  },

  // Preselection endpoints
  getPreselectionCandidats: async () => {
    try {
      const response = await api.get(`${BASE_URL}/preselection`, {});
      return response.data;
    } catch (error) {
      console.error('Error fetching preselection candidats:', error);
      return { results: [] };
    }
  },

  updatePreselectionStatus: async (candidatId: number, status: Record<string, unknown>) => {
    try {
      const response = await api.put(`${BASE_URL}/preselection/${candidatId}`, status, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating preselection status for candidat ${candidatId}:`, error);
      throw error;
    }
  }
};
