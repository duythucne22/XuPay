# Day 3: KYC & Transaction Limits - COMPLETE ✅

**Status:** 22/22 Files Created | Compiled Successfully  
**Date:** December 17, 2025  
**Total Progress:** 51/70 files (73% complete)

---

## 📋 Overview

Day 3 implemented the **KYC (Know Your Customer) verification workflow** and **transaction limit enforcement system**. This layer builds on Days 1-2 (Foundation + Authentication) and adds:

- Document upload and admin verification
- Tiered KYC status progression
- Transaction limit checking based on user tier
- User profile management
- Frequent contact management

---

## 🎯 Files Created (22 Files)

### **Service Layer (4 files)**

#### 1. **KycService.java** (Interface - 72 lines)
```java
public interface KycService {
    // Document management
    KycDocumentResponse uploadDocument(UUID userId, UploadKycDocumentRequest request);
    KycDocumentResponse getDocumentById(UUID documentId);
    List<KycDocumentResponse> getUserDocuments(UUID userId);
    List<KycDocumentResponse> getPendingDocuments();  // Admin queue
    
    // Admin verification
    KycDocumentResponse approveDocument(UUID documentId, UUID adminId, ApproveKycRequest request);
    KycDocumentResponse rejectDocument(UUID documentId, UUID adminId, RejectKycRequest request);
    
    // Scheduled task
    void checkExpiredDocuments();
}
```

#### 2. **KycServiceImpl.java** (167 lines) ✅
**Key Features:**
- **uploadDocument()**: Creates KYC document with PENDING status, sets 2-year expiry
- **approveDocument()**: Verifies document, auto-upgrades user to TIER_1 (or custom tier)
- **rejectDocument()**: Marks document rejected, updates user KYC status
- **checkExpiredDocuments()**: Scheduled job to mark expired documents
- **Business Logic**: Only first-time pending users get auto-upgraded on approval
- **Error Handling**: UserNotFoundException, KycDocumentNotFoundException
- **Logging**: Info/debug/warn at appropriate levels

#### 3. **LimitService.java** (Interface - 53 lines)
```java
public interface LimitService {
    UserLimitsResponse getUserLimits(UUID userId);
    DailyUsageResponse getDailyUsage(UUID userId);
    LimitCheckResponse checkTransactionAllowed(UUID userId, Long amountCents, String type);
    boolean canSend(UUID userId, Long amountCents);
    boolean canReceive(UUID userId, Long amountCents);
}
```

#### 4. **LimitServiceImpl.java** (178 lines) ✅
**Key Features:**
- **getUserLimits()**: Fetches tier-based limits (daily, monthly, single transaction, counts)
- **getDailyUsage()**: Returns today's sent/received amounts with remaining limits
- **checkTransactionAllowed()**: Validates against single + daily limits, returns reason if blocked
- **Logic**: Checks isActive + !isSuspended + KYC approved before allowing transactions
- **Helper Methods**: canSend(), canReceive() for quick boolean checks

---

### **Exception Layer (1 file)**

#### 5. **KycDocumentNotFoundException.java** (16 lines)
- Constructor: `UUID documentId` → "KYC document not found: {id}"
- Constructor: `String message` → Custom message
- Handled in GlobalExceptionHandler → 404 NOT_FOUND

---

### **Request DTOs (6 files)**

#### 6. **UploadKycDocumentRequest.java** (28 lines)
```java
public record UploadKycDocumentRequest(
    @NotNull DocumentType documentType,
    @NotBlank @Size(max = 500) String fileUrl,
    @NotBlank @Size(max = 100) String mimeType,
    @Positive Long fileSizeBytes
) {}
```

#### 7. **ApproveKycRequest.java** (15 lines)
```java
public record ApproveKycRequest(
    @Size(max = 500) String notes,        // Optional admin notes
    KycTier upgradeTier                    // Optional tier override
) {}
```

#### 8. **RejectKycRequest.java** (14 lines)
```java
public record RejectKycRequest(
    @NotBlank @Size(max = 500) String reason
) {}
```

#### 9. **UpdateProfileRequest.java** (24 lines)
```java
public record UpdateProfileRequest(
    @Size(min = 1, max = 100) String firstName,
    @Size(min = 1, max = 100) String lastName,
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$") String phone,  // E.164 format
    @Past LocalDate dateOfBirth
) {}
```

#### 10. **AddContactRequest.java** (17 lines)
```java
public record AddContactRequest(
    @NotNull UUID contactUserId,
    @Size(max = 100) String nickname      // Optional friendly name
) {}
```

