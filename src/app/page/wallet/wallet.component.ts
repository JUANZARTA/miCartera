import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { WalletAccount } from '../../models/wallet.model';
import { DateService } from '../../services/date.service'; // ✅ Nuevo
import { Subscription } from 'rxjs'; // ✅ Nuevo
import { AuthService } from '../../services/auth.service'; // ✅ nuevo

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
export default class WalletComponent implements OnInit, OnDestroy {
  private walletService = inject(WalletService);
  private decimalPipe = inject(DecimalPipe);
  private dateService = inject(DateService); // ✅ Nuevo
  private authService = inject(AuthService); // ✅ nuevo

  wallet: WalletAccountWithId[] = [];

  isModalOpen = false;
  isEditModalOpen = false;

  newAccount: WalletAccount = new WalletAccount('', 0);
  editedAccount: WalletAccount = new WalletAccount('', 0);
  editedId: string | null = null;

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;

  currentYear: string = '';
  currentMonth: string = '';
  private dateSubscription: Subscription | undefined; // ✅ Nuevo

  ngOnInit() {
    // ✅ Reacción a cambio de mes/año
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      if (date.year && date.month) {
        this.currentYear = date.year;
        this.currentMonth = date.month;
        this.loadWallet();
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
  }

  loadWallet() {
    this.walletService.getWallet(this.userId, this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.wallet = Object.entries(data).map(([id, item]) => ({ id, ...item }));

        // ✅ Notificación si el total es bajo
        const total = this.getTotalWallet();
        if (total < 100000) {
          this.authService.addNotification(this.userId, 'Tu efectivo bajó a menos de $100.000').subscribe();
        }
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

    this.walletService.addAccount(this.userId, this.currentYear, this.currentMonth, this.newAccount).subscribe({
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

    this.walletService.updateAccount(this.userId, this.currentYear, this.currentMonth, this.editedId, this.editedAccount).subscribe({
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

    this.walletService.deleteAccount(this.userId, this.currentYear, this.currentMonth, id).subscribe({
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

  onValueInput(event: Event, type: 'new' | 'edit') {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[.,]/g, '');
    const value = Number(raw) || null;

    if (type === 'new') {
      this.newAccount.valor = value ?? 0;
    } else {
      this.editedAccount.valor = value ?? 0;
    }

    input.value = this.formatCurrency(value ?? 0);
  }

}
