package com.Adapter.icare.Initializer;

import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.UserService;
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

    public UserInitializer(UserRepository userRepository, UserService userService){
        this.userRepository = userRepository;
        this.userService = userService;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println(args.getOptionNames());
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
        User user = userRepository.findByUsername("admin");
        if(user == null){
            User userCreate = new User();
            userCreate.setPassword("password123");
            userCreate.setUsername("admin");
            userCreate.setFirstName("Admin");
            userCreate.setMiddleName("HDU");
            userCreate.setSurname("API");
            userCreate.setRoles(roles);
            userService.createUser(userCreate);
        } else {
            user.setRoles(roles);
            user.setPassword("password123");
            userService.updateUser(user.getUuid(), user);
        }
    }
}
