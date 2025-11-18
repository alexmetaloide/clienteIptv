
export enum Plan {
  '1_TELA' = '1 TELA',
  '2_TELAS' = '2 TELAS',
  '1_TELA_YTP' = '1 TELA + YouTube_P',
  '2_TELAS_YTP' = '2 TELAS + YouTube_P'
}

export enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo'
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  plan: Plan;
  monthlyValue: number;
  dueDate: number;
  status: Status;
}
