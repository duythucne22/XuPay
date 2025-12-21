package com.xupay.user.mapper;

import com.xupay.user.dto.response.KycDocumentResponse;
import com.xupay.user.entity.KycDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * KycDocumentMapper
 * MapStruct mapper for KycDocument entity to DTO conversions.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface KycDocumentMapper {

    /**
     * Convert KycDocument entity to KycDocumentResponse DTO
     */
    @Mapping(target = "userId", source = "user.id")
    KycDocumentResponse toResponse(KycDocument document);

    /**
     * Convert list of KycDocument entities to list of DTOs
     */
    List<KycDocumentResponse> toResponseList(List<KycDocument> documents);
}
