package com.ventanillagov.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TramiteRequest {
    @NotNull(message = "El tipo de trámite es requerido")
    private Long tipoTramiteId;

    private String descripcion;
}
