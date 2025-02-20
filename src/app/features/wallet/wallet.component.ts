import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DecimalPipe]
})
export default class WalletComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  wallet: any[] = [];
  isModalOpen: boolean = false;

  newAccount = {
    tipo: '',
    valor: 0
  };

  editingIndex: number | null = null;
  editingField: string = '';

  ngOnInit() {
    this.loadWallet();
  }

  loadWallet() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        this.wallet = data.cartera;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addAccount() {
    this.wallet.push({ ...this.newAccount });
    this.closeModal();
  }

  getTotalWallet(): number {
    return this.wallet.reduce((sum, account) => sum + account.valor, 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  saveEdit() {
    this.editingIndex = null;
    this.editingField = '';
  }
}
