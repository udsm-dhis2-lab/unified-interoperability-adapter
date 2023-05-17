package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.UserGetDto;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private Mappers mappers;

    @Autowired
    private ObjectMapper objectMapper;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/status")
    public String getStatus() {
        return "OK";
    }

    @GetMapping
    public List<Map<String,Object>> getUsers() throws Exception{
        List<Map<String,Object>> usersMap = new ArrayList<>();
        try {
            List<User> users = userService.getUsers();
            for(User user : users){
                usersMap.add(user.toMap());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error getting users: " + e);
        }
        return usersMap;
    }


    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public User createUser(@RequestBody User user) throws Exception {
        User userResponse = new User();
        try {
            userResponse = userService.createUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e);
        }
        return userResponse;

    }

    @PutMapping("/{uuid}")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @PostMapping("roles")
    public List<Map<String,Object>> createRoles(@RequestBody List<Map<String,Object>> rolesMap){
        List<Map<String,Object>> createdRoles = new ArrayList<>();
        for(Map<String, Object> roleMap: rolesMap){
            Role role = Role.fromMap(roleMap);
            Role createdRole = userService.saveRole(role);
            createdRoles.add(createdRole.toMap());
        }
        return createdRoles;
    }

    @GetMapping("roles")
    public List<Map<String,Object>> getRoles(){
        List<Map<String,Object>> savedRoles = new ArrayList<>();
        List<Role> roles = userService.getRoles();

        for(Role role : roles){
            savedRoles.add(role.toMap());
        }
        return savedRoles;
    }

    @PostMapping("privileges")
    public List<Map<String,Object>> createPrivileges(@RequestBody List<Map<String,Object>> privilegesMap){
        List<Map<String,Object>> createdPrivileges = new ArrayList<>();
        for(Map<String,Object> priviligeMap : privilegesMap){
            Privilege privilege = Privilege.fromMap(priviligeMap);
            Privilege savedPrivilege = userService.savePrivilege(privilege);
            createdPrivileges.add(savedPrivilege.toMap());
        }
        return createdPrivileges;
    }

    @GetMapping("privileges")
    public List<Map<String,Object>> getPrivileges(){
        List<Map<String,Object>> privilegesMap = new ArrayList<>();
        List<Privilege> privileges = userService.getPrivileges();

        for(Privilege privilege : privileges){
            privilegesMap.add(privilege.toMap());
        }

        return privilegesMap;
    }



}
