package com.dh.projectCTD.config;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 403 for authenticated users without the required role (URL rules in SecurityConfiguration).
 * Denials from @PreAuthorize inside controllers are handled by GlobalException with the same message.
 */
@Component
public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
        HttpServletRequest request,
        HttpServletResponse response,
        AccessDeniedException accessDeniedException
    ) throws IOException {
        SecurityErrorWriter.write(
            response,
            HttpServletResponse.SC_FORBIDDEN,
            "No tenés permisos para realizar esta acción."
        );
    }
}
