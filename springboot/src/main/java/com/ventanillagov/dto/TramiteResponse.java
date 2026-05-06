package com.ventanillagov.dto;

import com.ventanillagov.entity.EstadoTramite;
import com.ventanillagov.entity.Tramite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
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

    // TipoTramite info
    private Long tipoTramiteId;
    private String tipoTramiteNombre;
    private String entidadNombre;
    private String entidadCodigo;
    private BigDecimal costoEstimado;
    private Integer diasEstimado;

    // Ciudadano info
    private Long ciudadanoId;
    private String ciudadanoNombre;
    private String ciudadanoCedula;

    // Funcionario info
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
            r.setCostoEstimado(t.getTipoTramite().getCostoEstimado());
            r.setDiasEstimado(t.getTipoTramite().getDiasEstimado());
            if (t.getTipoTramite().getEntidad() != null) {
                r.setEntidadNombre(t.getTipoTramite().getEntidad().getNombre());
                r.setEntidadCodigo(t.getTipoTramite().getEntidad().getCodigo());
            }
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
