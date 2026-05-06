package com.ventanillagov.controller;

import com.ventanillagov.dto.ComentarioRequest;
import com.ventanillagov.dto.TramiteRequest;
import com.ventanillagov.dto.TramiteResponse;
import com.ventanillagov.service.TramiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TramiteController {

    private final TramiteService tramiteService;

    // ── Ciudadano ──────────────────────────────────────────────────────────────

    @GetMapping("/api/tramites")
    public ResponseEntity<List<TramiteResponse>> listar(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(tramiteService.listarMios(user.getUsername(), estado));
    }

    @PostMapping("/api/tramites")
    public ResponseEntity<TramiteResponse> crear(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody TramiteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tramiteService.crear(user.getUsername(), request));
    }

    @GetMapping("/api/tramites/{id}")
    public ResponseEntity<TramiteResponse> detalle(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.detalle(user.getUsername(), id));
    }

    @PatchMapping("/api/tramites/{id}/enviar")
    public ResponseEntity<TramiteResponse> enviar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.enviar(user.getUsername(), id));
    }

    @PatchMapping("/api/tramites/{id}/cancelar")
    public ResponseEntity<TramiteResponse> cancelar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.cancelar(user.getUsername(), id));
    }

    // ── Funcionario / Admin ────────────────────────────────────────────────────

    @GetMapping("/api/funcionario/tramites")
    public ResponseEntity<Map<String, Object>> pendientes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(tramiteService.listarPendientes(page, size));
    }

    @PatchMapping("/api/funcionario/tramites/{id}/revisar")
    public ResponseEntity<TramiteResponse> revisar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.revisar(user.getUsername(), id));
    }

    @PatchMapping("/api/funcionario/tramites/{id}/aprobar")
    public ResponseEntity<TramiteResponse> aprobar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody(required = false) ComentarioRequest body) {
        String comentario = body != null ? body.getComentario() : null;
        return ResponseEntity.ok(tramiteService.aprobar(user.getUsername(), id, comentario));
    }

    @PatchMapping("/api/funcionario/tramites/{id}/rechazar")
    public ResponseEntity<TramiteResponse> rechazar(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody ComentarioRequest body) {
        return ResponseEntity.ok(tramiteService.rechazar(user.getUsername(), id, body.getComentario()));
    }
}
