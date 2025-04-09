import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { WalletAccount } from '../../models/wallet.model';

export interface WalletAccountWithId extends WalletAccount {
  id: string;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DecimalPipe]
})
export default class WalletComponent implements OnInit {
  private walletService = inject(WalletService);
  private decimalPipe = inject(DecimalPipe);

  wallet: WalletAccountWithId[] = [];

  isModalOpen = false;
  isEditModalOpen = false;

  newAccount: WalletAccount = new WalletAccount('', 0);
  editedAccount: WalletAccount = new WalletAccount('', 0);
  editedId: string | null = null;

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;
  readonly year = '2024';
  readonly month = '01';

  ngOnInit() {
    this.loadWallet();
  }

  loadWallet() {
    this.walletService.getWallet(this.userId, this.year, this.month).subscribe({
      next: (data) => {
        this.wallet = Object.entries(data).map(([id, item]) => ({ id, ...item }));
      },
      error: (err) => {
        console.error('Error al cargar la cartera:', err);
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newAccount = new WalletAccount('', 0);
  }

  addAccount() {
    if (!this.newAccount.tipo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.walletService.addAccount(this.userId, this.year, this.month, this.newAccount).subscribe({
      next: () => {
        this.loadWallet();
        this.closeModal();
      },
    });
  }

  openEditModal(id: string) {
    const original = this.wallet.find(w => w.id === id);
    if (!original) return;

    this.editedAccount = new WalletAccount(original.tipo, original.valor);
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedAccount = new WalletAccount('', 0);
    this.editedId = null;
  }

  saveEditedAccount() {
    if (!this.editedId) return;

    this.walletService.updateAccount(this.userId, this.year, this.month, this.editedId, this.editedAccount).subscribe({
      next: () => {
        this.loadWallet();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar cuenta:', err);
      },
    });
  }

  deleteAccount(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta cuenta?');
    if (!confirmDelete) return;

    this.walletService.deleteAccount(this.userId, this.year, this.month, id).subscribe({
      next: () => {
        this.loadWallet();
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
      },
    });
  }

  getTotalWallet(): number {
    return this.wallet.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
