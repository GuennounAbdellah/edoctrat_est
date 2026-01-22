export interface DirecteurLabo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  departement: string;
  laboratoireId?: number;
  laboratoireNom?: string;
  laboratoireDescription?: string;
}