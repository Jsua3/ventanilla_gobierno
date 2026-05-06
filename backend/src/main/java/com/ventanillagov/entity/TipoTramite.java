package com.ventanillagov.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tipos_tramite")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TipoTramite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 200)
    private String entidad;

    @Column(name = "dias_estimado")
    @Builder.Default
    private Integer diasEstimado = 15;

    @Builder.Default
    private Boolean activo = true;

    @OneToMany(mappedBy = "tipoTramite", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tramite> tramites;
}
