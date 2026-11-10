package com.dh.projectCTD.controller;

import com.dh.projectCTD.authentication.AuthenticationController;
import com.dh.projectCTD.authentication.AuthenticationRequest;
import com.dh.projectCTD.authentication.AuthenticationResponse;
import com.dh.projectCTD.authentication.AuthenticationService;
import com.dh.projectCTD.authentication.RegisterRequest;
import com.dh.projectCTD.config.JwtService;
import com.dh.projectCTD.dto.ResendEmailRequestDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.exception.UserAlreadyExistsException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest 
@ActiveProfiles("test")
@AutoConfigureMockMvc (addFilters = false)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean 
    private AuthenticationService authenticationService;

    @MockitoBean 
    private JwtService jwtService;

    @MockitoBean 
    private UserDetailsService userDetailsService;

    private AuthenticationResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        mockAuthResponse = AuthenticationResponse.builder()
                .token("mock-jwt-token")
                .id(1L)
                .firstname("Ezequiel")
                .lastname("Luge")
                .email("ezequiel@test.com")
                .role("ROLE_USER")
                .build();
    }

    @Nested
    @DisplayName("Tests para POST /auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Debe registrar usuario exitosamente y retornar 200 OK con datos y JWT")
        void register_Success() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .firstname("Ezequiel")
                    .lastname("Luge")
                    .email("ezequiel@test.com")
                    .password("Password123!")
                    .build();

            when(authenticationService.register(any(RegisterRequest.class))).thenReturn(mockAuthResponse);

            mockMvc.perform(post("/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                    .andExpect(jsonPath("$.id").value(1L))
                    .andExpect(jsonPath("$.email").value("ezequiel@test.com"))
                    .andExpect(jsonPath("$.firstname").value("Ezequiel"))
                    .andExpect(jsonPath("$.role").value("ROLE_USER"));
        }

        @Test
        @DisplayName("Debe retornar 409 Conflict cuando el email ya se encuentra registrado")
        void register_EmailAlreadyExists() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .firstname("Ezequiel")
                    .lastname("Luge")
                    .email("ezequiel@test.com")
                    .password("Password123!")
                    .build();

            when(authenticationService.register(any(RegisterRequest.class)))
                    .thenThrow(new UserAlreadyExistsException("Este email ya se encuentra registrado!"));

            mockMvc.perform(post("/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.error").value("Este email ya se encuentra registrado!"));
        }
    }

//     @Nested
//     @DisplayName("Tests para POST /auth/login")
//     class LoginTests {

//         @Test
//         @DisplayName("Debe autenticar correctamente y retornar 200 OK con token")
//         void login_Success() throws Exception {
//             AuthenticationRequest request = AuthenticationRequest.builder()
//                     .email("ezequiel@test.com")
//                     .password("Password123!")
//                     .build();

//             when(authenticationService.login(any(AuthenticationRequest.class))).thenReturn(mockAuthResponse);

//             mockMvc.perform(post("/auth/login")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(request)))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$.token").value("mock-jwt-token"))
//                     .andExpect(jsonPath("$.email").value("ezequiel@test.com"));
//         }
//     }

//     @Nested
//     @DisplayName("Tests para POST /auth/token-validation")
//     class TokenValidationTests {

//         @Test
//         @DisplayName("Debe validar el token y retornar 200 OK")
//         void tokenValidation_Success() throws Exception {
//             String token = "Bearer mock-jwt-token";

//             when(authenticationService.tokenValidation(anyString())).thenReturn(mockAuthResponse);

//             mockMvc.perform(post("/auth/token-validation")
//                             .header("Authorization", token))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$.token").value("mock-jwt-token"))
//                     .andExpect(jsonPath("$.email").value("ezequiel@test.com"));
//         }

//         @Test
//         @DisplayName("Debe retornar 404 Not Found cuando el usuario del token no existe")
//         void tokenValidation_UserNotFound() throws Exception {
//             String token = "Bearer token-invalido";

//             when(authenticationService.tokenValidation(anyString()))
//                     .thenThrow(new ResourceNotFoundException("User not found"));

//             mockMvc.perform(post("/auth/token-validation")
//                             .header("Authorization", token))
//                     .andExpect(status().isNotFound())
//                     .andExpect(jsonPath("$.error").value("User not found"));
//         }
//     }

//     @Nested
//     @DisplayName("Tests para POST /auth/resend-confirmation")
//     class ResendConfirmationTests {

//         @Test
//         @DisplayName("Debe reenviar el correo exitosamente y retornar 200 OK")
//         void resendConfirmation_Success() throws Exception {
//             ResendEmailRequestDTO request = new ResendEmailRequestDTO("ezequiel@test.com");

//             doNothing().when(authenticationService).resendConfirmationEmail("ezequiel@test.com");

//             mockMvc.perform(post("/auth/resend-confirmation")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(request)))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$.message").value("Correo de confirmación reenviado exitosamente."));
//         }

//         @Test
//         @DisplayName("Debe retornar 404 Not Found si el email no pertenece a un usuario registrado")
//         void resendConfirmation_EmailNotFound() throws Exception {
//             ResendEmailRequestDTO request = new ResendEmailRequestDTO("noexiste@test.com");

//             doThrow(new ResourceNotFoundException("No se encontró un usuario registrado con el email: noexiste@test.com"))
//                     .when(authenticationService).resendConfirmationEmail("noexiste@test.com");

//             mockMvc.perform(post("/auth/resend-confirmation")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(request)))
//                     .andExpect(status().isNotFound())
//                     .andExpect(jsonPath("$.error").value("No se encontró un usuario registrado con el email: noexiste@test.com"));
//         }
//     }
}