package com.xupay.user;

import net.devh.boot.grpc.server.autoconfigure.GrpcServerSecurityAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * XuPay User Service - Main Application Entry Point
 * 
 * Responsibilities:
 * - User registration and authentication (JWT)
 * - KYC document verification workflow
 * - Transaction limit management (tier-based)
 * - gRPC server for Payment Service integration
 * 
 * Port: 8081 (HTTP REST), 50053 (gRPC)
 * Database: user_db (PostgreSQL)
 */
@SpringBootApplication(exclude = {GrpcServerSecurityAutoConfiguration.class})
@EnableJpaAuditing
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

