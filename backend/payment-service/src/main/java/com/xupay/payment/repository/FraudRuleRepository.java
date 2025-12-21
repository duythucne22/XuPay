package com.xupay.payment.repository;

import com.xupay.payment.entity.FraudRule;
import com.xupay.payment.entity.enums.RuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * FraudRuleRepository
 * Data access for fraud detection rules.
 * 
 * Query Methods:
 * - findByIsActiveTrueOrderByRiskScorePenaltyDesc: Get all active rules sorted by risk (high to low)
 * - findByRuleName: Find specific rule by name
 * - findByRuleTypeAndIsActiveTrue: Get active rules of specific type
 */
@Repository
public interface FraudRuleRepository extends JpaRepository<FraudRule, UUID> {

    /**
     * Find all active fraud rules, ordered by risk score (highest first).
     * Used by fraud detection service to evaluate transactions.
     * 
     * @return List of active rules sorted by risk score descending
     */
    List<FraudRule> findByIsActiveTrueOrderByRiskScorePenaltyDesc();

    /**
     * Find fraud rule by name.
     * 
     * @param ruleName Rule name (unique)
     * @return Optional of fraud rule
     */
    Optional<FraudRule> findByRuleName(String ruleName);

    /**
     * Find all active fraud rules (no specific order).
     * 
     * @return List of active rules
     */
    List<FraudRule> findByIsActiveTrue();

    /**
     * Find all active fraud rules of specific type.
     * Example: Get all VELOCITY rules to check transaction frequency.
     * 
     * @param ruleType Type of rule (VELOCITY, AMOUNT_THRESHOLD, etc.)
     * @return List of active rules of specified type
     */
    List<FraudRule> findByRuleTypeAndIsActiveTrue(RuleType ruleType);
}
