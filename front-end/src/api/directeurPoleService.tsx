import { api } from './api';
import { Postuler } from '../models/Postuler';
import { Sujet } from '../models/Sujet';
import { Commission } from '../models/Commission';
import { Inscription } from '../models/Inscription';
import Result from '../models/Result';

// Interface for DirecteurPoleCalendrier (specific to DirecteurPole)
export interface DirecteurPoleCalendrier {
  id: number;
  action: string;
  dateDebut: string;
  dateFin: string;
  pour: string;
}

/**
 * Get all candidats (postulations)
 * GET /api/get-all-candidats/
 */
export const getAllCandidats = async (): Promise<Result<Postuler>> => {
  const response = await api.get('/api/get-all-candidats/', {});
  return response.data as Result<Postuler>;
};

/**
 * Get all sujets
 * GET /api/get-all-sujets/
 */
export const getAllSujets = async (): Promise<Result<Sujet>> => {
  const response = await api.get('/api/get-all-sujets/', {});
  return response.data as Result<Sujet>;
};

/**
 * Get all commissions
 * GET /api/get-all-commissions/
 */
export const getAllCommissions = async (): Promise<Result<Commission>> => {
  const response = await api.get('/api/get-all-commissions/', {});
  return response.data as Result<Commission>;
};

/**
 * Get all inscriptions
 * GET /api/get-all-inscriptions/
 */
export const getAllInscriptions = async (): Promise<Result<Inscription>> => {
  const response = await api.get('/api/get-all-inscriptions/', {});
  return response.data as Result<Inscription>;
};

/**
 * Publish all sujets
 * PATCH /api/publier-sujets/
 */
export const publierSujets = async (): Promise<{ message: string }> => {
  const response = await api.put('/api/publier-sujets/', {}, {});
  return response.data as { message: string };
};

/**
 * Publish the waiting list (liste d'attente)
 * POST /api/publier-liste-attente/
 */
export const publierListeAttente = async (): Promise<{ message: string }> => {
  const response = await api.post('/api/publier-liste-attente/', {}, {});
  return response.data as { message: string };
};

/**
 * Publish the main list (liste principale)
 * POST /api/publier-liste-principale/
 */
export const publierListePrincipale = async (): Promise<{ message: string }> => {
  const response = await api.post('/api/publier-liste-principale/', {}, {});
  return response.data as { message: string };
};

/**
 * Get calendrier for professeur/directeur pole
 * GET /api/professeur/calendrier
 */
export const getCalendrier = async (): Promise<DirecteurPoleCalendrier[]> => {
  const response = await api.get('/api/professeur/calendrier', {});
  return response.data as DirecteurPoleCalendrier[];
};

// Export all functions as a service object for convenience
const directeurPoleService = {
  getAllCandidats,
  getAllSujets,
  getAllCommissions,
  getAllInscriptions,
  publierSujets,
  publierListeAttente,
  publierListePrincipale,
  getCalendrier,
};

export default directeurPoleService;
