package com.fintech.user.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StartupLogger {

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("===========================================");
        log.info("User Service Started!");
        log.info("REST API: http://localhost:8081");
        log.info("gRPC: localhost:50053");
        log.info("===========================================");
        
        // Check if gRPC classes are loaded
        try {
            Class.forName("net.devh.boot.grpc.server.autoconfigure.GrpcServerAutoConfiguration");
            log.info("gRPC Server AutoConfiguration is available");
        } catch (ClassNotFoundException e) {
            log.error("gRPC Server AutoConfiguration NOT FOUND - check dependencies!");
        }
    }
}