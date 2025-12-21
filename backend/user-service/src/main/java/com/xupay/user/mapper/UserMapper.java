package com.xupay.user.mapper;

import com.xupay.user.dto.request.UpdateProfileRequest;
import com.xupay.user.dto.response.ProfileResponse;
import com.xupay.user.dto.response.UserResponse;
import com.xupay.user.entity.User;
import org.mapstruct.*;

/**
 * UserMapper
 * MapStruct mapper for User entity to DTO conversions.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    /**
     * Convert User entity to ProfileResponse DTO
     */
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toOffsetDateTime())")
    ProfileResponse toProfileResponse(User user);

    /**
     * Convert User entity to UserResponse DTO
     */
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toOffsetDateTime())")
    UserResponse toUserResponse(User user);

    /**
     * Update User entity from UpdateProfileRequest
     * Only updates non-null fields
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateProfileRequest request, @MappingTarget User user);
}
