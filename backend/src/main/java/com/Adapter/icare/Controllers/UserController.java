package com.Adapter.icare.Controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Group;
import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.CreateUserDTO;
import com.Adapter.icare.Dtos.JwtAuthenticationResponse;
import com.Adapter.icare.Dtos.LoginDTO;
import com.Adapter.icare.Dtos.UpdateUserDTO;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Configurations.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "User Management", description = "User authentication and management operations")
public class UserController {
    private final UserService userService;
    private Mappers mappers;
    private Authentication authentication;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private User authenticatedUser;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private HttpServletRequest request;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
    }

    @PostMapping(path = "/login")
    @Operation(
        summary = "Authenticate user and get JWT token",
        description = "Login with username and password to receive a JWT token. This token should be used for authenticating all subsequent requests."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication successful - JWT token returned"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @SecurityRequirement(name = "")
    public ResponseEntity<?> authenticateUser(
        @Parameter(description = "Login credentials", required = true) @RequestBody LoginDTO loginData)
            throws IllegalAccessException {
        try {
            Map<String, Object> userDetails = userService.authenticate(loginData);
            if (userDetails != null) {
                // Authenticate user
                this.authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginData.getUsername(),
                                loginData.getPassword()));
                
                // Generate JWT token
                String jwtToken = jwtTokenProvider.generateToken(authentication);
                
                // Get user information
                this.authenticatedUser = this.userService
                        .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
                
                // Create JWT response
                JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse(jwtToken, authenticatedUser);
                
                // Convert to map for compatibility
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtResponse.getToken());
                response.put("tokenType", jwtResponse.getTokenType());
                response.put("user", jwtResponse.getUser().toMap());
                response.put("authenticated", jwtResponse.isAuthenticated());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("authenticated", false);
                response.put("error", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", false);
            response.put("error", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("loggedOut", true);
        responseBody.put("redirectUrl", "/");

        return ResponseEntity.ok()
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(responseBody);
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get current user information",
        description = "Get information about the currently authenticated user."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Current user information retrieved"),
        @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getLoggedInUser() throws Exception {
        try {
            System.out.println("Getting logged in user " + authentication);
            if (authentication != null) {
                User authenticatedUser = this.userService
                        .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
                return ResponseEntity.ok(authenticatedUser.toMap());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            System.out.println("Error getting logged in user: " + e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping(path = "/users")
    @Operation(
        summary = "Get all users",
        description = "Retrieve a paginated list of all users. Requires authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search) {
        try {
            Page<User> usersPage;
            if (search != null && !search.trim().isEmpty()) {
                usersPage = userService.getUsersWithSearch(page, size, search, sortBy, sortDirection);
            } else {
                usersPage = userService.getUsers(page, size, sortBy, sortDirection);
            }
            
            List<Map<String, Object>> usersMap = new ArrayList<>();
            for (User user : usersPage.getContent()) {
                usersMap.add(user.toMap());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", usersMap);
            response.put("totalElements", usersPage.getTotalElements());
            response.put("totalPages", usersPage.getTotalPages());
            response.put("currentPage", usersPage.getNumber());
            response.put("pageSize", usersPage.getSize());
            response.put("hasNext", usersPage.hasNext());
            response.put("hasPrevious", usersPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping(path = "/users", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
        summary = "Create a new user",
        description = "Create a new user account. Requires admin authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> createUser(
        @Parameter(description = "User data", required = true) @RequestBody Map<String, Object> requestBody) {
        try {
            // Add password if missing (for testing)
            if (!requestBody.containsKey("password") || requestBody.get("password") == null) {
                requestBody.put("password", "defaultPassword123"); // You can change this
            }
            
            // Convert raw JSON to User entity using the fromMap method
            User user = User.fromMap(requestBody);
            
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("user", createdUser.toMap());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            if (e.getMessage().contains("Username already exists")) {
                errorResponse.put("error", "Username already exists. Please choose a different username.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            } else {
                errorResponse.put("error", "Failed to create user: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/users/{uuid}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable String uuid) {
        try {
            User user = userService.getUSer(uuid);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user.toMap());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "User not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PutMapping("/users/{uuid}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable String uuid, @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        try {
            // Convert DTO to User entity
            User user = convertUpdateDTOToUser(updateUserDTO);
            
            User updatedUser = userService.updateUser(uuid, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("user", updatedUser.toMap());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            if (e.getMessage().contains("not found")) {
                errorResponse.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            } else if (e.getMessage().contains("Username already exists")) {
                errorResponse.put("error", "Username already exists. Please choose a different username.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            } else {
                errorResponse.put("error", "Failed to update user: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/users/roles")
    public List<Map<String, Object>> createRoles(@RequestBody List<Map<String, Object>> rolesMap) {
        List<Map<String, Object>> createdRoles = new ArrayList<>();
        for (Map<String, Object> roleMap : rolesMap) {
            Role role = Role.fromMap(roleMap);
            if (this.authenticatedUser != null) {
                role.setCreatedBy(this.authenticatedUser);
            }
            Role createdRole = userService.saveRole(role);
            createdRoles.add(createdRole.toMap(false));
        }
        return createdRoles;
    }

    @GetMapping("/users/roles")
    public List<Map<String, Object>> getRoles(@RequestParam(defaultValue = "false") boolean withPrivileges) {
        List<Map<String, Object>> savedRoles = new ArrayList<>();
        List<Role> roles = userService.getRoles();

        for (Role role : roles) {
            savedRoles.add(role.toMap(withPrivileges));
        }
        return savedRoles;
    }

    @GetMapping("/users/roles/{uuid}")
    public Map<String, Object> getRole(@RequestParam(defaultValue = "true") boolean withPrivileges,
            @PathVariable String uuid) throws Exception {

        Role role = userService.getRole(uuid);
        return role.toMap(withPrivileges);

    }

    @PutMapping("/users/roles/{uuid}")
    public Map<String, Object> updateRole(@RequestBody Map<String, Object> roleMap, @PathVariable String uuid)
            throws Exception {
        Role role = Role.fromMap(roleMap);
        if (this.authenticatedUser != null) {
            role.setLastUpdatedBy(this.authenticatedUser);
        }
        Role updateRole = userService.updateRole(role, uuid);
        return updateRole.toMap(true);
    }

    @PostMapping("/users/privileges")
    public List<Map<String, Object>> createPrivileges(@RequestBody List<Map<String, Object>> privilegesMap) {
        List<Map<String, Object>> createdPrivileges = new ArrayList<>();
        for (Map<String, Object> priviligeMap : privilegesMap) {
            Privilege privilege = Privilege.fromMap(priviligeMap);
            if (this.authenticatedUser != null) {
                privilege.setCreatedBy(this.authenticatedUser);
            }
            Privilege savedPrivilege = userService.savePrivilege(privilege);
            createdPrivileges.add(savedPrivilege.toMap(false));
        }
        return createdPrivileges;
    }

    @GetMapping("/users/privileges")
    public List<Map<String, Object>> getPrivileges() {
        List<Map<String, Object>> privilegesMap = new ArrayList<>();
        List<Privilege> privileges = userService.getPrivileges();

        for (Privilege privilege : privileges) {
            privilegesMap.add(privilege.toMap(false));
        }

        return privilegesMap;
    }

    @GetMapping("/users/privileges/{uuid}")
    public Map<String, Object> getPrivilege(@PathVariable String uuid,
            @RequestParam(defaultValue = "true") boolean withRoles) throws Exception {
        Privilege privilege = userService.getPrivilege(uuid);
        return privilege.toMap(withRoles);
    }

    @PutMapping("/user/privileges/{uuid}")
    public Map<String, Object> updatePrivilege(@RequestBody Map<String, Object> privilegeMap, @PathVariable String uuid)
            throws Exception {
        Privilege privilege = Privilege.fromMap(privilegeMap);
        Privilege updatedPrivilege = userService.updatePrivilege(privilege, uuid);
        return updatedPrivilege.toMap(false);
    }

    @PostMapping("/users/groups")
    public List<Map<String, Object>> createGroups(@RequestBody List<Map<String, Object>> groupsMap) {
        List<Map<String, Object>> savedGroupsMap = new ArrayList<>();
        for (Map<String, Object> groupMap : groupsMap) {
            Group group = Group.fromMap(groupMap);
            if (this.authenticatedUser != null) {
                group.setCreatedBy(this.authenticatedUser);
            }
            Group savedGroup = userService.createGroup(group);
            savedGroupsMap.add(savedGroup.toMap(false));
        }
        return savedGroupsMap;
    }

    @GetMapping("/users/groups")
    public List<Map<String, Object>> getGroups(@RequestParam(defaultValue = "false") boolean withUsers) {
        List<Map<String, Object>> groupsMap = new ArrayList<>();
        List<Group> groups = userService.getGroups();
        for (Group group : groups) {
            groupsMap.add(group.toMap(withUsers));
        }
        return groupsMap;
    }

    @GetMapping("/users/group/{uuid}")
    public Map<String, Object> getGroup(@PathVariable String uuid,
            @RequestParam(defaultValue = "true") boolean withUsers) throws Exception {
        Group group = userService.getGroup(uuid);
        return group.toMap(withUsers);
    }

    @DeleteMapping("/users/{uuid}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String uuid) {
        try {
            userService.deleteUser(uuid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            if (e.getMessage().contains("not found")) {
                errorResponse.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            } else {
                errorResponse.put("error", "Failed to delete user: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/users/{uuid}/privileges")
    public ResponseEntity<Map<String, Object>> getUserPrivileges(@PathVariable String uuid) {
        try {
            List<Privilege> privileges = userService.getUserPrivileges(uuid);
            
            List<Map<String, Object>> privilegesMap = new ArrayList<>();
            for (Privilege privilege : privileges) {
                privilegesMap.add(privilege.toMap(false));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("privileges", privilegesMap);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to get user privileges: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping("/users/{userUuid}/roles/{roleUuid}")
    public ResponseEntity<Map<String, Object>> assignRoleToUser(@PathVariable String userUuid, @PathVariable String roleUuid) {
        try {
            User updatedUser = userService.assignRoleToUser(userUuid, roleUuid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Role assigned to user successfully");
            response.put("user", updatedUser.toMap());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to assign role: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/users/{userUuid}/roles/{roleUuid}")
    public ResponseEntity<Map<String, Object>> removeRoleFromUser(@PathVariable String userUuid, @PathVariable String roleUuid) {
        try {
            User updatedUser = userService.removeRoleFromUser(userUuid, roleUuid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Role removed from user successfully");
            response.put("user", updatedUser.toMap());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to remove role: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/users/{userUuid}/groups/{groupUuid}")
    public ResponseEntity<Map<String, Object>> assignGroupToUser(@PathVariable String userUuid, @PathVariable String groupUuid) {
        try {
            User updatedUser = userService.assignGroupToUser(userUuid, groupUuid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Group assigned to user successfully");
            response.put("user", updatedUser.toMap());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to assign group: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/users/{userUuid}/groups/{groupUuid}")
    public ResponseEntity<Map<String, Object>> removeGroupFromUser(@PathVariable String userUuid, @PathVariable String groupUuid) {
        try {
            User updatedUser = userService.removeGroupFromUser(userUuid, groupUuid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Group removed from user successfully");
            response.put("user", updatedUser.toMap());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to remove group: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Helper methods to convert DTOs to User entities
    private User convertCreateDTOToUser(CreateUserDTO dto) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", dto.getUsername());
        userMap.put("password", dto.getPassword());
        userMap.put("firstName", dto.getFirstName());
        userMap.put("middleName", dto.getMiddleName());
        userMap.put("surname", dto.getSurname());
        userMap.put("email", dto.getEmail());
        userMap.put("phoneNumber", dto.getPhoneNumber());
        userMap.put("disabled", dto.getDisabled());
        userMap.put("externalAuth", dto.getExternalAuth());
        
        // Convert role DTOs to maps
        if (dto.getRoles() != null) {
            List<Map<String, Object>> rolesMaps = new ArrayList<>();
            for (CreateUserDTO.RoleDTO roleDTO : dto.getRoles()) {
                Map<String, Object> roleMap = new HashMap<>();
                roleMap.put("uuid", roleDTO.getUuid());
                roleMap.put("roleName", roleDTO.getRoleName());
                roleMap.put("description", roleDTO.getDescription());
                rolesMaps.add(roleMap);
            }
            userMap.put("roles", rolesMaps);
        }
        
        // Convert group DTOs to maps
        if (dto.getGroups() != null) {
            List<Map<String, Object>> groupsMaps = new ArrayList<>();
            for (CreateUserDTO.GroupDTO groupDTO : dto.getGroups()) {
                Map<String, Object> groupMap = new HashMap<>();
                groupMap.put("uuid", groupDTO.getUuid());
                groupMap.put("groupName", groupDTO.getGroupName());
                groupMap.put("description", groupDTO.getDescription());
                groupsMaps.add(groupMap);
            }
            userMap.put("groups", groupsMaps);
        }
        
        return User.fromMap(userMap);
    }
    
    private User convertUpdateDTOToUser(UpdateUserDTO dto) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            userMap.put("password", dto.getPassword());
        }
        userMap.put("firstName", dto.getFirstName());
        userMap.put("middleName", dto.getMiddleName());
        userMap.put("surname", dto.getSurname());
        userMap.put("email", dto.getEmail());
        userMap.put("phoneNumber", dto.getPhoneNumber());
        userMap.put("disabled", dto.getDisabled());
        userMap.put("externalAuth", dto.getExternalAuth());
        
        // Convert role DTOs to maps
        if (dto.getRoles() != null) {
            List<Map<String, Object>> rolesMaps = new ArrayList<>();
            for (CreateUserDTO.RoleDTO roleDTO : dto.getRoles()) {
                Map<String, Object> roleMap = new HashMap<>();
                roleMap.put("uuid", roleDTO.getUuid());
                roleMap.put("roleName", roleDTO.getRoleName());
                roleMap.put("description", roleDTO.getDescription());
                rolesMaps.add(roleMap);
            }
            userMap.put("roles", rolesMaps);
        }
        
        // Convert group DTOs to maps
        if (dto.getGroups() != null) {
            List<Map<String, Object>> groupsMaps = new ArrayList<>();
            for (CreateUserDTO.GroupDTO groupDTO : dto.getGroups()) {
                Map<String, Object> groupMap = new HashMap<>();
                groupMap.put("uuid", groupDTO.getUuid());
                groupMap.put("groupName", groupDTO.getGroupName());
                groupMap.put("description", groupDTO.getDescription());
                groupsMaps.add(groupMap);
            }
            userMap.put("groups", groupsMaps);
        }
        
        return User.fromMap(userMap);
    }
}