#### 11. **CheckLimitRequest.java** (20 lines)
```java
public record CheckLimitRequest(
    @Positive Long amountCents,
    @Pattern(regexp = "^(send|receive)$") String type
) {}
```

---

### **Response DTOs (6 files)**

#### 12. **KycDocumentResponse.java** (18 lines)
- Fields: id, userId, documentType, fileUrl, verificationStatus
- Metadata: verificationNotes, verifiedBy, verifiedAt, expiresAt, createdAt

#### 13. **UserLimitsResponse.java** (16 lines)
- Tier info: kycTier, dailySendLimit, dailyReceiveLimit
- Monthly limits: monthlySendLimit, monthlyReceiveLimit
- Constraints: singleTransactionMax, hourly/dailyTransactionCountLimit
- Features: canSendInternational, requires2fa

#### 14. **DailyUsageResponse.java** (12 lines)
- Today's stats: usageDate, totalSentCents, totalReceivedCents, transactionCount
- Limits: dailySendLimitCents, remainingSendLimitCents

#### 15. **ContactResponse.java** (14 lines)
- Contact info: id, contactUserId, contactName, nickname
- Stats: totalTransactions, lastTransactionAt, isFavorite

#### 16. **ProfileResponse.java** (18 lines)
- User basics: id, email, firstName, lastName, phone, dateOfBirth
- Status: kycStatus, kycTier, isActive, createdAt

#### 17. **LimitCheckResponse.java** (9 lines)
```java
public record LimitCheckResponse(
    Boolean allowed,
    String reason,
    Long remainingLimitCents
) {}
```

---

### **MapStruct Mappers (3 files)**

#### 18. **UserMapper.java** (29 lines)
```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toOffsetDateTime())")
    ProfileResponse toProfileResponse(User user);
    
    UserResponse toUserResponse(User user);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateProfileRequest request, @MappingTarget User user);
}
```
- Handles ZonedDateTime → OffsetDateTime conversion
- Partial updates with @BeanMapping (ignores null values)

#### 19. **KycDocumentMapper.java** (23 lines)
```java
@Mapper(componentModel = "spring")
public interface KycDocumentMapper {
    @Mapping(source = "user.id", target = "userId")
    KycDocumentResponse toResponse(KycDocument document);
    
    List<KycDocumentResponse> toResponseList(List<KycDocument> documents);
}
```

#### 20. **ContactMapper.java** (23 lines)
```java
@Mapper(componentModel = "spring")
public interface ContactMapper {
    @Mapping(source = "contactUser.id", target = "contactUserId")
    @Mapping(target = "contactName", expression = "java(contact.getContactUser().getFullName())")
    ContactResponse toResponse(UserContact contact);
    
    List<ContactResponse> toResponseList(List<UserContact> contacts);
}
```

---

### **REST Controllers (2 files)**

#### 21. **KycController.java** (132 lines) ✅
**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/kyc/upload-document` | User | Upload new KYC document |
| GET | `/api/kyc/documents` | User | Get my KYC documents |
| GET | `/api/kyc/{id}` | User | Get specific document (with ownership check) |
| GET | `/api/kyc/pending` | Admin | Get pending documents queue |
| POST | `/api/kyc/{id}/approve` | Admin | Approve document |
| POST | `/api/kyc/{id}/reject` | Admin | Reject document |

**Security:**
- Owner-only access: User can only view their own documents
- Admin endpoints: `@PreAuthorize("hasRole('ADMIN')")`
- Principal injection for user ID extraction

#### 22. **UserController.java** (183 lines) ✅
**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me/profile` | User | Get my profile |
| PUT | `/api/users/me/profile` | User | Update my profile |
| GET | `/api/users/me/limits` | User | Get my transaction limits |
| GET | `/api/users/me/daily-usage` | User | Get today's usage |
| POST | `/api/users/me/check-limit` | User | Check if transaction allowed |
| GET | `/api/users/me/contacts` | User | Get my frequent contacts |
| POST | `/api/users/me/contacts` | User | Add new contact |
| DELETE | `/api/users/me/contacts/{contactId}` | User | Remove contact |

**Features:**
- Profile update: Uses UserMapper for partial updates (null fields ignored)
- Contact management: Validates both user IDs exist, prevents duplicate contacts
- Limit checking: Real-time validation before initiating transactions
- Security: Contact deletion checks ownership to prevent unauthorized access

---

## 🔧 Bug Fixes During Implementation

