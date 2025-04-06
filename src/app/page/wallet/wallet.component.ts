import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { WalletAccount } from '../../models/wallet.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DecimalPipe]
})
export default class WalletComponent implements OnInit {
  // Servicios
  private walletService = inject(WalletService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  wallet: WalletAccount[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Cuenta nueva
  newAccount: WalletAccount = new WalletAccount('', 0);

  // Cuenta en edición
  editedAccount: WalletAccount = new WalletAccount('', 0);
  editedIndex: number | null = null;

  ngOnInit() {
    this.loadWallet();
  }

  // ======================
  // Cargar datos
  // ======================
  loadWallet() {
    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (err) => {
        console.error('Error al cargar la cartera:', err);
      },
    });
  }

  // ======================
  // Modal: Agregar
  // ======================
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

    this.walletService.addAccount({ ...this.newAccount }).subscribe({
      next: (updatedList) => {
        this.wallet = updatedList;
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar
  // ======================
  openEditModal(index: number) {
    const original = this.wallet[index];
    this.editedAccount = new WalletAccount(original.tipo, original.valor);
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedAccount = new WalletAccount('', 0);
    this.editedIndex = null;
  }

  saveEditedAccount() {
    if (this.editedIndex === null) return;

    this.walletService.updateAccount(this.editedIndex, { ...this.editedAccount }).subscribe({
      next: (updatedList) => {
        this.wallet = updatedList;
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar cuenta:', err);
      },
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteAccount(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta cuenta?');
    if (!confirmDelete) return;

    this.walletService.deleteAccount(index).subscribe({
      next: (updatedList) => {
        this.wallet = updatedList;
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
      },
    });
  }

  // ======================
  // Utilidades
  // ======================
  getTotalWallet(): number {
    return this.wallet.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
