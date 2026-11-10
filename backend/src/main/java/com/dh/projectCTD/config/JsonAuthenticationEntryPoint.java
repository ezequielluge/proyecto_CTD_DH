package com.dh.projectCTD.config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 401 for requests to protected endpoints without a valid token (missing, expired or invalid).
 */
@Component
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        SecurityErrorWriter.write(
            response,
            HttpServletResponse.SC_UNAUTHORIZED,
            "Necesitás iniciar sesión para acceder a este recurso."
        );
    }
}
