import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // ✅ Importamos RouterModule para navegación
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  loginForm: FormGroup;
  showModal = false;
  errorMessage = '';

  // 🔹 Usuario quemado
  private user = {
    name: 'Kmilo Zarta',
    email: 'juancamilozartacampo@gmail.com',
    password: '000000'
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

      if (email !== this.user.email) {
        this.showErrorModal('Correo incorrecto. Intenta de nuevo.');
      } else if (password !== this.user.password) {
        this.showErrorModal('Contraseña incorrecta. Intenta de nuevo.');
      } else {;
        this.router.navigate(['/home']); // ✅ Redirige al Home
      }
    }
  }

  // 🔹 Mostrar el modal con mensaje de error
  showErrorModal(message: string) {
    this.errorMessage = message;
    this.showModal = true;
  }

  // 🔹 Cerrar el modal
  closeModal() {
    this.showModal = false;
  }
}
