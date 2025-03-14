export class Debt {
  constructor(
    public acreedor: string,
    public fecha_deuda: string,
    public fecha_pago: string,
    public valor: number,
    public estado: string
  ) {}
}
