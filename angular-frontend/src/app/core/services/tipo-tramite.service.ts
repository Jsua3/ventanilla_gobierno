import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoTramite, Entidad } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TipoTramiteService {
  private base = `${environment.apiUrl}/tipos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(this.base);
  }

  detalle(id: number): Observable<TipoTramite> {
    return this.http.get<TipoTramite>(`${this.base}/${id}`);
  }

  listarEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(`${this.base}/entidades`);
  }
}
