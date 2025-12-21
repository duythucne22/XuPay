# 🔍 DAY 3: KYC & LIMITS LAYER - Implementation Plan

> **Date:** December 17, 2025  
> **Phase:** Day 3 - KYC Verification & Transaction Limits  
> **Goal:** Implement KYC workflow and transaction limit enforcement  
> **Status:** 📋 READY TO EXECUTE

---

## 🎯 OBJECTIVES

By end of Day 3, the User Service will have:
- ✅ KYC document upload and verification workflow
- ✅ Transaction limit checks (called by Payment Service via gRPC later)
- ✅ User profile management endpoints
- ✅ Contact list management
- ✅ MapStruct DTOs mapping

---

## 📋 TASK BREAKDOWN (22 Files)

### Phase 3.1: KYC Service Layer (2 files - 2 hours)

**File 1: KycService.java** ⏱️ 30 min
- **Path:** `src/main/java/com/xupay/user/service/KycService.java`
- **Type:** Interface
- **Methods:**
  - `uploadDocument(UUID userId, UploadKycDocumentRequest request)` → KycDocumentResponse
  - `approveDocument(UUID documentId, UUID adminId, String notes)` → KycDocumentResponse
  - `rejectDocument(UUID documentId, UUID adminId, String reason)` → KycDocumentResponse
  - `getDocumentById(UUID documentId)` → KycDocumentResponse
  - `getUserDocuments(UUID userId)` → List<KycDocumentResponse>
  - `getPendingDocuments()` → List<KycDocumentResponse> (admin queue)

**File 2: KycServiceImpl.java** ⏱️ 1.5 hours
- **Path:** `src/main/java/com/xupay/user/service/impl/KycServiceImpl.java`
- **Dependencies:** KycDocumentRepository, UserRepository, KycDocumentMapper
- **Business Logic:**
  - Upload: Store document URL, set status to PENDING
  - Approve: Update KYC status, upgrade user tier if applicable
  - Reject: Set rejection reason, allow reupload
  - Auto-expire documents after 2 years
- **Error Handling:**
  - Throw KycDocumentNotFoundException if not found
  - Throw UserNotFoundException if user not found
  - Throw InvalidDocumentTypeException if type mismatch

---

### Phase 3.2: Limit Service Layer (2 files - 1.5 hours)

**File 3: LimitService.java** ⏱️ 20 min
- **Path:** `src/main/java/com/xupay/user/service/LimitService.java`
- **Type:** Interface
- **Methods:**
  - `getUserLimits(UUID userId)` → UserLimitsResponse
  - `getDailyUsage(UUID userId)` → DailyUsageResponse
  - `checkTransactionAllowed(UUID userId, Long amountCents)` → boolean
  - `recordTransaction(UUID userId, Long amountCents, String type)` → void

**File 4: LimitServiceImpl.java** ⏱️ 1 hour
- **Path:** `src/main/java/com/xupay/user/service/impl/LimitServiceImpl.java`
- **Dependencies:** UserRepository, TransactionLimitRepository, DailyUsageRepository
- **Business Logic:**
  - Get user's current tier limits
  - Calculate remaining daily limit
  - Check if transaction would exceed limits
  - Record transaction volumes (sent/received)

---

### Phase 3.3: Controllers (2 files - 2 hours)

**File 5: KycController.java** ⏱️ 1 hour
- **Path:** `src/main/java/com/xupay/user/controller/KycController.java`
- **Endpoints:**
  - `POST /api/kyc/upload-document` - Upload ID document
  - `POST /api/kyc/{id}/approve` - Admin approves document
  - `POST /api/kyc/{id}/reject` - Admin rejects document
  - `GET /api/kyc/documents` - Get my documents
  - `GET /api/kyc/{id}` - Get specific document
  - `GET /api/kyc/pending` - Admin queue (ADMIN role required)

**File 6: UserController.java** ⏱️ 1 hour
- **Path:** `src/main/java/com/xupay/user/controller/UserController.java`
- **Endpoints:**
  - `GET /api/users/me/limits` - Get my transaction limits
  - `GET /api/users/me/daily-usage` - Get today's usage
  - `PUT /api/users/me/profile` - Update profile
  - `GET /api/users/me/contacts` - Get frequent contacts
  - `POST /api/users/me/contacts` - Add contact
  - `DELETE /api/users/me/contacts/{id}` - Remove contact

---

### Phase 3.4: Request DTOs (6 files - 1.5 hours)

**File 7: UploadKycDocumentRequest.java** ⏱️ 15 min
- Fields: documentType, fileUrl, mimeType, fileSizeBytes

