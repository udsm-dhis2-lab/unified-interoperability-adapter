package com.Adapter.icare.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Group;
import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.LoginDTO;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private Mappers mappers;
    private Authentication authentication;
    private final AuthenticationManager authenticationManager;
    private User authenticatedUser;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private HttpServletRequest request;

    public UserController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
    }

    @PostMapping(path = "/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody LoginDTO loginData)
            throws IllegalAccessException {
        try {
            Map<String, Object> userDetails = userService.authenticate(loginData);
            // Here, you can return user info or a token, depending on your needs
            Map<String, Object> response = new HashMap<>();
            if (userDetails != null) {
                this.authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginData.getUsername(),
                                loginData.getPassword()));
                SecurityContextHolder.getContext().setAuthentication(this.authentication);
                this.authenticatedUser = this.userService
                        .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
                response = this.authenticatedUser.toMap();
                response.put("authenticated", true);
                return ResponseEntity.ok(response);
            } else {
                response.put("authenticated", false);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "/")
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getLoggedInUser() throws Exception {
        try {
            if (authentication != null) {
                User authenticatedUser = this.userService
                        .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
                return ResponseEntity.ok(authenticatedUser.toMap());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping(path = "/users")
    public List<Map<String, Object>> getUsers() throws Exception {
        List<Map<String, Object>> usersMap = new ArrayList<>();
        try {
            List<User> users = userService.getUsers();
            for (User user : users) {
                usersMap.add(user.toMap());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error getting users: " + e);
        }
        return usersMap;
    }

    @PostMapping(path = "/users", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public User createUser(@RequestBody User user) throws Exception {
        User userResponse = new User();
        try {
            userResponse = userService.createUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e);
        }
        return userResponse;

    }

    @GetMapping("/users/{uuid}")
    public Map<String, Object> getUser(@PathVariable String uuid) throws Exception {
        User user = userService.getUSer(uuid);
        return user.toMap();
    }

    @PutMapping("/users/{uuid}")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
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
}
