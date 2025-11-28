package com.fintech.user.controller;

import com.fintech.user.dto.*;
import com.fintech.user.exception.UserNotFoundException;
import com.fintech.user.mapper.UserDTOMapper;
import com.fintech.user.model.User;
import com.fintech.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final UserDTOMapper userDTOMapper;
    
    /**
     * Register a new user
     * POST /api/v1/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        
        log.info("Register request for email: {}", request.getEmail());
        
        String ipAddress = getClientIp(httpRequest);
        User user = userService.registerUser(request, ipAddress);
        UserDTO dto = userDTOMapper.toDTO(user);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(dto));
    }
    
    /**
     * Login user
     * POST /api/v1/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDTO>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        
        log.info("Login request for email: {}", request.getEmail());
        
        String ipAddress = getClientIp(httpRequest);
        User user = userService.login(request, ipAddress);
        UserDTO dto = userDTOMapper.toDTO(user);
        
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
    
    /**
     * Get user by ID
     * GET /api/v1/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(
            @PathVariable String userId,
            @RequestHeader(value = "X-Trace-ID", required = false) String traceId) {
        
        log.info("[{}] Get user request: {}", traceId, userId);
        
        User user = userService.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        UserDTO dto = userDTOMapper.toDTO(user);
        
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
    
    /**
     * Health check
     * GET /api/v1/users/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("User Service is healthy"));
    }
    
    /**
     * Extract client IP from request
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}