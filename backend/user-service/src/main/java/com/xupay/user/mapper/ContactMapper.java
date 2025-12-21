package com.xupay.user.mapper;

import com.xupay.user.dto.response.ContactResponse;
import com.xupay.user.entity.UserContact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * ContactMapper
 * MapStruct mapper for UserContact entity to DTO conversions.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContactMapper {

    /**
     * Convert UserContact entity to ContactResponse DTO
     */
    @Mapping(target = "contactUserId", source = "contactUser.id")
    @Mapping(target = "contactName", expression = "java(contact.getContactUser().getFullName())")
    ContactResponse toResponse(UserContact contact);

    /**
     * Convert list of UserContact entities to list of DTOs
     */
    List<ContactResponse> toResponseList(List<UserContact> contacts);
}
