package com.ventanillagov.security;

import com.ventanillagov.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String cedula) throws UsernameNotFoundException {
        return userRepository.findByCedula(cedula)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + cedula));
    }
}
