package com.xupay.user.service.impl;

import com.xupay.user.dto.response.DailyUsageResponse;
import com.xupay.user.dto.response.LimitCheckResponse;
import com.xupay.user.dto.response.UserLimitsResponse;
import com.xupay.user.entity.DailyUsage;
import com.xupay.user.entity.TransactionLimit;
import com.xupay.user.entity.User;
import com.xupay.user.exception.UserNotFoundException;
import com.xupay.user.repository.DailyUsageRepository;
import com.xupay.user.repository.TransactionLimitRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.LimitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

/**
 * LimitServiceImpl
 * Implementation of transaction limit management and enforcement.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LimitServiceImpl implements LimitService {

    private final UserRepository userRepository;
    private final TransactionLimitRepository transactionLimitRepository;
    private final DailyUsageRepository dailyUsageRepository;

    @Override
    @Transactional(readOnly = true)
    public UserLimitsResponse getUserLimits(UUID userId) {
        log.debug("Fetching transaction limits for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Get limits for user's tier
        String tierName = user.getKycTier().name().toLowerCase();
        TransactionLimit limits = transactionLimitRepository.findByTierName(tierName)
                .orElseThrow(() -> new RuntimeException("Transaction limits not found for tier: " + tierName));

        return new UserLimitsResponse(
                user.getKycTier(),
                limits.getDailySendLimitCents(),
                limits.getDailyReceiveLimitCents(),
                limits.getMonthlyVolumeLimitCents(),
                limits.getSingleTransactionMaxCents(),
                limits.getMaxTransactionsPerHour(),
                limits.getMaxTransactionsPerDay(),
                limits.getCanSendInternational(),
                limits.getCanReceiveMerchantPayments()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DailyUsageResponse getDailyUsage(UUID userId) {
        log.debug("Fetching daily usage for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Get limits for user's tier
        String tierName = user.getKycTier().name().toLowerCase();
        TransactionLimit limits = transactionLimitRepository.findByTierName(tierName)
                .orElseThrow(() -> new RuntimeException("Transaction limits not found for tier: " + tierName));

        // Get today's usage
        Optional<DailyUsage> usageOpt = dailyUsageRepository.findTodayUsage(userId);
        LocalDate today = LocalDate.now();

        DailyUsage usage = usageOpt.orElse(DailyUsage.builder()
                .user(user)
                .usageDate(today)
                .totalSentCents(0L)
                .totalReceivedCents(0L)
                .totalSentCount(0)
                .totalReceivedCount(0)
                .build());

        Long remaining = limits.getDailySendLimitCents() - usage.getTotalSentCents();
        int transactionCount = (usage.getTotalSentCount() != null ? usage.getTotalSentCount() : 0) + 
                               (usage.getTotalReceivedCount() != null ? usage.getTotalReceivedCount() : 0);

        return new DailyUsageResponse(
                today,
                usage.getTotalSentCents(),
                usage.getTotalReceivedCents(),
                transactionCount,
                limits.getDailySendLimitCents(),
                Math.max(0L, remaining)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LimitCheckResponse checkTransactionAllowed(UUID userId, Long amountCents, String type) {
        log.debug("Checking if user {} can {} {} cents", userId, type, amountCents);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Check if user can transact
        if (!user.canTransact()) {
            return new LimitCheckResponse(false, "Account not active or KYC not approved", 0L);
        }

        // Get limits
        String tierName = user.getKycTier().name().toLowerCase();
        TransactionLimit limits = transactionLimitRepository.findByTierName(tierName)
                .orElseThrow(() -> new RuntimeException("Transaction limits not found for tier: " + tierName));

        // Check single transaction max
        if (!limits.isAmountWithinSingleLimit(amountCents)) {
            return new LimitCheckResponse(
                    false,
                    "Amount exceeds single transaction limit of " + limits.getSingleTransactionMaxDollars(),
                    0L
            );
        }

        // Get today's usage
        Optional<DailyUsage> usageOpt = dailyUsageRepository.findTodayUsage(userId);
        LocalDate today = LocalDate.now();
        DailyUsage usage = usageOpt.orElse(DailyUsage.builder()
                .user(user)
                .usageDate(today)
                .totalSentCents(0L)
                .totalReceivedCents(0L)
                .totalSentCount(0)
                .totalReceivedCount(0)
                .build());

        // Check daily limit based on type
        if ("send".equalsIgnoreCase(type)) {
            if (!limits.isDailySendWithinLimit(usage.getTotalSentCents(), amountCents)) {
                Long remaining = limits.getDailySendLimitCents() - usage.getTotalSentCents();
                return new LimitCheckResponse(
                        false,
                        "Would exceed daily send limit",
                        Math.max(0L, remaining)
                );
            }
            Long remaining = limits.getDailySendLimitCents() - usage.getTotalSentCents() - amountCents;
            return new LimitCheckResponse(true, "Transaction allowed", Math.max(0L, remaining));
        } else {
            if (!limits.isDailyReceiveWithinLimit(usage.getTotalReceivedCents(), amountCents)) {
                Long remaining = limits.getDailyReceiveLimitCents() - usage.getTotalReceivedCents();
                return new LimitCheckResponse(
                        false,
                        "Would exceed daily receive limit",
                        Math.max(0L, remaining)
                );
            }
            Long remaining = limits.getDailyReceiveLimitCents() - usage.getTotalReceivedCents() - amountCents;
            return new LimitCheckResponse(true, "Transaction allowed", Math.max(0L, remaining));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canSend(UUID userId, Long amountCents) {
        LimitCheckResponse response = checkTransactionAllowed(userId, amountCents, "send");
        return response.allowed();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canReceive(UUID userId, Long amountCents) {
        LimitCheckResponse response = checkTransactionAllowed(userId, amountCents, "receive");
        return response.allowed();
    }
}
