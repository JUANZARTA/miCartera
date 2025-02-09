import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule], // ✅ Importamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DecimalPipe] // ✅ Agregamos DecimalPipe para formatear valores
})
export default class WalletComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de cuentas con su respectivo saldo
  wallet = [
    { name: 'Efectivo', value: 500000 },
    { name: 'Bancolombia', value: 1200000 },
    { name: 'Daviplata', value: 300000 },
    { name: 'Nequi', value: 450000 }
  ];

  // 🔹 Método para calcular el total disponible
  getTotalWallet(): number {
    return this.wallet.reduce((sum, account) => sum + account.value, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
