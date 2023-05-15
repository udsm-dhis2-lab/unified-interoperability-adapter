package com.Adapter.icare.Mappers;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.UserGetDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface Mappers {
    UserGetDto userToUserDto(User user);
}