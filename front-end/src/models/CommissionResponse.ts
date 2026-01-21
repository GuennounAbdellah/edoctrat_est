export interface CommissionResponse {
  id: number;
  dateCommission: string;
  heure: string;
  valider: boolean;
  lieu: string;
  labo: number;
  participants: unknown[];
  sujets: unknown[];
}