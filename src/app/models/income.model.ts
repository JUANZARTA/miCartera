export enum CategoriaIngreso {
  Fijo = 'Fijo',
  Variable = 'Variable',
  Otro = 'Otro'
}

export class Income {
  constructor(
    public nombre: string,
    public categoria: CategoriaIngreso,
    public valor: number
  ) {}
}

export interface IncomeWithId extends Income {
  id: string;
}
