package com.ventanillagov.controller;

import com.ventanillagov.dto.ComentarioRequest;
import com.ventanillagov.dto.TramiteRequest;
import com.ventanillagov.dto.TramiteResponse;
import com.ventanillagov.service.TramiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tramites")
@RequiredArgsConstructor
public class TramiteController {

    private final TramiteService tramiteService;

    @GetMapping
    public ResponseEntity<List<TramiteResponse>> listar(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(tramiteService.listarMios(user.getUsername(), estado));
    }

    @PostMapping
    public ResponseEntity<TramiteResponse> crear(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody TramiteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tramiteService.crear(user.getUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TramiteResponse> detalle(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.detalle(user.getUsername(), id));
    }

    @PatchMapping("/{id}/enviar")
    public ResponseEntity<TramiteResponse> enviar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.enviar(user.getUsername(), id));
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('FUNCIONARIO','ADMIN')")
    public ResponseEntity<TramiteResponse> aprobar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody(required = false) ComentarioRequest body) {
        String comentario = body != null ? body.getComentario() : null;
        return ResponseEntity.ok(tramiteService.aprobar(user.getUsername(), id, comentario));
    }

    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('FUNCIONARIO','ADMIN')")
    public ResponseEntity<TramiteResponse> rechazar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody ComentarioRequest body) {
        return ResponseEntity.ok(tramiteService.rechazar(user.getUsername(), id, body.getComentario()));
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasAnyRole('FUNCIONARIO','ADMIN')")
    public ResponseEntity<Map<String, Object>> pendientes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(tramiteService.listarPendientes(page, size));
    }

    @PatchMapping("/{id}/revisar")
    @PreAuthorize("hasAnyRole('FUNCIONARIO','ADMIN')")
    public ResponseEntity<TramiteResponse> revisar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.revisar(user.getUsername(), id));
    }
}
