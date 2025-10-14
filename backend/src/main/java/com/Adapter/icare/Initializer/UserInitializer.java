package com.Adapter.icare.Initializer;

import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
public class UserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final UserService userService;

    @Value("${default.user.username}")
    private String defaultUsername;

    @Value("${default.user.password}")
    private String defaultPassword;

    public UserInitializer(UserRepository userRepository, UserService userService){
        this.userRepository = userRepository;
        this.userService = userService;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(defaultPassword == null || defaultPassword.isEmpty()){
            throw new Exception("Default Password for default user should be set in environment variables.");
        }
        // 1. Save privilege
        Privilege existingPrivilege = userService.getPrivilegeByName("ALL");
        if (existingPrivilege == null) {
            Privilege privilege = new Privilege();
            privilege.setPrivilegeName("ALL");
            UUID privilegeUuid = UUID.randomUUID();
            privilege.setUuid(privilegeUuid.toString());
            existingPrivilege = userService.savePrivilege(privilege);
        }
        Set<Privilege> privileges = new HashSet<>();
        privileges.add(existingPrivilege);

        // 2. Save role
        Role existingRole = userService.getRoleByName("Superuser");
        if (existingRole == null) {
            Role role = new Role();
            role.setRoleName("Superuser");
            role.setPrivileges(privileges);
            UUID uuid = UUID.randomUUID();
            role.setUuid(uuid.toString());
            existingRole = userService.saveRole(role);
        }
        Set<Role> roles = new HashSet<>();
        roles.add(existingRole);
        User user = userRepository.findByUsername(defaultUsername);
        if(user == null){
            user = new User();
            user.setUsername(defaultUsername);
            user.setPassword(defaultPassword);
            user.setFirstName("Admin");
            user.setMiddleName("HDU");
            user.setSurname("API");
            user.setRoles(roles);
            userService.createUser(user);
            System.out.println("No user was Found");
        } else {
            User userUpdates = new User();
            userUpdates.setUsername(user.getUsername());
            userUpdates.setFirstName(user.getFirstName());
            userUpdates.setMiddleName(user.getMiddleName());
            userUpdates.setSurname(user.getSurname());
            userUpdates.setRoles(roles);
            userService.updateUser(user.getUuid(), userUpdates);
        }
    }
}
