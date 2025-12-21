package com.xupay.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.payment.dto.CreateWalletRequest;
import com.xupay.payment.dto.CreateWalletResponse;
import com.xupay.payment.dto.FreezeWalletRequest;
import com.xupay.payment.dto.WalletBalanceResponse;
import com.xupay.payment.entity.enums.WalletType;
import com.xupay.payment.service.WalletService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WalletController.class)
@AutoConfigureMockMvc(addFilters = false)
class WalletControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private WalletService walletService;

    @Test
    @DisplayName("POST /api/wallets - Should create wallet")
    void createWallet_returnsCreated_withValidRequest() throws Exception {
        UUID userId = UUID.randomUUID();
        // Uses WalletType.PERSONAL based on previous fix
        CreateWalletRequest req = new CreateWalletRequest(userId, WalletType.PERSONAL, "VND");

        CreateWalletResponse resp = CreateWalletResponse.builder()
            .walletId(UUID.randomUUID())
            .userId(userId)
            .glAccountCode("GL-100")
            .walletType(WalletType.PERSONAL)
            .currency("VND")
            .balanceCents(0L)
            // REMOVED: .status(WalletStatus.ACTIVE) to fix compilation error
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .build();

        when(walletService.createWallet(any(CreateWalletRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/wallets")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.walletId").exists())
            .andExpect(jsonPath("$.userId").value(userId.toString()));
    }

    @Test
    @DisplayName("GET /api/wallets/user/{userId} - Should return wallet by user")
    void getWalletByUserId_returnsOk() throws Exception {
        UUID userId = UUID.randomUUID();
        WalletBalanceResponse resp = WalletBalanceResponse.builder()
            .walletId(UUID.randomUUID())
            .userId(userId)
            .balanceCents(500000L)
            .balanceAmount(BigDecimal.valueOf(5000.00))
            .currency("VND")
            .isActive(true)
            .isFrozen(false)
            .build();

        when(walletService.getWalletByUserId(eq(userId))).thenReturn(resp);

        mockMvc.perform(get("/api/wallets/user/" + userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.balanceCents").value(500000));
    }

    @Test
    @DisplayName("GET /api/wallets/{walletId}/balance - Should return balance")
    void getWalletBalance_returnsOk() throws Exception {
        UUID walletId = UUID.randomUUID();
        WalletBalanceResponse resp = WalletBalanceResponse.builder()
            .walletId(walletId)
            .userId(UUID.randomUUID())
            .balanceCents(250000L)
            .balanceAmount(BigDecimal.valueOf(2500.00))
            .currency("VND")
            .isActive(true)
            .isFrozen(false)
            .build();

        when(walletService.getWalletBalance(eq(walletId))).thenReturn(resp);

        mockMvc.perform(get("/api/wallets/" + walletId + "/balance"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.balanceCents").value(250000));
    }

    @Test
    @DisplayName("PUT /api/wallets/{walletId}/freeze - Should freeze/unfreeze wallet")
    void freezeWallet_returnsOk() throws Exception {
        UUID walletId = UUID.randomUUID();
        // Uses constructor with reason string based on previous fix
        FreezeWalletRequest req = new FreezeWalletRequest(true, "Admin Action");

        doNothing().when(walletService).freezeWallet(eq(walletId), any(FreezeWalletRequest.class));

        mockMvc.perform(put("/api/wallets/" + walletId + "/freeze")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk());
    }
}