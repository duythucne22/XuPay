package com.fintech.user.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class LoggingFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // Log incoming request (excluding sensitive data)
        log.info("Incoming: {} {} - TraceID: {}", 
            httpRequest.getMethod(), 
            httpRequest.getRequestURI(),
            httpRequest.getHeader("X-Trace-ID"));
        
        chain.doFilter(request, response);
    }
}