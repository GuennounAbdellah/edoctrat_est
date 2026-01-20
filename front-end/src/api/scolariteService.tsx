import { api } from './api';
import { CandidatResponse } from '../models/CandidatResponse';
import Result from '../models/Result';

/**
 * Interface for updating candidat dossier status
 */
export interface UpdateDossierRequest {
  etatDossier?: number;
  commentaireScolarite?: string;
}

/**
 * Get all candidats for scolarite validation
 * GET /api/scolarite/
 */
export const getScolariteCandidats = async (
  limit?: number,
  offset?: number
): Promise<Result<CandidatResponse>> => {
  let url = '/api/scolarite/';
  const params = new URLSearchParams();
  
  if (limit !== undefined) {
    params.append('limit', limit.toString());
  }
  if (offset !== undefined) {
    params.append('offset', offset.toString());
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url, {});
  return response.data as Result<CandidatResponse>;
};

/**
 * Update candidat dossier status (validate or invalidate)
 * PATCH /api/scolarite/{id}/
 * @param id - Candidat ID
 * @param data - Object containing etatDossier (1 = valid, 0 = invalid)
 */
export const updateCandidatDossier = async (
  id: number,
  data: UpdateDossierRequest
): Promise<CandidatResponse> => {
  const response = await api.patch(`/api/scolarite/${id}/`, data, {});
  return response.data as CandidatResponse;
};

/**
 * Validate a candidat's dossier
 * @param id - Candidat ID
 * @param commentaire - Optional comment from scolarite
 */
export const validerDossier = async (id: number, commentaire?: string): Promise<CandidatResponse> => {
  return updateCandidatDossier(id, { etatDossier: 1, commentaireScolarite: commentaire });
};

/**
 * Invalidate a candidat's dossier
 * @param id - Candidat ID
 * @param commentaire - Optional comment from scolarite
 */
export const invaliderDossier = async (id: number, commentaire?: string): Promise<CandidatResponse> => {
  return updateCandidatDossier(id, { etatDossier: 0, commentaireScolarite: commentaire });
};

/**
 * Update only the comment on a candidat's dossier
 * @param id - Candidat ID
 * @param commentaire - Comment from scolarite
 */
export const updateCommentaire = async (id: number, commentaire: string): Promise<CandidatResponse> => {
  return updateCandidatDossier(id, { commentaireScolarite: commentaire });
};

// Export all functions as a service object for convenience
const scolariteService = {
  getScolariteCandidats,
  updateCandidatDossier,
  validerDossier,
  invaliderDossier,
  updateCommentaire,
};

export default scolariteService;
