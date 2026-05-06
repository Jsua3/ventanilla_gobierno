package com.ventanillagov.service;

import com.ventanillagov.entity.TipoTramite;
import com.ventanillagov.repository.TipoTramiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TipoTramiteService {

    private final TipoTramiteRepository tipoTramiteRepository;

    @Transactional(readOnly = true)
    public List<TipoTramite> listarActivos() {
        return tipoTramiteRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public TipoTramite obtenerPorId(Long id) {
        return tipoTramiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de trámite no encontrado con id: " + id));
    }

    public TipoTramite crear(TipoTramite tipoTramite) {
        return tipoTramiteRepository.save(tipoTramite);
    }

    public TipoTramite actualizar(Long id, TipoTramite datos) {
        TipoTramite existing = obtenerPorId(id);
        existing.setNombre(datos.getNombre());
        existing.setDescripcion(datos.getDescripcion());
        existing.setEntidad(datos.getEntidad());
        existing.setDiasEstimado(datos.getDiasEstimado());
        if (datos.getActivo() != null) existing.setActivo(datos.getActivo());
        return tipoTramiteRepository.save(existing);
    }

    public void desactivar(Long id) {
        TipoTramite tipo = obtenerPorId(id);
        tipo.setActivo(false);
        tipoTramiteRepository.save(tipo);
    }
}