**File 8: ApproveKycRequest.java** ⏱️ 10 min
- Fields: notes, upgradeTier (optional)

**File 9: RejectKycRequest.java** ⏱️ 10 min
- Fields: reason

**File 10: UpdateProfileRequest.java** ⏱️ 15 min
- Fields: firstName, lastName, phone, dateOfBirth

**File 11: AddContactRequest.java** ⏱️ 15 min
- Fields: contactUserId, nickname

**File 12: CheckLimitRequest.java** ⏱️ 10 min
- Fields: amountCents, type (send/receive)

---

### Phase 3.5: Response DTOs (6 files - 1.5 hours)

**File 13: KycDocumentResponse.java** ⏱️ 15 min
- Fields: id, userId, documentType, fileUrl, verificationStatus, createdAt, verifiedAt, verifiedBy

**File 14: UserLimitsResponse.java** ⏱️ 20 min
- Fields: kycTier, dailySendLimit, dailyReceiveLimit, singleTransactionMax, canSendInternational

**File 15: DailyUsageResponse.java** ⏱️ 20 min
- Fields: usageDate, totalSentCents, totalReceivedCents, transactionCount, remainingSendLimit

**File 16: ContactResponse.java** ⏱️ 15 min
- Fields: id, contactUserId, contactName, nickname, totalTransactions, lastTransactionAt

**File 17: ProfileResponse.java** ⏱️ 15 min
- Fields: id, email, firstName, lastName, phone, dateOfBirth, kycStatus, kycTier

**File 18: LimitCheckResponse.java** ⏱️ 10 min
- Fields: allowed, reason, remainingLimit

---

### Phase 3.6: MapStruct Mappers (3 files - 1 hour)

**File 19: UserMapper.java** ⏱️ 20 min
- **Path:** `src/main/java/com/xupay/user/mapper/UserMapper.java`
- **Methods:**
  - `User → ProfileResponse`
  - `User → UserResponse`
  - `UpdateProfileRequest → User`

**File 20: KycDocumentMapper.java** ⏱️ 20 min
- **Path:** `src/main/java/com/xupay/user/mapper/KycDocumentMapper.java`
- **Methods:**
  - `KycDocument → KycDocumentResponse`
  - `List<KycDocument> → List<KycDocumentResponse>`

**File 21: ContactMapper.java** ⏱️ 20 min
- **Path:** `src/main/java/com/xupay/user/mapper/ContactMapper.java`
- **Methods:**
  - `UserContact → ContactResponse`
  - `List<UserContact> → List<ContactResponse>`

---

### Phase 3.7: Custom Exceptions (1 file - 15 min)

**File 22: KycDocumentNotFoundException.java** ⏱️ 15 min
- **Path:** `src/main/java/com/xupay/user/exception/KycDocumentNotFoundException.java`
- Constructor: `KycDocumentNotFoundException(UUID documentId)`

---

## 🧪 TESTING CHECKLIST

### Manual Tests with Postman/cURL

**1. Upload KYC Document:**
```bash
curl -X POST http://localhost:8081/api/kyc/upload-document \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "PASSPORT",
    "fileUrl": "https://s3.amazonaws.com/xupay/docs/passport123.jpg",
    "mimeType": "image/jpeg",
    "fileSizeBytes": 2048000
  }'
```

**2. Get My Limits:**
```bash
curl -X GET http://localhost:8081/api/users/me/limits \
  -H "Authorization: Bearer {token}"
```

**3. Get Daily Usage:**
```bash
curl -X GET http://localhost:8081/api/users/me/daily-usage \
  -H "Authorization: Bearer {token}"
```

**4. Add Contact:**
```bash
curl -X POST http://localhost:8081/api/users/me/contacts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "contactUserId": "550e8400-e29b-41d4-a716-446655440001",
    "nickname": "Mom"
  }'
```

---

## 📊 SUCCESS CRITERIA

- [ ] All 22 files compile successfully
- [ ] KYC document upload works
- [ ] Admin can approve/reject documents
- [ ] User tier upgrades automatically on KYC approval
- [ ] Transaction limits enforced correctly
- [ ] Daily usage tracking accurate
- [ ] Contact list CRUD operations work
- [ ] MapStruct mappers generate implementations

---

## 🎯 EXECUTION ORDER

1. **Services First** (4 files) - Core business logic
2. **Controllers** (2 files) - REST endpoints
3. **Request DTOs** (6 files) - Input validation
4. **Response DTOs** (6 files) - Output format
5. **Mappers** (3 files) - Entity ↔ DTO conversion
6. **Exceptions** (1 file) - Error handling
7. **Compile Check** - `mvn clean compile -DskipTests`
8. **Update Memory Bank** - Document progress

---