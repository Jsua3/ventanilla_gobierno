package com.ventanillagov.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entidad_id", nullable = false)
    private Entidad entidad;

    @Column(name = "documentos_requeridos", columnDefinition = "TEXT")
    private String documentosRequeridos;

    @Column(name = "costo_estimado", precision = 12, scale = 2)
    private BigDecimal costoEstimado;

    @Column(name = "dias_estimado")
    @Builder.Default
    private Integer diasEstimado = 15;

    @Builder.Default
    private Boolean activo = true;

    @OneToMany(mappedBy = "tipoTramite", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tramite> tramites;
}
