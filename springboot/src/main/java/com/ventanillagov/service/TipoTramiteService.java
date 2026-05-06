package com.ventanillagov.service;

import com.ventanillagov.entity.Entidad;
import com.ventanillagov.entity.TipoTramite;
import com.ventanillagov.repository.EntidadRepository;
import com.ventanillagov.repository.TipoTramiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio 2: Gestión del catálogo de tipos de trámite y entidades gubernamentales.
 * Permite consultar, crear y actualizar los tipos disponibles por entidad.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TipoTramiteService {

    private final TipoTramiteRepository tipoTramiteRepository;
    private final EntidadRepository entidadRepository;

    @Transactional(readOnly = true)
    public List<TipoTramite> listarActivos() {
        return tipoTramiteRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public List<TipoTramite> listarPorEntidad(Long entidadId) {
        return tipoTramiteRepository.findByActivoTrueAndEntidadId(entidadId);
    }

    @Transactional(readOnly = true)
    public TipoTramite obtenerPorId(Long id) {
        return tipoTramiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de trámite no encontrado con id: " + id));
    }

    public TipoTramite crear(TipoTramite tipoTramite) {
        Entidad entidad = entidadRepository.findById(tipoTramite.getEntidad().getId())
                .orElseThrow(() -> new RuntimeException("Entidad no encontrada"));
        tipoTramite.setEntidad(entidad);
        return tipoTramiteRepository.save(tipoTramite);
    }

    public TipoTramite actualizar(Long id, TipoTramite datos) {
        TipoTramite existing = obtenerPorId(id);
        existing.setNombre(datos.getNombre());
        existing.setDescripcion(datos.getDescripcion());
        existing.setDocumentosRequeridos(datos.getDocumentosRequeridos());
        existing.setCostoEstimado(datos.getCostoEstimado());
        existing.setDiasEstimado(datos.getDiasEstimado());
        if (datos.getActivo() != null) existing.setActivo(datos.getActivo());
        return tipoTramiteRepository.save(existing);
    }

    public void desactivar(Long id) {
        TipoTramite tipo = obtenerPorId(id);
        tipo.setActivo(false);
        tipoTramiteRepository.save(tipo);
    }

    @Transactional(readOnly = true)
    public List<Entidad> listarEntidades() {
        return entidadRepository.findAll();
    }
}
