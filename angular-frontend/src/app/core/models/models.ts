export type Rol = 'CIUDADANO' | 'FUNCIONARIO' | 'ADMIN';
export type EstadoTramite = 'BORRADOR' | 'ENVIADO' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}

export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface RegisterRequest {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface Entidad {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

export interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  entidad: Entidad;
  documentosRequeridos: string;
  costoEstimado: number | null;
  diasEstimado: number;
  activo: boolean;
}

export interface TramiteRequest {
  tipoTramiteId: number;
  descripcion?: string;
}

export interface TramiteResponse {
  id: number;
  codigo: string;
  estado: EstadoTramite;
  descripcion: string;
  comentarioFuncionario: string;
  creadoEn: string;
  actualizadoEn: string;
  tipoTramiteId: number;
  tipoTramiteNombre: string;
  entidadNombre: string;
  entidadCodigo: string;
  costoEstimado: number;
  diasEstimado: number;
  ciudadanoId: number;
  ciudadanoNombre: string;
  ciudadanoCedula: string;
  funcionarioNombre: string;
}

export interface PaginatedTramites {
  tramites: TramiteResponse[];
  total: number;
  pages: number;
  page: number;
}
