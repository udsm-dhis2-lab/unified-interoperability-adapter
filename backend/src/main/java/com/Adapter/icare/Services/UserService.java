package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Group;
import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.LoginDTO;
import com.Adapter.icare.Repository.GroupRepository;
import com.Adapter.icare.Repository.PrivilegeRepository;
import com.Adapter.icare.Repository.RoleRepository;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Utils.EncryptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    private  final RoleRepository roleRepository;

    private final PrivilegeRepository privilegeRepository;

    private final GroupRepository groupRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> authenticate(LoginDTO loginDTO) throws Exception {
        if (loginDTO.getPassword() == null || loginDTO.getUsername() == null) {
            throw new Exception("Credentials not well defined");
        }

        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();
        // Load user from database or other source
        User user;
        try {
            user = userRepository.findByUsername(username);
        } catch (UsernameNotFoundException e) {
            throw new Exception("User not found");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return user.toMap();
    }

    public UserService(UserRepository userRepository,RoleRepository roleRepository, PrivilegeRepository privilegeRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
        this.groupRepository = groupRepository;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(User user) throws Exception {
        try {
            // Generate UUID for the new user
            UUID uuid = UUID.randomUUID();
            user.setUuid(uuid.toString());

            // Encode the user's password
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Get the currently authenticated user to set as the creator
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
                String username = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
                User authenticatedUser = this.getUserByUsername(username);
                if (authenticatedUser != null) {
                    user.setCreatedBy(authenticatedUser);
                }
            }
            // Handle roles: either fetch existing roles or create new ones if needed
            Set<Role> attachedRoles = new HashSet<>();
            if (user.getRoles() != null) {
                for (Role role : user.getRoles()) {
                    Role existingRole = roleRepository.findByUuid(role.getUuid());
                    if (existingRole == null) {
                        // If role does not exist, create a new one
                        if (role.getRoleName() != null) {
                            role.setUuid(UUID.randomUUID().toString());
                            attachedRoles.add(roleRepository.save(role));
                        }
                    } else {
                        attachedRoles.add(existingRole);
                    }
                }
            }
            user.setRoles(attachedRoles);

            // Save the user with the associated roles
            User createdUser = userRepository.save(user);

            return createdUser;

        } catch (Exception e) {
            // Log and rethrow the exception
            System.err.println("Error while creating user: " + e.getMessage());
            throw new Exception("Failed to create user", e);
        }
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("User Not found");
        }
        return new CustomUserDetails(user);
    }

    public User getUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("User Not found");
        }
        return user;
    }

    public Role saveRole(Role role){
        UUID uuid = UUID.randomUUID();
        role.setUuid(uuid.toString());
        return roleRepository.save(role);
    }

    public List<Role> getRoles(){
        return  roleRepository.findAll();
    }

    public Role getRoleByName(String name){
        return  roleRepository.findByName(name);
    }

    public Privilege savePrivilege(Privilege privilege){
        UUID uuid = UUID.randomUUID();
        privilege.setUuid(uuid.toString());
        return privilegeRepository.save(privilege);
    }

    public List<Privilege> getPrivileges(){
        return privilegeRepository.findAll();
    }

    public Privilege getPrivilegeByName(String name){
        return privilegeRepository.findByName(name);
    }

    public User getUSer(String uuid) throws Exception {
        User user = userRepository.findByUuid(uuid);
        if(user == null){
            throw new Exception("User with uuid "+uuid+" does not exist");
        }
        return user;
    }

    public Role getRole(String uuid) throws Exception {
        Role role = roleRepository.findByUuid(uuid);
        if(role == null){
            throw new Exception("The role with uuid "+uuid+" does not exist");
        }
        return roleRepository.findByUuid(uuid);
    }

    public Role updateRole(Role role, String uuid) throws Exception {
        Role savedRole = this.getRole(uuid);
        role.setRoleName(savedRole.getRoleName());
        role.setUuid(savedRole.getUuid());
        return roleRepository.save(role);
    }

    public Privilege getPrivilege(String uuid) throws Exception {
        Privilege privilege = privilegeRepository.findByUuid(uuid);
        if(privilege == null){
            throw new Exception("Privilege with uuid "+uuid+" does not exist");
        }
        return privilege;
    }

    public Privilege updatePrivilege(Privilege privilege, String uuid) throws Exception {
        Privilege savedPrivilege = this.getPrivilege(uuid);
        privilege.setUuid(savedPrivilege.getUuid());
        return privilegeRepository.save(privilege);

    }

    public Group createGroup(Group group) {
        UUID uuid = UUID.randomUUID();
        group.setUuid(uuid.toString());
        return groupRepository.save(group);
    }

    public List<Group> getGroups() {

        return groupRepository.findAll();
    }

    public Group getGroup(String uuid) throws Exception {
        Group group = groupRepository.findByUuid(uuid);
        if(group == null){
            throw new Exception("The group with uuid "+uuid+" does not exist");
        }
        return group;
    }
}
