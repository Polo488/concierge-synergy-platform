
export type ClientStatus = 
  | "prospection" 
  | "contact_initial" 
  | "proposition_envoyee" 
  | "negociation" 
  | "signe" 
  | "termine" 
  | "abandonne";

export type ClientType = 
  | "particulier" 
  | "entreprise" 
  | "agence_relocation" 
  | "partenaire";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: ClientType;
  status: ClientStatus;
  notes?: string;
  contactDate: string;
  lastContactDate: string;
  assignedTo?: string;
  potentialValue?: number | null;
}
