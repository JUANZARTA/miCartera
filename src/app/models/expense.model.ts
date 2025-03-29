export enum CategoriaGasto {
    Fijo = 'Fijo',
    Variable = 'Variable',
    Otro = 'Otro',
    Emergencia = 'Emergencia'
  }
  
  export class Expense {
    constructor(
      public descripcion: string,
      public categoria: CategoriaGasto,
      public valor: number,
      public estimacion: number
    ) {}
  }
  