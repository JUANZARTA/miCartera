export class Loan {
  constructor(
    public deudor: string,
    public fecha_prestamo: string,
    public fecha_pago: string,
    public valor: number,
    public estado: 'Pendiente' | 'Pagado'
  ) {}
}

export interface LoanWithId extends Loan {
  id: string;
}
