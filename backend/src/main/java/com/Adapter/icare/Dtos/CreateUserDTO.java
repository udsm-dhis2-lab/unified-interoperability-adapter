package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.Adapter.icare.Utils.RoleListDeserializer;
import com.Adapter.icare.Utils.GroupListDeserializer;

@Getter
@Setter
public class CreateUserDTO {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    private String middleName;
    
    @NotBlank(message = "Surname is required")
    @Size(min = 2, max = 50, message = "Surname must be between 2 and 50 characters")
    private String surname;
    
    @Email(message = "Please provide a valid email address")
    private String email;
    
    private String phoneNumber;
    
    private Boolean disabled = false;
    
    private Boolean externalAuth = false;
    
    // List of role UUIDs or role objects
    @JsonDeserialize(using = RoleListDeserializer.class)
    private List<RoleDTO> roles;
    
    // List of group UUIDs or group objects
    @JsonDeserialize(using = GroupListDeserializer.class)
    private List<GroupDTO> groups;
    
    // List of privilege UUIDs (if directly assigning privileges)
    private List<PrivilegeDTO> privileges;
    
    @Getter
    @Setter
    public static class RoleDTO {
        private String uuid;
        private String roleName;
        private String description;
    }
    
    @Getter
    @Setter
    public static class GroupDTO {
        private String uuid;
        private String groupName;
        private String description;
    }
    
    @Getter
    @Setter
    public static class PrivilegeDTO {
        private String uuid;
        private String privilegeName;
        private String description;
    }
}