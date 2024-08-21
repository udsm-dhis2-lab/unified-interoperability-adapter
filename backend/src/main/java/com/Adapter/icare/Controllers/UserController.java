package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.Group;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private Mappers mappers;

    @Autowired
    private ObjectMapper objectMapper;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/login")
    public String logins() {
        return "OK";
    }

    @GetMapping("/users/status")
    public String getStatus() {
        return "OK";
    }

    @GetMapping(path = "/users")
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


    @PostMapping(path = "/users", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public User createUser(@RequestBody User user) throws Exception {
        User userResponse = new User();
        try {
            userResponse = userService.createUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e);
        }
        return userResponse;

    }

    @GetMapping("users/{uuid}")
    public Map<String,Object> getUser(@PathVariable String uuid) throws Exception {
        User user = userService.getUSer(uuid);
        return user.toMap();
    }

    @PutMapping("/users/{uuid}")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @PostMapping("/users/roles")
    public List<Map<String,Object>> createRoles(@RequestBody List<Map<String,Object>> rolesMap){
        List<Map<String,Object>> createdRoles = new ArrayList<>();
        for(Map<String, Object> roleMap: rolesMap){
            Role role = Role.fromMap(roleMap);
            Role createdRole = userService.saveRole(role);
            createdRoles.add(createdRole.toMap(false));
        }
        return createdRoles;
    }

    @GetMapping("/users/roles")
    public List<Map<String,Object>> getRoles(@RequestParam(defaultValue = "false") boolean withPrivileges ){
        List<Map<String,Object>> savedRoles = new ArrayList<>();
        List<Role> roles = userService.getRoles();

        for(Role role : roles){
            savedRoles.add(role.toMap(withPrivileges));
        }
        return savedRoles;
    }

    @GetMapping("/users/roles/{uuid}")
    public Map<String,Object> getRole(@RequestParam(defaultValue = "true") boolean withPrivileges, @PathVariable String uuid) throws Exception {

        Role role = userService.getRole(uuid);
        return role.toMap(withPrivileges);

    }

    @PutMapping("/users/roles/{uuid}")
    public Map<String,Object> updateRole(@RequestBody Map<String,Object> roleMap,@PathVariable String uuid) throws Exception {
        Role role = Role.fromMap(roleMap);
        Role updateRole = userService.updateRole(role,uuid);
        return updateRole.toMap(true);
    }

    @PostMapping("/users/privileges")
    public List<Map<String,Object>> createPrivileges(@RequestBody List<Map<String,Object>> privilegesMap){
        List<Map<String,Object>> createdPrivileges = new ArrayList<>();
        for(Map<String,Object> priviligeMap : privilegesMap){
            Privilege privilege = Privilege.fromMap(priviligeMap);
            Privilege savedPrivilege = userService.savePrivilege(privilege);
            createdPrivileges.add(savedPrivilege.toMap(false));
        }
        return createdPrivileges;
    }

    @GetMapping("/users/privileges")
    public List<Map<String,Object>> getPrivileges(){
        List<Map<String,Object>> privilegesMap = new ArrayList<>();
        List<Privilege> privileges = userService.getPrivileges();

        for(Privilege privilege : privileges){
            privilegesMap.add(privilege.toMap(false));
        }

        return privilegesMap;
    }

    @GetMapping("/users/privileges/{uuid}")
    public Map<String,Object> getPrivilege(@PathVariable String uuid, @RequestParam(defaultValue = "true") boolean withRoles) throws Exception {
        Privilege privilege = userService.getPrivilege(uuid);
        return privilege.toMap(withRoles);
    }

    @PutMapping("/user/privileges/{uuid}")
    public Map<String,Object> updatePrivilege(@RequestBody Map<String,Object> privilegeMap,@PathVariable String uuid) throws Exception {
        Privilege privilege = Privilege.fromMap(privilegeMap);
        Privilege updatedPrivilege = userService.updatePrivilage(privilege,uuid);
        return updatedPrivilege.toMap(false);
    }

    @PostMapping("/users/groups")
    public List<Map<String,Object>> createGroups(@RequestBody List<Map<String,Object>> groupsMap){
        List<Map<String,Object>> savedGroupsMap = new ArrayList<>();
        for(Map<String,Object> groupMap : groupsMap){
            Group group = Group.fromMap(groupMap);
            Group savedGroup = userService.createGroup(group);
            savedGroupsMap.add(savedGroup.toMap(false));
        }
        return savedGroupsMap;
    }

    @GetMapping("/users/groups")
    public List<Map<String,Object>> getGroups(@RequestParam(defaultValue = "false") boolean withUsers){
        List<Map<String,Object>> groupsMap = new ArrayList<>();
        List<Group> groups = userService.getGroups();
        for(Group group : groups){
            groupsMap.add(group.toMap(withUsers));
        }
        return groupsMap;
    }

    @GetMapping("/users/group/{uuid}")
    public Map<String,Object> getGroup(@PathVariable String uuid,@RequestParam(defaultValue = "true") boolean withUsers) throws Exception {
        Group group = userService.getGroup(uuid);
        return group.toMap(withUsers);
    }
}
