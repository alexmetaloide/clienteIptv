
export interface Plan {
  id: string;
  name: string;
  price: number;
}

export enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo'
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  plan: string; // Plan name
  monthlyValue: number;
  dueDate: number;
  status: Status;
}
