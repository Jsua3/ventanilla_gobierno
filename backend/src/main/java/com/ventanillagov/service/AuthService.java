package com.ventanillagov.service;

import com.ventanillagov.dto.AuthResponse;
import com.ventanillagov.dto.LoginRequest;
import com.ventanillagov.dto.RegisterRequest;
import com.ventanillagov.entity.Rol;
import com.ventanillagov.entity.User;
import com.ventanillagov.repository.UserRepository;
import com.ventanillagov.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByCedula(request.getCedula())) {
            throw new RuntimeException("La cédula ya está registrada");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = User.builder()
                .cedula(request.getCedula())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CIUDADANO)
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return buildResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        String token = jwtUtil.generateToken(user);
        return buildResponse(user, token);
    }

    public User me(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .cedula(user.getCedula())
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .email(user.getEmail())
                .rol(user.getRol())
                .build();
    }
}
