package com.dh.projectCTD.authentication;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dh.projectCTD.config.JwtService;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.exception.UserAlreadyExistsException;
import com.dh.projectCTD.model.Role;
import com.dh.projectCTD.model.User;
import com.dh.projectCTD.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new UserAlreadyExistsException("Este email ya se encuentra registrado!");

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        var savedUser = userRepository.save(user);
        var jwt = jwtService.generateToken(savedUser);

        return AuthenticationResponse.builder()
                .token(jwt)
                .id(savedUser.getId())
                .firstname(savedUser.getFirstname())
                .lastname(savedUser.getLastname())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().toString())
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .build();
    }

    public AuthenticationResponse tokenValidation(String token) {
        String userEmail = jwtService.extractUsername(token);
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (jwtService.isTokenValid(token, user)) {
            return AuthenticationResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .firstname(user.getFirstname())
                    .lastname(user.getLastname())
                    .email(user.getEmail())
                    .role(user.getRole().toString())
                    .build();
        }

        throw new RuntimeException("Invalid token");
    }
}
