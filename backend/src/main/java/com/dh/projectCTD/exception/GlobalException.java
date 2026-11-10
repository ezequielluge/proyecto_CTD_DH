package com.dh.projectCTD.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

/**
 * Centralized error handling. Every error response shares the same shape:
 * { "error": "message" }
 * Validation errors additionally include a field -> message map:
 * { "error": "message", "errors": { "field": "message" } }
 */
@ControllerAdvice
public class GlobalException {

    private static final Logger log = LoggerFactory.getLogger(GlobalException.class);

    // ---------- Custom exceptions ----------

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> processResourceNotFoundException(ResourceNotFoundException exception) {
        return buildError(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> processBadRequestException(BadRequestException exception) {
        return buildError(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> processUserAlreadyExistsException(UserAlreadyExistsException exception) {
        return buildError(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(FeatureAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> processFeatureAlreadyExistsException(FeatureAlreadyExistsException exception) {
        return buildError(HttpStatus.CONFLICT, exception.getMessage());
    }

    // ---------- Validation ----------

    // @Valid on @RequestBody / @RequestPart
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> processValidationException(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return buildValidationError(errors);
    }

    // Constraints placed directly on method parameters (@RequestParam, @PathVariable)
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Map<String, Object>> processMethodValidationException(HandlerMethodValidationException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getParameterValidationResults().forEach(result ->
                result.getResolvableErrors().forEach(error ->
                        errors.putIfAbsent(result.getMethodParameter().getParameterName(), error.getDefaultMessage())));
        return buildValidationError(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> processIllegalArgumentException(IllegalArgumentException exception) {
        return buildError(HttpStatus.BAD_REQUEST, "Solicitud inválida: " + exception.getMessage());
    }

    // ---------- Security ----------

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> processBadCredentialsException(BadCredentialsException exception) {
        return buildError(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos.");
    }

    // Any other authentication failure (user not found, disabled account, etc.)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> processAuthenticationException(AuthenticationException exception) {
        return buildError(HttpStatus.UNAUTHORIZED, "No se pudo autenticar. Verificá tus credenciales.");
    }

    // Thrown by @PreAuthorize when the user lacks the required role
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> processAccessDeniedException(AccessDeniedException exception) {
        return buildError(HttpStatus.FORBIDDEN, "No tenés permisos para realizar esta acción.");
    }

    // ---------- Fallback ----------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> processGenericException(Exception exception) {
        // Standard Spring MVC exceptions (malformed JSON, missing part, 405, 404 of static resource, etc.)
        // already carry their own status: keep it instead of turning them into a 500.
        if (exception instanceof ErrorResponse errorResponse) {
            HttpStatusCode status = errorResponse.getStatusCode();
            String message = status.is4xxClientError()
                    ? "La solicitud no es válida."
                    : "Ocurrió un error inesperado. Intentá nuevamente más tarde.";
            return buildError(status, message);
        }

        log.error("Unhandled exception", exception);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado. Intentá nuevamente más tarde.");
    }

    // ---------- Helpers ----------

    private ResponseEntity<Map<String, Object>> buildError(HttpStatusCode status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", message);
        return ResponseEntity.status(status).body(body);
    }

    private ResponseEntity<Map<String, Object>> buildValidationError(Map<String, String> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Los datos enviados no son válidos.");
        body.put("errors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

}
