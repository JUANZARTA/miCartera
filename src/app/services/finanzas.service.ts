import { Injectable, inject } from '@angular/core';
import { IncomeService } from './income.service';
import { ExpenseService } from './expense.service';
import { WalletService } from './wallet.service';
import { LoanService } from './loans.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FinancialStatusResult {
  estado: string;
  color: 'verde' | 'rojo' | 'azul';
  cuadre: number;
  estimacionGastosMes: number;
  estimacionDineroRestanteMes: number;
  gastadoActualmente: number;
  restanteActualmente: number;
  restanteTotal: number;
  diferenciaSaldo: number;
}

@Injectable({
  providedIn: 'root',
})
export class FinanzasService {
  private incomeService = inject(IncomeService);
  private expenseService = inject(ExpenseService);
  private walletService = inject(WalletService);
  private loansService = inject(LoanService);

  getFinancialStatus(userId: string, year: string, month: string): Observable<FinancialStatusResult> {
    return forkJoin({
      incomes: this.incomeService.getIncomes(userId, year, month),
      expenses: this.expenseService.getExpenses(userId, year, month),
      wallet: this.walletService.getWallet(userId, year, month),
      loans: this.loansService.getLoans(userId, year, month),
    }).pipe(
      map(({ incomes, expenses, wallet, loans }) => {
        const ingresos = Object.values(incomes || {});
        const gastos = Object.values(expenses || {});
        const walletData = Object.values(wallet || {});
        const prestamos = Object.values(loans || {});

        const ingresoTotal = ingresos.reduce((a: number, i: any) => a + (i.valor || 0), 0);
        const gastoTotal = gastos.reduce((a: number, g: any) => a + (g.valor || 0), 0);
        const walletTotal = walletData.reduce((a: number, w: any) => a + (w.valor || 0), 0);
        const prestadoTotal = prestamos.reduce((a: number, l: any) => a + (l.valor || 0), 0);

        const prestadoActual = prestamos
          .filter((l: any) => l.estado !== 'Pagado')
          .reduce((a: number, l: any) => a + (l.valor || 0), 0);

        const restante = ingresoTotal - gastoTotal;
        const diferencia = walletTotal + prestadoTotal - restante;

        let estado: string;
        let color: 'verde' | 'rojo' | 'azul';

        if (diferencia > 0) {
          estado = `Tienes ${this.formatCurrency(diferencia)} sin justificar. Puede ser un ingreso no registrado.`;
          color = 'azul';
        } else if (diferencia < 0) {
          estado = `Tienes un descuadre de ${this.formatCurrency(Math.abs(diferencia))}. Revisa tus ingresos, gastos o cartera.`;
          color = 'rojo';
        } else {
          estado = 'Tus cuentas están al día. Todo cuadra perfectamente.';
          color = 'verde';
        }

        const estimacionGastosMes = gastos.reduce((a: number, g: any) => a + (g.estimacion || 0), 0);
        const estimacionDineroRestanteMes = ingresoTotal - estimacionGastosMes;
        const gastadoActualmente = gastoTotal;
        const restanteActualmente = ingresoTotal - gastoTotal - prestadoActual;
        const restanteTotal = ingresoTotal - gastoTotal;
        const diferenciaSaldo = estimacionDineroRestanteMes - restanteActualmente;

        return {
          estado,
          color,
          cuadre: diferencia,
          estimacionGastosMes,
          estimacionDineroRestanteMes,
          gastadoActualmente,
          restanteActualmente,
          restanteTotal,
          diferenciaSaldo,
        };
      })
    );
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-EC').format(value);
  }
}
