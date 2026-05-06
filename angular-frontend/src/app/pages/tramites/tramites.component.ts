import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TramiteService } from '../../core/services/tramite.service';
import { TramiteResponse } from '../../core/models/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'EN_REVISION', label: 'En Revisión' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mis Trámites</h1>
          <p class="text-gray-500 text-sm mt-1">{{ tramites().length }} trámite(s)</p>
        </div>
        <a routerLink="/tramites/nuevo" class="btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo
        </a>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        @for (e of estados; track e.value) {
          <button (click)="filtrar(e.value)"
            [class]="estadoActual() === e.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
            {{ e.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="text-center py-16 text-gray-400">Cargando...</div>
      } @else if (tramites().length === 0) {
        <div class="card p-12 text-center">
          <p class="text-4xl mb-4">📋</p>
          <p class="text-gray-500 font-medium">{{ estadoActual() ? 'No hay trámites con este estado' : 'No tienes trámites aún' }}</p>
          @if (!estadoActual()) {
            <a routerLink="/tramites/nuevo" class="btn-primary inline-flex mt-4">Iniciar trámite</a>
          }
        </div>
      } @else {
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          @for (t of tramites(); track t.id) {
            <a [routerLink]="['/tramites', t.id]" class="card p-4 block hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <p class="font-semibold text-sm text-gray-900 truncate">{{ t.tipoTramiteNombre }}</p>
                  <p class="text-xs text-gray-400 font-mono">{{ t.codigo }}</p>
                </div>
                <app-status-badge [estado]="t.estado" />
              </div>
              <p class="text-xs text-gray-400">{{ t.entidad }} · {{ t.creadoEn | date:'dd MMM yyyy' }}</p>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class TramitesComponent implements OnInit {
  estados = ESTADOS;
  tramites = signal<TramiteResponse[]>([]);
  estadoActual = signal('');
  loading = signal(true);

  constructor(private tramiteService: TramiteService) {}

  ngOnInit() { this.cargar(); }

  filtrar(estado: string) {
    this.estadoActual.set(estado);
    this.cargar();
  }

  private cargar() {
    this.loading.set(true);
    this.tramiteService.listar(this.estadoActual() || undefined).subscribe({
      next: d => { this.tramites.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
