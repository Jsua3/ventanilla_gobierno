import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <p class="text-blue-200 text-sm mt-1">Trámites Digitales Colombia</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Iniciar Sesión</h2>

          @if (error) {
            <div class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              {{ error }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input formControlName="email" type="email" placeholder="user@gov.co" class="input"/>
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-red-500 text-xs mt-1">Email válido requerido</p>
              }
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input formControlName="password" type="password" placeholder="••••••••" class="input"/>
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1">La contraseña es requerida</p>
              }
            </div>
            <button type="submit" [disabled]="loading" class="btn-primary w-full py-2.5">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?
            <a routerLink="/registro" class="text-blue-600 hover:text-blue-700 font-medium">Regístrate aquí</a>
          </p>

          <div class="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p class="font-semibold mb-1">Credenciales de prueba:</p>
            <p>Ciudadano: <span class="font-mono">user@gov.co / user123</span></p>
            <p>Funcionario: <span class="font-mono">func@gov.co / func123</span></p>
            <p>Admin: <span class="font-mono">admin@gov.co / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        this.router.navigate([res.rol === 'FUNCIONARIO' || res.rol === 'ADMIN' ? '/funcionario' : '/']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}
