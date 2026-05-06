import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TramiteService } from '../../core/services/tramite.service';
import { TipoTramiteService } from '../../core/services/tipo-tramite.service';
import { TipoTramite } from '../../core/models/models';

@Component({
  selector: 'app-nuevo-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Nuevo Trámite</h1>
        <p class="text-gray-500 text-sm mt-1">Selecciona el tipo y completa la información</p>
      </div>

      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div class="card p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Trámite *</label>
          @for (tipo of tipos(); track tipo.id) {
            <label class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer mb-2 transition-colors"
                   [class]="form.get('tipoTramiteId')?.value == tipo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'">
              <input type="radio" formControlName="tipoTramiteId" [value]="tipo.id" class="mt-1 accent-blue-600"/>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-gray-900">{{ tipo.nombre }}</p>
                <p class="text-xs text-gray-500">{{ tipo.entidad?.nombre }}</p>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>⏱ {{ tipo.diasEstimado }} días est.</span>
                  <span [class]="tipo.costoEstimado ? 'text-orange-600' : 'text-green-600'" class="font-medium">
                    {{ tipo.costoEstimado ? ('$' + tipo.costoEstimado.toLocaleString('es-CO')) : 'Gratuito' }}
                  </span>
                </div>
                @if (tipo.documentosRequeridos) {
                  <p class="text-xs text-gray-400 mt-1">📎 {{ tipo.documentosRequeridos }}</p>
                }
              </div>
            </label>
          }
          @if (form.get('tipoTramiteId')?.invalid && form.get('tipoTramiteId')?.touched) {
            <p class="text-red-500 text-xs mt-1">Selecciona un tipo de trámite</p>
          }
        </div>

        <div class="card p-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción / Observaciones</label>
          <textarea formControlName="descripcion" rows="3" class="input resize-none"
            placeholder="Describe cualquier información adicional relevante..."></textarea>
        </div>

        <div class="flex gap-3">
          <button type="button" (click)="router.navigate(['/tramites'])" class="btn-secondary flex-1">Cancelar</button>
          <button type="submit" [disabled]="loading()" class="btn-primary flex-1">
            {{ loading() ? 'Creando...' : 'Crear Trámite' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class NuevoTramiteComponent implements OnInit {
  tipos = signal<TipoTramite[]>([]);
  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    tipoTramiteId: [null as number | null, Validators.required],
    descripcion: ['']
  });

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private tramiteService: TramiteService,
    private tipoService: TipoTramiteService
  ) {}

  ngOnInit() {
    this.tipoService.listar().subscribe(d => this.tipos.set(d));
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const val = this.form.value;
    this.tramiteService.crear({ tipoTramiteId: val.tipoTramiteId!, descripcion: val.descripcion || undefined }).subscribe({
      next: (t) => this.router.navigate(['/tramites', t.id]),
      error: (err) => { this.error.set(err.error?.error || 'Error al crear el trámite'); this.loading.set(false); }
    });
  }
}
