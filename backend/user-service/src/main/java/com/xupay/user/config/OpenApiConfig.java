package com.xupay.user.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI (Swagger) Configuration
 * Provides interactive API documentation at /swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI userServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("XuPay User Service API")
                        .version("1.0.0")
                        .description("""
                                User Service manages user identity, authentication, KYC verification, and transaction limits.
                                
                                ## Features
                                - User registration and JWT authentication
                                - KYC document upload and verification workflow
                                - Transaction limit enforcement based on KYC tier
                                - User profile and contact management
                                - gRPC server for inter-service communication
                                
                                ## Authentication
                                Most endpoints require JWT authentication. Include the token in the Authorization header:
                                ```
                                Authorization: Bearer <your_jwt_token>
                                ```
                                
                                ## KYC Tiers
                                - **TIER_0**: New users - $500/day send limit
                                - **TIER_1**: Basic verification - $5000/day send limit
                                - **TIER_2**: Enhanced verification - $50000/day send limit
                                - **TIER_3**: Premium customers - $100000/day send limit
                                """)
                        .contact(new Contact()
                                .name("XuPay Development Team")
                                .email("dev@xupay.com")
                                .url("https://xupay.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api-dev.xupay.com")
                                .description("Development Environment"),
                        new Server()
                                .url("https://api.xupay.com")
                                .description("Production Environment")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("""
                                        JWT token obtained from /api/auth/login or /api/auth/register.
                                        
                                        Token expires after 24 hours.
                                        
                                        Token payload includes:
                                        - sub: User ID
                                        - email: User email
                                        - kycStatus: KYC verification status
                                        - kycTier: Transaction limit tier
                                        """)))
                .addSecurityItem(new SecurityRequirement()
                        .addList("bearerAuth"));
    }
}
