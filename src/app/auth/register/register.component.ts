import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  users: any[] = [];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit() {
    this.loadUsers();
  }

  // 🔹 Cargar los usuarios actuales desde `data.json`
  loadUsers() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ Usuarios cargados:', data.usuarios);
        this.users = data.usuarios;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
      }
    });
  }

  // 🔹 Validar que las contraseñas coincidan
  private passwordsMatch(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // 🔹 Verificar si un campo es inválido
  isInvalid(field: string): boolean {
    return this.registerForm.controls[field].invalid && this.registerForm.controls[field].touched;
  }

  // 🔹 Manejar el envío del formulario
  onSubmit() {
    if (this.registerForm.valid) {
      const newUser = {
        nombre: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      // 📌 Verificar si el usuario ya existe
      const userExists = this.users.some(user => user.email === newUser.email);

      if (userExists) {
        alert('❌ Este correo ya está registrado.');
        return;
      }

      // 📌 Agregar el nuevo usuario a la lista y "guardar" en `data.json`
      this.users.push(newUser);
      this.saveUsers();

      alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']); // ✅ Redirigir al login después de registrar
    }
  }

  // 🔹 Simulación de guardado en `data.json`
  saveUsers() {
    console.log('📝 Guardando usuarios en data.json...', this.users);
    // 🔴 Aquí, en una API real, haríamos una petición HTTP tipo POST o PUT para guardar los datos en un backend.
  }
}
