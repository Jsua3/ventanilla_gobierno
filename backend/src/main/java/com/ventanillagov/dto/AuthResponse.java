package com.ventanillagov.dto;

import com.ventanillagov.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String cedula;
    private String nombre;
    private String apellido;
    private String email;
    private Rol rol;
}
