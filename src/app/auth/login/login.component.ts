import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DateService } from '../../services/date.service'; // Asegúrate de importar esto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  private dateService = inject(DateService); // agrega esto a tu clase

  loginForm: FormGroup;
  showModal = false;
  showSuccessModal = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.showWelcomeModal();
        },
        error: (errorMsg) => {
          this.showErrorModal(this.getFirebaseErrorMessage(errorMsg));
        }
      });
    }
  }

  showErrorModal(message: string) {
    this.errorMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  showWelcomeModal() {
    this.showSuccessModal = true;

    // 🔥 Establecer fecha actual al iniciar sesión
    this.dateService.resetToCurrentDate();

    setTimeout(() => {
      this.showSuccessModal = false;
      this.router.navigate(['app/home']);
    }, 1000);
  }


  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        return 'Correo o contraseña incorrectos.';
      case 'USER_DISABLED':
        return 'Este usuario ha sido deshabilitado.';
      default:
        return 'Ha ocurrido un error inesperado.';
    }
  }
}
