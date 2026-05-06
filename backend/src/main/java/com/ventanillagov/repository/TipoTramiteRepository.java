package com.ventanillagov.repository;

import com.ventanillagov.entity.TipoTramite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoTramiteRepository extends JpaRepository<TipoTramite, Long> {
    List<TipoTramite> findByActivoTrue();
}
