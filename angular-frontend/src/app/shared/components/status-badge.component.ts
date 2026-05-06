import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoTramite } from '../../core/models/models';

const CONFIG: Record<EstadoTramite, { label: string; cls: string }> = {
  BORRADOR:    { label: 'Borrador',    cls: 'bg-gray-100 text-gray-700' },
  ENVIADO:     { label: 'Enviado',     cls: 'bg-blue-100 text-blue-700' },
  EN_REVISION: { label: 'En Revisión', cls: 'bg-yellow-100 text-yellow-700' },
  APROBADO:    { label: 'Aprobado',    cls: 'bg-green-100 text-green-700' },
  RECHAZADO:   { label: 'Rechazado',   cls: 'bg-red-100 text-red-700' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ cfg.cls }}">{{ cfg.label }}</span>`
})
export class StatusBadgeComponent {
  @Input() estado!: EstadoTramite;
  get cfg() { return CONFIG[this.estado] ?? CONFIG['BORRADOR']; }
}
