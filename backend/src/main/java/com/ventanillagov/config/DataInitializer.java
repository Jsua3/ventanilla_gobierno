package com.ventanillagov.config;

import com.ventanillagov.entity.*;
import com.ventanillagov.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final TipoTramiteRepository tipoRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        log.info("Inicializando datos de prueba...");

        userRepo.save(User.builder().cedula("000000000").nombre("Admin").apellido("Sistema")
                .email("admin@gov.co").password(encoder.encode("admin123")).rol(Rol.ADMIN).build());
        userRepo.save(User.builder().cedula("111111111").nombre("Carlos").apellido("Funcionario")
                .email("func@gov.co").password(encoder.encode("func123")).rol(Rol.FUNCIONARIO).build());
        userRepo.save(User.builder().cedula("222222222").nombre("María").apellido("García")
                .email("user@gov.co").password(encoder.encode("user123")).rol(Rol.CIUDADANO).build());

        tipoRepo.save(TipoTramite.builder().nombre("Renovación de cédula")
                .descripcion("Renovación de la cédula de ciudadanía vigente o deteriorada")
                .entidad("Registraduría").diasEstimado(5).build());
        tipoRepo.save(TipoTramite.builder().nombre("Pasaporte")
                .descripcion("Obtención o renovación del pasaporte colombiano")
                .entidad("Registraduría").diasEstimado(15).build());
        tipoRepo.save(TipoTramite.builder().nombre("Declaración de renta")
                .descripcion("Presentación de declaración de renta persona natural")
                .entidad("DIAN").diasEstimado(3).build());
        tipoRepo.save(TipoTramite.builder().nombre("Inscripción RUT")
                .descripcion("Inscripción o actualización del Registro Único Tributario")
                .entidad("DIAN").diasEstimado(1).build());
        tipoRepo.save(TipoTramite.builder().nombre("Afiliación EPS")
                .descripcion("Afiliación al régimen contributivo de salud")
                .entidad("Secretaría de Salud").diasEstimado(7).build());
        tipoRepo.save(TipoTramite.builder().nombre("Certificado de salud")
                .descripcion("Obtención del certificado médico ocupacional")
                .entidad("Secretaría de Salud").diasEstimado(2).build());

        log.info("=== VentanillaGov listo ===");
        log.info("Backend local:    http://localhost:8080");
        log.info("Frontend local:   http://localhost:4200");
        log.info("Credenciales de prueba:");
        log.info("  Admin:       admin@gov.co     / admin123");
        log.info("  Funcionario: func@gov.co      / func123");
        log.info("  Ciudadano:   user@gov.co      / user123");
    }
}