### **Initial Compilation Errors (7 errors)**

1. **KycDocument.approve()** - Expected (UUID, String), called with no args
   - **Fix**: Changed `document.approve()` → `document.approve(adminId, request.notes())`

2. **User.isPending()** - Method didn't exist
   - **Fix**: Added `public boolean isPending() { return kycStatus == KycStatus.PENDING; }`

3. **KycDocument.reject()** - Expected (UUID, String), called with no args
   - **Fix**: Changed `document.reject()` → `document.reject(adminId, request.reason())`

4. **KycDocumentRepository.findExpiredDocuments()** - Expected OffsetDateTime parameter
   - **Fix**: Changed `findExpiredDocuments()` → `findExpiredDocuments(OffsetDateTime.now())`

5-6. **DailyUsageRepository.findTodayUsage()** - Expected only UUID, not (UUID, LocalDate)
   - **Fix**: Changed `findTodayUsage(userId, today)` → `findTodayUsage(userId)` (2 occurrences)
   - Repository default method internally calls LocalDate.now()

7. **Syntax Error** - Incomplete statement in rejectDocument()
   - **Fix**: Completed `document.reject(adminId, request.reason());`

### **Final Compilation: BUILD SUCCESS** ✅
- Compiled: 57 source files
- Time: 26.685 seconds
- Target: Java 21
- MapStruct generated implementations automatically

---

## 🔄 KYC Workflow Diagram

```
┌──────────────┐
│ User Uploads │  POST /api/kyc/upload-document
│   Document   │  (passport, ID, proof of address)
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Document Status │  status = PENDING
│   = PENDING     │  expiresAt = now + 2 years
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│  Admin Reviews   │  GET /api/kyc/pending
│ Pending Documents│  (oldest first)
└──────┬───────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌────────────┐
│  APPROVE   │    │   REJECT   │
│  POST      │    │   POST     │
│  /api/kyc  │    │   /api/kyc │
│  /{id}/    │    │   /{id}/   │
│  approve   │    │   reject   │
└─────┬──────┘    └─────┬──────┘
      │                 │
      ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ User.kycStatus│  │ User.kycStatus│
│ = APPROVED   │  │ = REJECTED   │
└──────┬───────┘  └──────────────┘
       │
       ▼
┌──────────────────┐
│ Auto-Upgrade to  │  First approval only
│    TIER_1        │  (or custom tier)
└──────────────────┘
```

---

## 💰 Transaction Limit Enforcement

### **Tier System**
```
TIER_0 (Unverified):
  - Daily Send: $100
  - Daily Receive: $500
  - Single Transaction: $50
  - Cannot send international

TIER_1 (ID Verified):
  - Daily Send: $5,000
  - Daily Receive: $10,000
  - Single Transaction: $2,000
  - Can send international

TIER_2 (Address Verified):
  - Daily Send: $25,000
  - Daily Receive: $50,000
  - Single Transaction: $10,000

TIER_3 (Business Verified):
  - Daily Send: $100,000+
  - Daily Receive: Unlimited
  - Single Transaction: $50,000+
  - Requires 2FA
```

### **Limit Check Flow**
```java
// Pre-transaction validation
POST /api/users/me/check-limit
{
  "amountCents": 250000,  // $2,500
  "type": "send"
}

Response:
{
  "allowed": true,
  "reason": "Transaction allowed",
  "remainingLimitCents": 250000  // $2,500 remaining today
}
```

---

## 🧪 Testing Checklist

