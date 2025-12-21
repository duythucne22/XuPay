package com.xupay.user.security;

import com.xupay.user.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

/**
 * JwtAuthenticationFilter
 * Intercepts every request, extracts JWT from Authorization header,
 * validates token, and sets Spring Security context.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // Extract JWT token from Authorization header
            String token = extractTokenFromRequest(request);

            // If no token found, continue without authentication
            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Validate token
            if (!jwtService.validateToken(token)) {
                log.warn("Invalid JWT token for request: {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            // Extract user information from token
            UUID userId = jwtService.getUserIdFromToken(token);
            String email = jwtService.getEmailFromToken(token);

            // Set authentication in SecurityContext
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userId.toString(),   // Principal (user ID as string for Principal#getName())
                        token,               // Credentials (token for downstream use)
                        Collections.emptyList()  // Authorities (roles - can add later)
                    );

                // Set request details
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Authenticated user {} for request: {}", email, request.getRequestURI());
            }

        } catch (Exception e) {
            log.error("Cannot set user authentication in SecurityContext", e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from Authorization header
     * Format: "Bearer {token}"
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }

        return null;
    }
}
