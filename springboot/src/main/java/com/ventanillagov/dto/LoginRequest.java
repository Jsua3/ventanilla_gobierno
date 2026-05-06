package com.ventanillagov.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "La cédula es requerida")
    private String cedula;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
