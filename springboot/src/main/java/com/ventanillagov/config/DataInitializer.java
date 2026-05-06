package com.ventanillagov.config;

import com.ventanillagov.entity.*;
import com.ventanillagov.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final EntidadRepository entidadRepo;
    private final TipoTramiteRepository tipoRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        log.info("Inicializando datos de prueba...");

        userRepo.save(User.builder().cedula("000000000").nombre("Admin").apellido("Sistema")
                .email("admin@ventanillagov.co").password(encoder.encode("admin123")).rol(Rol.ADMIN).build());
        userRepo.save(User.builder().cedula("111111111").nombre("Carlos").apellido("Funcionario")
                .email("funcionario@ventanillagov.co").password(encoder.encode("func123")).rol(Rol.FUNCIONARIO).build());
        userRepo.save(User.builder().cedula("222222222").nombre("María").apellido("García")
                .email("ciudadano@ventanillagov.co").password(encoder.encode("user123")).rol(Rol.CIUDADANO).build());

        Entidad rnec = entidadRepo.save(Entidad.builder().nombre("Registraduría Nacional del Estado Civil")
                .codigo("RNEC").descripcion("Identificación y registro civil de los colombianos").build());
        Entidad dian = entidadRepo.save(Entidad.builder().nombre("Dirección de Impuestos y Aduanas Nacionales")
                .codigo("DIAN").descripcion("Administración de impuestos y aduanas").build());
        Entidad sds = entidadRepo.save(Entidad.builder().nombre("Secretaría Distrital de Salud")
                .codigo("SDS").descripcion("Regulación del sector salud en el distrito").build());

        tipoRepo.save(TipoTramite.builder().nombre("Renovación de Cédula de Ciudadanía")
                .descripcion("Renovación de la cédula vigente o deteriorada").entidad(rnec)
                .documentosRequeridos("Cédula actual,Foto fondo blanco 3x4")
                .costoEstimado(BigDecimal.ZERO).diasEstimado(30).build());
        tipoRepo.save(TipoTramite.builder().nombre("Solicitud de Pasaporte")
                .descripcion("Obtención o renovación del pasaporte colombiano").entidad(rnec)
                .documentosRequeridos("Cédula de ciudadanía,Comprobante de pago")
                .costoEstimado(new BigDecimal("246000")).diasEstimado(5).build());
        tipoRepo.save(TipoTramite.builder().nombre("Declaración de Renta")
                .descripcion("Presentación de declaración de renta persona natural").entidad(dian)
                .documentosRequeridos("RUT,Certificados de ingresos,Extractos bancarios")
                .costoEstimado(BigDecimal.ZERO).diasEstimado(10).build());
        tipoRepo.save(TipoTramite.builder().nombre("Actualización de RUT")
                .descripcion("Actualización del Registro Único Tributario").entidad(dian)
                .documentosRequeridos("Cédula de ciudadanía,RUT actual")
                .costoEstimado(BigDecimal.ZERO).diasEstimado(1).build());
        tipoRepo.save(TipoTramite.builder().nombre("Afiliación a EPS")
                .descripcion("Afiliación al régimen contributivo de salud").entidad(sds)
                .documentosRequeridos("Cédula de ciudadanía,Contrato laboral")
                .costoEstimado(BigDecimal.ZERO).diasEstimado(7).build());
        tipoRepo.save(TipoTramite.builder().nombre("Certificado de Salud Ocupacional")
                .descripcion("Obtención del certificado médico ocupacional").entidad(sds)
                .documentosRequeridos("Cédula de ciudadanía")
                .costoEstimado(new BigDecimal("85000")).diasEstimado(3).build());

        log.info("═══════════════════════════════════════════");
        log.info("  VentanillaGov — Datos inicializados ✓");
        log.info("  Admin:       000000000 / admin123");
        log.info("  Funcionario: 111111111 / func123");
        log.info("  Ciudadano:   222222222 / user123");
        log.info("  API: http://localhost:8080/api");
        log.info("═══════════════════════════════════════════");
    }
}
