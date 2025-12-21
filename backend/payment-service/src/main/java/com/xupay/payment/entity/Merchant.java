package com.xupay.payment.entity;

import com.xupay.payment.entity.enums.SettlementFrequency;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Merchant
 * Merchant account information.
 * Maps to: merchants table
 */
@Entity
@Table(name = "merchants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "wallet_id", nullable = false, unique = true)
    private UUID walletId;

    @Column(name = "business_name", nullable = false, length = 255)
    private String businessName;

    @Column(name = "business_registration_number", length = 100)
    private String businessRegistrationNumber;

    @Column(name = "business_type", length = 50)
    private String businessType;

    @Column(name = "merchant_fee_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal merchantFeePercentage = new BigDecimal("2.5");

    @Enumerated(EnumType.STRING)
    @Column(name = "settlement_frequency", nullable = false, length = 20)
    private SettlementFrequency settlementFrequency = SettlementFrequency.DAILY;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
