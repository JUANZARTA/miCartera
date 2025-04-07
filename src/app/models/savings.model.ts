export class Saving {
  constructor(
    public tipo: string,
    public valor: number
  ) {}
}

export interface SavingWithId extends Saving {
  id: string;
}