### **KYC Workflow**
- [ ] Upload document (valid MIME types: image/*, application/pdf)
- [ ] List my documents (pagination if many)
- [ ] View specific document (ownership enforced)
- [ ] Admin fetches pending queue (oldest first)
- [ ] Admin approves → User tier upgraded to TIER_1
- [ ] Admin approves with custom tier → User gets specified tier
- [ ] Admin rejects → User KYC status = REJECTED
- [ ] Expired document check (scheduled job marks expired)

### **Transaction Limits**
- [ ] Get my limits → Returns tier-specific limits
- [ ] Get daily usage → Shows today's sent/received amounts
- [ ] Check transaction: $50 send (TIER_0) → Allowed
- [ ] Check transaction: $150 send (TIER_0) → Blocked (exceeds $100 daily)
- [ ] Check transaction: $75 single (TIER_0) → Blocked (exceeds $50 single max)
- [ ] Upgrade to TIER_1 → New limits take effect immediately
- [ ] International send (TIER_0) → Blocked
- [ ] International send (TIER_1) → Allowed

### **Profile & Contacts**
- [ ] Get my profile → Returns non-sensitive data
- [ ] Update profile (firstName, lastName, phone) → Partial update works
- [ ] Add contact (existing userId) → Created successfully
- [ ] Add contact (non-existent userId) → 404 UserNotFoundException
- [ ] Remove my contact → Deleted
- [ ] Remove someone else's contact → 403 FORBIDDEN

---

## 📊 Current Progress

### **Week 1 Status**
| Day | Focus | Files | Status |
|-----|-------|-------|--------|
| Day 1 | Foundation (entities, repositories, enums) | 16 files | ✅ 100% |
| Day 2 | Authentication (JWT, Security, Auth endpoints) | 13 files | ✅ 100% |
| **Day 3** | **KYC & Limits (verification, limits, profile)** | **22 files** | **✅ 100%** |
| Day 4 | gRPC Server (proto, service, interceptors) | 10 files | ⏳ Pending |
| Day 5 | Testing & Documentation (unit tests, API docs) | 9 files | ⏳ Pending |

### **Overall Progress**
- **Files Completed:** 51/70 (73%)
- **Days Completed:** 3/5 (60%)
- **Compilation Status:** ✅ BUILD SUCCESS
- **Real Errors:** 0 (only IDE Lombok warnings)

---

## 🚀 Next Steps

### **Day 4: gRPC Server (Tomorrow)**
1. Create proto/user_service.proto (10 RPC methods)
2. Generate gRPC stubs (protoc + grpc-java plugin)
3. Implement UserGrpcService (auth, profile, KYC, limits)
4. Add JwtGrpcInterceptor (JWT validation from metadata)
5. Configure gRPC server (port 9090)
6. Test gRPC endpoints with grpcurl

### **Day 5: Testing & Documentation (Final Day)**
1. Unit tests (service layer with Mockito)
2. Integration tests (REST API with @SpringBootTest)
3. Repository tests (@DataJpaTest)
4. Complete API documentation (OpenAPI/Swagger)
5. Performance testing (load test with 1000 users)
6. Security audit (OWASP Top 10 checklist)

---

## 📝 Notes

### **Design Decisions**
1. **Auto-Upgrade Logic**: Only first-time PENDING users get auto-upgraded on approval
   - Prevents accidental tier changes on subsequent document uploads
   - Admins can override tier with ApproveKycRequest.upgradeTier

2. **Daily Usage Calculation**: Repository method internally uses LocalDate.now()
   - Simplifies service layer calls
   - Consistent timezone handling (server timezone)

3. **Contact Management**: Stores both userId pairs + nickname
   - Enables "frequent recipients" feature for faster transactions
   - `totalTransactions` incremented by payment service (future)

4. **Limit Enforcement**: Pre-transaction validation only (not post-deduction)
   - Actual deduction happens in payment-service
   - This service provides "can I send?" checks before initiating payment

### **Known Limitations**
1. **Document Upload**: Currently accepts URL (pre-uploaded to S3/Azure Blob)
   - Future: Direct multipart/form-data upload endpoint
   - Add virus scanning integration

2. **OCR/AI Extraction**: `extractedData` field exists but not populated
   - Future: Integrate OCR service (AWS Textract, Azure Form Recognizer)
   - Auto-fill user profile from extracted document data

3. **Monthly Limits**: Tracked in TransactionLimit but not enforced yet
   - Requires DailyUsage aggregation query (SUM last 30 days)
   - Add MonthlyUsage table for performance

4. **2FA Requirement**: `requires2fa` flag exists but not enforced
   - Future: Add TOTP/SMS verification before high-value transactions
   - Integrate with authentication-service

---

## ✅ Definition of Done

- [x] All 22 files created with correct package structure
- [x] Service layer implements business logic (KYC workflow, limit checks)
- [x] REST controllers expose 14 endpoints (6 KYC + 8 user management)
- [x] Request validation with Jakarta Bean Validation
- [x] MapStruct mappers handle entity ↔ DTO conversion
- [x] Exception handling added to GlobalExceptionHandler
- [x] Maven compilation successful (BUILD SUCCESS)
- [x] Code follows Clean Architecture principles
- [x] Proper transaction management (@Transactional annotations)
- [x] Logging at appropriate levels (info, debug, warn)
- [x] Security checks (ownership validation, admin-only endpoints)

---

**🎯 Day 3 Complete! Ready for Day 4: gRPC Server Implementation**
