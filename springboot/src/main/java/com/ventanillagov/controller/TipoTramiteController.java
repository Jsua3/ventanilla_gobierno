package com.ventanillagov.controller;

import com.ventanillagov.entity.Entidad;
import com.ventanillagov.entity.TipoTramite;
import com.ventanillagov.service.TipoTramiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos")
@RequiredArgsConstructor
public class TipoTramiteController {

    private final TipoTramiteService tipoTramiteService;

    @GetMapping
    public ResponseEntity<List<TipoTramite>> listar(
            @RequestParam(required = false) Long entidadId) {
        if (entidadId != null) {
            return ResponseEntity.ok(tipoTramiteService.listarPorEntidad(entidadId));
        }
        return ResponseEntity.ok(tipoTramiteService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoTramite> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(tipoTramiteService.obtenerPorId(id));
    }

    @GetMapping("/entidades")
    public ResponseEntity<List<Entidad>> entidades() {
        return ResponseEntity.ok(tipoTramiteService.listarEntidades());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TipoTramite> crear(@RequestBody TipoTramite tipoTramite) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoTramiteService.crear(tipoTramite));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TipoTramite> actualizar(@PathVariable Long id, @RequestBody TipoTramite datos) {
        return ResponseEntity.ok(tipoTramiteService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        tipoTramiteService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
