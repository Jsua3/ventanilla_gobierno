import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TramiteRequest, TramiteResponse, PaginatedTramites } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private base = `${environment.apiUrl}/tramites`;
  private funcBase = `${environment.apiUrl}/funcionario/tramites`;

  constructor(private http: HttpClient) {}

  listar(estado?: string): Observable<TramiteResponse[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http.get<TramiteResponse[]>(this.base, { params });
  }

  crear(req: TramiteRequest): Observable<TramiteResponse> {
    return this.http.post<TramiteResponse>(this.base, req);
  }

  detalle(id: number): Observable<TramiteResponse> {
    return this.http.get<TramiteResponse>(`${this.base}/${id}`);
  }

  enviar(id: number): Observable<TramiteResponse> {
    return this.http.patch<TramiteResponse>(`${this.base}/${id}/enviar`, {});
  }

  cancelar(id: number): Observable<TramiteResponse> {
    return this.http.patch<TramiteResponse>(`${this.base}/${id}/cancelar`, {});
  }

  // Funcionario
  listarPendientes(page = 0, size = 10): Observable<PaginatedTramites> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedTramites>(this.funcBase, { params });
  }

  revisar(id: number): Observable<TramiteResponse> {
    return this.http.patch<TramiteResponse>(`${this.funcBase}/${id}/revisar`, {});
  }

  aprobar(id: number, comentario?: string): Observable<TramiteResponse> {
    return this.http.patch<TramiteResponse>(`${this.funcBase}/${id}/aprobar`, { comentario });
  }

  rechazar(id: number, comentario: string): Observable<TramiteResponse> {
    return this.http.patch<TramiteResponse>(`${this.funcBase}/${id}/rechazar`, { comentario });
  }
}
