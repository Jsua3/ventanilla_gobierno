package com.ventanillagov.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tramites")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tramite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String codigo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ciudadano_id", nullable = false)
    private User ciudadano;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_tramite_id", nullable = false)
    private TipoTramite tipoTramite;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EstadoTramite estado = EstadoTramite.BORRADOR;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "comentario_funcionario", columnDefinition = "TEXT")
    private String comentarioFuncionario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "funcionario_id")
    private User funcionario;

    @Column(name = "creado_en")
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();

    @Column(name = "actualizado_en")
    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
