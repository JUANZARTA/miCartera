import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DecimalPipe]
})
export default class WalletComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  wallet: any[] = [];

  ngOnInit() {
    this.loadWallet();
  }

  // 🔹 Cargar los datos de la cartera desde `data.json`
  loadWallet() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ JSON de cartera cargado:', data);
        this.wallet = data.cartera;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON de cartera:', err);
      }
    });
  }

  // 🔹 Método para calcular el total disponible
  getTotalWallet(): number {
    return this.wallet.reduce((sum, account) => sum + account.valor, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
