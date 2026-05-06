package com.ventanillagov.dto;

import com.ventanillagov.entity.EstadoTramite;
import com.ventanillagov.entity.Tramite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TramiteResponse {
    private Long id;
    private String codigo;
    private EstadoTramite estado;
    private String descripcion;
    private String comentarioFuncionario;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;

    private Long tipoTramiteId;
    private String tipoTramiteNombre;
    private String entidad;
    private Integer diasEstimado;

    private Long ciudadanoId;
    private String ciudadanoNombre;
    private String ciudadanoCedula;

    private String funcionarioNombre;

    public static TramiteResponse from(Tramite t) {
        TramiteResponse r = new TramiteResponse();
        r.setId(t.getId());
        r.setCodigo(t.getCodigo());
        r.setEstado(t.getEstado());
        r.setDescripcion(t.getDescripcion());
        r.setComentarioFuncionario(t.getComentarioFuncionario());
        r.setCreadoEn(t.getCreadoEn());
        r.setActualizadoEn(t.getActualizadoEn());

        if (t.getTipoTramite() != null) {
            r.setTipoTramiteId(t.getTipoTramite().getId());
            r.setTipoTramiteNombre(t.getTipoTramite().getNombre());
            r.setEntidad(t.getTipoTramite().getEntidad());
            r.setDiasEstimado(t.getTipoTramite().getDiasEstimado());
        }
        if (t.getCiudadano() != null) {
            r.setCiudadanoId(t.getCiudadano().getId());
            r.setCiudadanoNombre(t.getCiudadano().getNombre() + " " + t.getCiudadano().getApellido());
            r.setCiudadanoCedula(t.getCiudadano().getCedula());
        }
        if (t.getFuncionario() != null) {
            r.setFuncionarioNombre(t.getFuncionario().getNombre() + " " + t.getFuncionario().getApellido());
        }
        return r;
    }
}
