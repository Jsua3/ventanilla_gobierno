import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TramiteService } from '../../core/services/tramite.service';
import { TramiteResponse, PaginatedTramites } from '../../core/models/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Panel de Funcionario</h1>
        <p class="text-gray-500 text-sm mt-1">Gestión de trámites ciudadanos</p>
      </div>

      @if (loading()) {
        <div class="text-center py-16 text-gray-400">Cargando...</div>
      } @else if (!data() || data()!.tramites.length === 0) {
        <div class="card p-12 text-center text-gray-500">No hay trámites pendientes de revisión</div>
      } @else {
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  @for (h of headers; track h) {
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ h }}</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (t of data()!.tramites; track t.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ t.codigo }}</td>
                    <td class="px-4 py-3">
                      <p class="font-medium text-gray-900">{{ t.ciudadanoNombre }}</p>
                      <p class="text-xs text-gray-400">C.C. {{ t.ciudadanoCedula }}</p>
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-900">{{ t.tipoTramiteNombre }}</td>
                    <td class="px-4 py-3"><app-status-badge [estado]="t.estado" /></td>
                    <td class="px-4 py-3 text-xs text-gray-500">{{ t.creadoEn | date:'dd/MM/yyyy' }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1">
                        @if (t.estado === 'ENVIADO') {
                          <button (click)="openModal(t, 'revisar')" class="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded">Revisar</button>
                        }
                        @if (t.estado === 'EN_REVISION') {
                          <button (click)="openModal(t, 'aprobar')" class="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded">Aprobar</button>
                          <button (click)="openModal(t, 'rechazar')" class="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded">Rechazar</button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">{{ data()!.total }} trámite(s) — Página {{ page() + 1 }} de {{ data()!.pages }}</p>
          <div class="flex gap-2">
            <button [disabled]="page() === 0" (click)="cambiarPagina(-1)" class="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">←</button>
            <button [disabled]="page() + 1 >= data()!.pages" (click)="cambiarPagina(1)" class="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">→</button>
          </div>
        </div>
      }
    </div>

    <!-- Modal -->
    @if (modal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2 capitalize">
            {{ modal()!.action === 'revisar' ? 'Tomar en revisión' : modal()!.action === 'aprobar' ? 'Aprobar trámite' : 'Rechazar trámite' }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">Trámite: <span class="font-mono font-semibold">{{ modal()!.tramite.codigo }}</span></p>

          @if (modalError()) {
            <div class="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">{{ modalError() }}</div>
          }

          @if (modal()!.action !== 'revisar') {
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Comentario {{ modal()!.action === 'rechazar' ? '(obligatorio)' : '(opcional)' }}
              </label>
              <textarea [(ngModel)]="comentario" rows="3" class="input resize-none"
                [placeholder]="modal()!.action === 'rechazar' ? 'Motivo del rechazo...' : 'Observaciones opcionales...'"></textarea>
            </div>
          }

          <div class="flex gap-3">
            <button (click)="cerrarModal()" class="btn-secondary flex-1">Cancelar</button>
            <button (click)="confirmarAccion()" [disabled]="actionLoading()"
              class="flex-1 font-semibold px-4 py-2 rounded-lg transition-colors text-white disabled:opacity-50"
              [class]="modal()!.action === 'rechazar' ? 'bg-red-600 hover:bg-red-700' : modal()!.action === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'">
              {{ actionLoading() ? 'Procesando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class FuncionarioComponent implements OnInit {
  headers = ['Código', 'Ciudadano', 'Trámite', 'Estado', 'Fecha', 'Acciones'];
  data = signal<PaginatedTramites | null>(null);
  page = signal(0);
  loading = signal(true);
  modal = signal<{ tramite: TramiteResponse; action: string } | null>(null);
  comentario = '';
  actionLoading = signal(false);
  modalError = signal('');

  constructor(private tramiteService: TramiteService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.tramiteService.listarPendientes(this.page(), 10).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cambiarPagina(delta: number) {
    this.page.update(p => p + delta);
    this.cargar();
  }

  openModal(t: TramiteResponse, action: string) {
    this.modal.set({ tramite: t, action });
    this.comentario = '';
    this.modalError.set('');
  }

  cerrarModal() { this.modal.set(null); }

  confirmarAccion() {
    const m = this.modal();
    if (!m) return;
    if (m.action === 'rechazar' && !this.comentario.trim()) {
      this.modalError.set('El comentario es obligatorio'); return;
    }
    this.actionLoading.set(true);
    const req$ = m.action === 'revisar'
      ? this.tramiteService.revisar(m.tramite.id)
      : m.action === 'aprobar'
      ? this.tramiteService.aprobar(m.tramite.id, this.comentario)
      : this.tramiteService.rechazar(m.tramite.id, this.comentario);

    req$.subscribe({
      next: () => { this.cerrarModal(); this.actionLoading.set(false); this.cargar(); },
      error: (err) => { this.modalError.set(err.error?.error || 'Error'); this.actionLoading.set(false); }
    });
  }
}
