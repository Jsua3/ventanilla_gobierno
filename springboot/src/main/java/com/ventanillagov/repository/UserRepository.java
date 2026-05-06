package com.ventanillagov.repository;

import com.ventanillagov.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCedula(String cedula);
    Optional<User> findByEmail(String email);
    boolean existsByCedula(String cedula);
    boolean existsByEmail(String email);
}
