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
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  // Variables
  wallet: any[] = [];
  isModalOpen: boolean = false;

  // Variables para edición
  editingIndex: number | null = null;
  editingField: string = '';

  // Nueva cuenta
  newAccount = {
    tipo: '',
    valor: 0
  };

  // Método para inicializar el componente
  ngOnInit() {
    this.loadWallet();
  }

  // Método para cargar la cartera
  loadWallet() {
    this.http.get<any>('/assets/json/wallet.json').subscribe({
      next: (data) => {
        this.wallet = data.cartera;
      }
    });
  }

  // Método para abrir el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para agregar una cuenta
  addAccount() {
    this.wallet.push({ ...this.newAccount });
    this.closeModal();
  }

  // Método para obtener el total de
  getTotalWallet(): number {
    return this.wallet.reduce((sum, account) => sum + account.valor, 0);
  }

  // Método para dar formato a un número
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para editar un campo
  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  // Método para guardar la edición
  saveEdit() {
    this.editingIndex = null;
    this.editingField = '';
  }
}
