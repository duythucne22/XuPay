package com.fintech.user.exception;

import com.fintech.user.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFound(
            UserNotFoundException e,
            HttpServletRequest request) {
        
        log.warn("User not found: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<?>> handleUserExists(
            UserAlreadyExistsException e,
            HttpServletRequest request) {
        
        log.warn("User already exists: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidPassword(
            InvalidPasswordException e,
            HttpServletRequest request) {
        
        log.warn("Invalid password: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(
            MethodArgumentNotValidException e,
            HttpServletRequest request) {
        
        String errors = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining(", "));
        
        log.warn("Validation error: {}", errors);
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.builder()
                .success(false)
                .message("Validation failed: " + errors)
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgument(
            IllegalArgumentException e,
            HttpServletRequest request) {
        
        log.warn("Illegal argument: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneric(
            Exception e,
            HttpServletRequest request) {
        
        log.error("Unexpected error", e);
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.builder()
                .success(false)
                .message("Internal server error")
                .traceId(request.getHeader("X-Trace-ID"))
                .timestamp(LocalDateTime.now())
                .build());
    }
}