import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../core/services/tramite.service';
import { TramiteResponse } from '../../core/models/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-detalle-tramite',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <button (click)="router.navigate(['/tramites'])" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        ← Volver
      </button>

      @if (loading()) {
        <div class="text-center py-16 text-gray-400">Cargando...</div>
      } @else if (tramite()) {
        <div class="card p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="font-mono text-sm text-gray-500">{{ tramite()!.codigo }}</p>
              <h1 class="text-xl font-bold text-gray-900 mt-1">{{ tramite()!.tipoTramiteNombre }}</h1>
              <p class="text-sm text-gray-500">{{ tramite()!.entidad }}</p>
            </div>
            <app-status-badge [estado]="tramite()!.estado" />
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div><p class="text-xs text-gray-400">Creado</p><p class="font-medium">{{ tramite()!.creadoEn | date:'dd/MM/yyyy HH:mm' }}</p></div>
            <div><p class="text-xs text-gray-400">Actualizado</p><p class="font-medium">{{ tramite()!.actualizadoEn | date:'dd/MM/yyyy HH:mm' }}</p></div>
            <div><p class="text-xs text-gray-400">Tiempo estimado</p><p class="font-medium">{{ tramite()!.diasEstimado }} días hábiles</p></div>
            <div><p class="text-xs text-gray-400">Entidad</p><p class="font-medium">{{ tramite()!.entidad }}</p></div>
            @if (tramite()!.funcionarioNombre) {
              <div class="col-span-2"><p class="text-xs text-gray-400">Funcionario</p><p class="font-medium">{{ tramite()!.funcionarioNombre }}</p></div>
            }
          </div>

          @if (tramite()!.descripcion) {
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-400 font-semibold mb-1">Tu descripción</p>
              <p class="text-sm text-gray-700">{{ tramite()!.descripcion }}</p>
            </div>
          }

          @if (tramite()!.comentarioFuncionario) {
            <div class="mt-4 p-3 rounded-lg" [class]="tramite()!.estado === 'RECHAZADO' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'">
              <p class="text-xs font-semibold uppercase tracking-wider mb-1">Comentario del funcionario</p>
              <p class="text-sm">{{ tramite()!.comentarioFuncionario }}</p>
            </div>
          }
        </div>

        @if (tramite()!.estado === 'BORRADOR') {
          <div class="flex gap-3">
            <button (click)="cancelar()" [disabled]="actionLoading()" class="btn-secondary flex items-center gap-2">
              ✕ Cancelar
            </button>
            <button (click)="enviar()" [disabled]="actionLoading()" class="btn-primary flex-1 flex items-center justify-center gap-2">
              {{ actionLoading() ? 'Procesando...' : '→ Enviar Trámite' }}
            </button>
          </div>
        }
      }
    </div>
  `
})
export class DetalleTramiteComponent implements OnInit {
  tramite = signal<TramiteResponse | null>(null);
  loading = signal(true);
  actionLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private tramiteService: TramiteService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tramiteService.detalle(id).subscribe({
      next: d => { this.tramite.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  enviar() {
    this.actionLoading.set(true);
    this.tramiteService.enviar(this.tramite()!.id).subscribe({
      next: d => { this.tramite.set(d); this.actionLoading.set(false); },
      error: () => this.actionLoading.set(false)
    });
  }

  cancelar() {
    if (!confirm('¿Seguro que deseas cancelar este trámite?')) return;
    this.actionLoading.set(true);
    this.tramiteService.cancelar(this.tramite()!.id).subscribe({
      next: () => this.router.navigate(['/tramites']),
      error: () => this.actionLoading.set(false)
    });
  }
}
