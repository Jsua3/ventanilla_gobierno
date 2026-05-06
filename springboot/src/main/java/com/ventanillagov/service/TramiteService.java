package com.ventanillagov.service;

import com.ventanillagov.dto.TramiteRequest;
import com.ventanillagov.dto.TramiteResponse;
import com.ventanillagov.entity.*;
import com.ventanillagov.repository.TipoTramiteRepository;
import com.ventanillagov.repository.TramiteRepository;
import com.ventanillagov.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Servicio 1: Gestión del ciclo de vida completo de trámites ciudadanos.
 * Permite crear, consultar, enviar, aprobar y rechazar trámites.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TramiteService {

    private final TramiteRepository tramiteRepository;
    private final TipoTramiteRepository tipoTramiteRepository;
    private final UserRepository userRepository;

    public TramiteResponse crear(String cedula, TramiteRequest request) {
        User ciudadano = userRepository.findByCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TipoTramite tipo = tipoTramiteRepository.findById(request.getTipoTramiteId())
                .orElseThrow(() -> new RuntimeException("Tipo de trámite no encontrado"));

        if (!tipo.getActivo()) {
            throw new RuntimeException("El tipo de trámite no está disponible");
        }

        boolean yaActivo = tramiteRepository.existsByCiudadanoIdAndTipoTramiteIdAndEstadoIn(
                ciudadano.getId(), tipo.getId(),
                List.of(EstadoTramite.ENVIADO, EstadoTramite.EN_REVISION)
        );
        if (yaActivo) {
            throw new RuntimeException("Ya tienes un trámite activo de este tipo");
        }

        Tramite tramite = Tramite.builder()
                .codigo(generarCodigo())
                .ciudadano(ciudadano)
                .tipoTramite(tipo)
                .descripcion(request.getDescripcion())
                .estado(EstadoTramite.BORRADOR)
                .build();

        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    @Transactional(readOnly = true)
    public List<TramiteResponse> listarMios(String cedula, String estado) {
        User ciudadano = userRepository.findByCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Tramite> tramites;
        if (estado != null && !estado.isBlank()) {
            EstadoTramite e = EstadoTramite.valueOf(estado.toUpperCase());
            tramites = tramiteRepository.findByCiudadanoIdAndEstadoOrderByCreadoEnDesc(ciudadano.getId(), e);
        } else {
            tramites = tramiteRepository.findByCiudadanoIdOrderByCreadoEnDesc(ciudadano.getId());
        }
        return tramites.stream().map(TramiteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TramiteResponse detalle(String cedula, Long id) {
        User ciudadano = userRepository.findByCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Tramite tramite = tramiteRepository.findByCiudadanoIdAndId(ciudadano.getId(), id)
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));

        return TramiteResponse.from(tramite);
    }

    public TramiteResponse enviar(String cedula, Long id) {
        Tramite tramite = getTramitePropio(cedula, id);
        if (tramite.getEstado() != EstadoTramite.BORRADOR) {
            throw new RuntimeException("Solo se pueden enviar trámites en estado BORRADOR");
        }
        tramite.setEstado(EstadoTramite.ENVIADO);
        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    public TramiteResponse cancelar(String cedula, Long id) {
        Tramite tramite = getTramitePropio(cedula, id);
        if (tramite.getEstado() == EstadoTramite.APROBADO || tramite.getEstado() == EstadoTramite.RECHAZADO) {
            throw new RuntimeException("No se puede cancelar un trámite finalizado");
        }
        tramite.setEstado(EstadoTramite.RECHAZADO);
        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    // Panel funcionario
    @Transactional(readOnly = true)
    public Map<String, Object> listarPendientes(int page, int size) {
        Page<Tramite> pg = tramiteRepository.findByEstadoIn(
                List.of(EstadoTramite.ENVIADO, EstadoTramite.EN_REVISION),
                PageRequest.of(page, size, Sort.by("creadoEn").descending())
        );
        return Map.of(
                "tramites", pg.getContent().stream().map(TramiteResponse::from).toList(),
                "total", pg.getTotalElements(),
                "pages", pg.getTotalPages(),
                "page", page
        );
    }

    public TramiteResponse revisar(String cedula, Long id) {
        Tramite tramite = getTramitePorId(id);
        if (tramite.getEstado() != EstadoTramite.ENVIADO) {
            throw new RuntimeException("Solo se pueden revisar trámites ENVIADOS");
        }
        User funcionario = userRepository.findByCedula(cedula).orElseThrow();
        tramite.setEstado(EstadoTramite.EN_REVISION);
        tramite.setFuncionario(funcionario);
        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    public TramiteResponse aprobar(String cedula, Long id, String comentario) {
        Tramite tramite = getTramitePorId(id);
        if (tramite.getEstado() != EstadoTramite.EN_REVISION) {
            throw new RuntimeException("Solo se pueden aprobar trámites EN_REVISION");
        }
        User funcionario = userRepository.findByCedula(cedula).orElseThrow();
        tramite.setEstado(EstadoTramite.APROBADO);
        tramite.setFuncionario(funcionario);
        tramite.setComentarioFuncionario(comentario);
        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    public TramiteResponse rechazar(String cedula, Long id, String comentario) {
        if (comentario == null || comentario.isBlank()) {
            throw new RuntimeException("El comentario es obligatorio para rechazar");
        }
        Tramite tramite = getTramitePorId(id);
        if (tramite.getEstado() != EstadoTramite.EN_REVISION) {
            throw new RuntimeException("Solo se pueden rechazar trámites EN_REVISION");
        }
        User funcionario = userRepository.findByCedula(cedula).orElseThrow();
        tramite.setEstado(EstadoTramite.RECHAZADO);
        tramite.setFuncionario(funcionario);
        tramite.setComentarioFuncionario(comentario);
        return TramiteResponse.from(tramiteRepository.save(tramite));
    }

    private Tramite getTramitePropio(String cedula, Long id) {
        User ciudadano = userRepository.findByCedula(cedula).orElseThrow();
        return tramiteRepository.findByCiudadanoIdAndId(ciudadano.getId(), id)
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));
    }

    private Tramite getTramitePorId(Long id) {
        return tramiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));
    }

    private String generarCodigo() {
        long count = tramiteRepository.count() + 1;
        String year = String.valueOf(LocalDateTime.now().getYear());
        return "TRM-" + year + "-" + String.format("%06d", count);
    }
}
