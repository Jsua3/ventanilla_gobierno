import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">VentanillaGov</h1>
          <p class="text-blue-200 text-sm mt-1">Crear Cuenta Ciudadana</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Registro</h2>

          @if (error) {
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{{ error }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            @for (field of fields; track field.name) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                <input [formControlName]="field.name" [type]="field.type" [placeholder]="field.placeholder" class="input"/>
              </div>
            }
            <button type="submit" [disabled]="loading" class="btn-primary w-full py-2.5">
              {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fields = [
    { name: 'cedula', label: 'Número de Cédula', type: 'text', placeholder: '1234567890' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Juan' },
    { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'juan@ejemplo.com' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
  ];

  form = this.fb.group({
    cedula: ['', [Validators.required, Validators.minLength(6)]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error = err.error?.error || 'Error al registrarse'; this.loading = false; }
    });
  }
}
