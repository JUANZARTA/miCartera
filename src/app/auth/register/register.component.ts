import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // ✅ Importamos ReactiveFormsModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  // 🔹 Método para validar que las contraseñas coincidan
  private passwordsMatch(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // 🔹 Método para verificar si un campo es inválido
  isInvalid(field: string): boolean {
    return this.registerForm.controls[field].invalid && this.registerForm.controls[field].touched;
  }

  // 🔹 Método para manejar el envío del formulario
  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Datos de registro:', this.registerForm.value);
      // Aquí puedes conectar con una API para registrar el usuario
    }
  }
}
