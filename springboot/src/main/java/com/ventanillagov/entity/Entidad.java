package com.ventanillagov.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "entidades")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Entidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "entidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TipoTramite> tiposTramite;
}
