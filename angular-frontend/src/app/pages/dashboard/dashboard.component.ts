import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TramiteService } from '../../core/services/tramite.service';
import { TipoTramiteService } from '../../core/services/tipo-tramite.service';
import { TramiteResponse, TipoTramite } from '../../core/models/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="space-y-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bienvenido, {{ user()?.nombre }} 👋</h1>
          <p class="text-gray-500 mt-1">Gestiona tus trámites desde un solo lugar</p>
        </div>
        <a routerLink="/tramites/nuevo" class="btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span class="hidden sm:inline">Nuevo Trámite</span>
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div class="card p-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" [class]="stat.bg">
              <span class="text-lg">{{ stat.icon }}</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Tipos de trámite disponibles -->
      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-4">Servicios Disponibles</h2>
        @if (tipos().length === 0) {
          <p class="text-gray-400 text-sm">Cargando servicios...</p>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (tipo of tipos(); track tipo.id) {
              <a routerLink="/tramites/nuevo" class="card p-4 block hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-semibold text-sm text-gray-900">{{ tipo.nombre }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ tipo.entidad }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-xs text-gray-400">{{ tipo.diasEstimado }} días</p>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>

      <!-- Trámites recientes -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Trámites Recientes</h2>
          <a routerLink="/tramites" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos →</a>
        </div>
        @if (tramites().length === 0) {
          <div class="card p-12 text-center">
            <p class="text-gray-400 text-4xl mb-4">📋</p>
            <p class="text-gray-500 font-medium">No tienes trámites aún</p>
            <a routerLink="/tramites/nuevo" class="btn-primary inline-flex items-center gap-2 mt-4">Iniciar primer trámite</a>
          </div>
        } @else {
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (t of tramites().slice(0,6); track t.id) {
              <a [routerLink]="['/tramites', t.id]" class="card p-4 block hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-semibold text-sm text-gray-900 truncate">{{ t.tipoTramiteNombre }}</p>
                    <p class="text-xs text-gray-400 font-mono">{{ t.codigo }}</p>
                  </div>
                  <app-status-badge [estado]="t.estado" />
                </div>
                <p class="text-xs text-gray-400 mt-2">{{ t.entidad }} · {{ t.creadoEn | date:'dd/MM/yyyy' }}</p>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user = this.auth.currentUser;
  tramites = signal<TramiteResponse[]>([]);
  tipos = signal<TipoTramite[]>([]);

  stats = computed(() => {
    const t = this.tramites();
    return [
      { label: 'Activos', value: t.filter(x => ['ENVIADO','EN_REVISION'].includes(x.estado)).length, icon: '⏳', bg: 'bg-blue-50' },
      { label: 'Aprobados', value: t.filter(x => x.estado === 'APROBADO').length, icon: '✅', bg: 'bg-green-50' },
      { label: 'Borradores', value: t.filter(x => x.estado === 'BORRADOR').length, icon: '📝', bg: 'bg-gray-50' },
      { label: 'Rechazados', value: t.filter(x => x.estado === 'RECHAZADO').length, icon: '❌', bg: 'bg-red-50' },
    ];
  });

  constructor(private auth: AuthService, private tramiteService: TramiteService, private tipoService: TipoTramiteService) {}

  ngOnInit() {
    this.tramiteService.listar().subscribe(data => this.tramites.set(data));
    this.tipoService.listar().subscribe(data => this.tipos.set(data));
  }
}
