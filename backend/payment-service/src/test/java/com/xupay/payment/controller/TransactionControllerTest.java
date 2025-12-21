package com.xupay.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.payment.dto.TransactionDetailResponse;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.service.TransactionService;
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
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
@AutoConfigureMockMvc(addFilters = false)
class TransactionControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private TransactionService transactionService;

    @Test
    @DisplayName("POST /api/payments/transfer - Should create transaction when completed")
    void processTransfer_returnsCreated_whenCompleted() throws Exception {
        UUID idempotency = UUID.randomUUID();
        UUID fromUser = UUID.randomUUID();
        UUID toUser = UUID.randomUUID();

        TransferRequest req = new TransferRequest(idempotency, fromUser, toUser, 10000L, "Test", "127.0.0.1", "UA");

        TransferResponse resp = TransferResponse.builder()
            .transactionId(UUID.randomUUID())
            .idempotencyKey(idempotency)
            .fromUserId(fromUser)
            .toUserId(toUser)
            .amountCents(10000L)
            .amount(BigDecimal.valueOf(100.00))
            .currency("VND")
            .status(TransactionStatus.COMPLETED)
            .build();

        when(transactionService.processTransfer(any(TransferRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/payments/transfer")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("COMPLETED"))
            .andExpect(jsonPath("$.idempotencyKey").value(idempotency.toString()));
    }

    @Test
    @DisplayName("POST /api/payments/transfer - Should return OK when processing")
    void processTransfer_returnsOk_whenProcessing() throws Exception {
        UUID idempotency = UUID.randomUUID();
        UUID fromUser = UUID.randomUUID();
        UUID toUser = UUID.randomUUID();

        TransferRequest req = new TransferRequest(idempotency, fromUser, toUser, 5000L, "Test", null, null);

        TransferResponse resp = TransferResponse.builder()
            .transactionId(UUID.randomUUID())
            .idempotencyKey(idempotency)
            .fromUserId(fromUser)
            .toUserId(toUser)
            .amountCents(5000L)
            .status(TransactionStatus.PROCESSING)
            .build();

        when(transactionService.processTransfer(any(TransferRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/payments/transfer")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PROCESSING"));
    }

    @Test
    @DisplayName("GET /api/transactions/{transactionId} - Should return details")
    void getTransactionDetail_returnsOk_whenFound() throws Exception {
        UUID txId = UUID.randomUUID();

        TransactionDetailResponse detail = TransactionDetailResponse.builder()
            .transactionId(txId)
            .type("TRANSFER")
            .status("COMPLETED")
            .amountCents(10000L)
            .currency("VND")
            .description("Test")
            .createdAt(LocalDateTime.now())
            .build();

        when(transactionService.getTransactionDetail(eq(txId))).thenReturn(detail);

        mockMvc.perform(get("/api/payments/" + txId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.transactionId").value(txId.toString()))
            .andExpect(jsonPath("$.amountCents").value(10000));
    }

    @Test
    @DisplayName("GET /api/transactions/idempotency/{idempotencyKey} - Should return 404 when missing")
    void getByIdempotency_returnsNotFound_whenMissing() throws Exception {
        UUID key = UUID.randomUUID();
        when(transactionService.getTransactionByIdempotencyKey(key)).thenReturn(null);

        mockMvc.perform(get("/api/payments/idempotency/" + key))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/transactions/idempotency/{idempotencyKey} - Should return existing transaction")
    void getByIdempotency_returnsOk_whenExists() throws Exception {
        UUID key = UUID.randomUUID();
        TransferResponse resp = TransferResponse.builder()
            .transactionId(UUID.randomUUID())
            .idempotencyKey(key)
            .status(TransactionStatus.COMPLETED)
            .amountCents(2000L)
            .build();

        when(transactionService.getTransactionByIdempotencyKey(key)).thenReturn(resp);

        mockMvc.perform(get("/api/payments/idempotency/" + key))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.idempotencyKey").value(key.toString()));
    }
}
