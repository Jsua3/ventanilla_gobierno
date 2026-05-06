import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span class="font-bold text-gray-900 text-lg">VentanillaGov</span>
            <span class="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Colombia</span>
          </a>

          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/" routerLinkActive="bg-blue-50 text-blue-700" [routerLinkActiveOptions]="{exact:true}"
               class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Inicio
            </a>
            <a routerLink="/tramites" routerLinkActive="bg-blue-50 text-blue-700"
               class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Mis Trámites
            </a>
            @if (esFuncionario()) {
              <a routerLink="/funcionario" routerLinkActive="bg-blue-50 text-blue-700"
                 class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Panel Funcionario
              </a>
            }
          </div>

          <div class="flex items-center gap-3">
            @if (user()) {
              <div class="hidden sm:flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-700 font-semibold text-xs">{{ iniciales() }}</span>
                </div>
                <div class="hidden lg:block text-sm">
                  <p class="font-medium text-gray-900 leading-tight">{{ user()?.nombre }} {{ user()?.apellido }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ user()?.rol?.toLowerCase() }}</p>
                </div>
              </div>
            }
            <button (click)="auth.logout()" class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Cerrar sesión">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  user = this.auth.currentUser;
  esFuncionario = computed(() => this.auth.isFuncionario());
  iniciales = computed(() => {
    const u = this.user();
    if (!u) return '';
    return (u.nombre?.[0] ?? '') + (u.apellido?.[0] ?? '');
  });

  constructor(public auth: AuthService) {}
}
