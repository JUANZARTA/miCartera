import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  showModal = false;
  showSuccessModal = false;
  errorMessage = '';
  users: any[] = []; // Lista de usuarios obtenidos de `data.json`

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  // 🔹 Cargar los usuarios desde `data.json`
  loadUsers() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        //console.log('✅ Usuarios cargados:', data.usuarios);
        this.users = data.usuarios;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
      }
    });
  }

  // 🔹 Método para verificar si un campo es inválido
  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  // 🔹 Validación y redirección al Home si los datos son correctos
  onSubmit() {
      if (this.loginForm.valid) {
          const { email, password } = this.loginForm.value;

          // Buscar si el usuario existe en `data.json`
          const userFound = this.users.find(user => user.email === email && user.password === password);

          if (!userFound) {
              this.showErrorModal('Correo o contraseña incorrectos. Intenta de nuevo.');
          } else {
              // ✅ Guardamos el usuario en LocalStorage
              localStorage.setItem('user', JSON.stringify(userFound));
              this.showWelcomeModal();
          }
      }
  }


  // 🔹 Mostrar el modal de error
  showErrorModal(message: string) {
    this.errorMessage = message;
    this.showModal = true;
  }

  // 🔹 Cerrar el modal de error
  closeModal() {
    this.showModal = false;
  }

  // 🔹 Mostrar el modal de bienvenida y redirigir en 1 segundo
  showWelcomeModal() {
    this.showSuccessModal = true;
    setTimeout(() => {
      this.showSuccessModal = false;
      this.router.navigate(['app/home']).then(() => {
        this.cd.detectChanges(); // ✅ Forzar actualización de la vista
      });
    }, 1000);
  }
}
