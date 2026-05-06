package com.ventanillagov.repository;

import com.ventanillagov.entity.Entidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EntidadRepository extends JpaRepository<Entidad, Long> {
    Optional<Entidad> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
