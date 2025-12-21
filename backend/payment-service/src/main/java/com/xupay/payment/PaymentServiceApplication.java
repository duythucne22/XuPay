package com.xupay.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PaymentServiceApplication
 * Main entry point for XuPay Payment Service.
 * 
 * Responsibilities:
 * - Double-entry ledger accounting
 * - Wallet management
 * - P2P transfers with idempotency
 * - Fraud detection
 * - Integration with User Service via gRPC
 */
@SpringBootApplication
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
