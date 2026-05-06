package com.ventanillagov.repository;

import com.ventanillagov.entity.EstadoTramite;
import com.ventanillagov.entity.Tramite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TramiteRepository extends JpaRepository<Tramite, Long> {
    List<Tramite> findByCiudadanoIdOrderByCreadoEnDesc(Long ciudadanoId);
    List<Tramite> findByCiudadanoIdAndEstadoOrderByCreadoEnDesc(Long ciudadanoId, EstadoTramite estado);
    Optional<Tramite> findByCiudadanoIdAndId(Long ciudadanoId, Long id);
    boolean existsByCiudadanoIdAndTipoTramiteIdAndEstadoIn(Long ciudadanoId, Long tipoTramiteId, List<EstadoTramite> estados);
    long count();
    Page<Tramite> findByEstadoIn(List<EstadoTramite> estados, Pageable pageable);
    Page<Tramite> findAll(Pageable pageable);
}
