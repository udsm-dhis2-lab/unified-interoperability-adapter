package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserGetDto {
    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("email")
    private String email;

    @JsonProperty("firstname")
    private String firstname;

    @JsonProperty("surname")
    private String surname;
}
