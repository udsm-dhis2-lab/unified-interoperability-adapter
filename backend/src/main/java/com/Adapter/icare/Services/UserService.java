package com.Adapter.icare.Services;

import java.util.HashSet;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

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

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
            PrivilegeRepository privilegeRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
        this.groupRepository = groupRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAllActiveUsers();
    }

    public Page<User> getUsers(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAllActiveUsers(pageable);
    }

    public Page<User> getUsersWithSearch(int page, int size, String search, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        // This would require a custom repository method for search
        // For now, return all active users - implement search later if needed
        return userRepository.findAllActiveUsers(pageable);
    }

    @Transactional
    public User createUser(User user) throws Exception {
        try {
            // Validate required fields
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("Username is required");
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
                throw new IllegalArgumentException("First name is required");
            }
            if (user.getSurname() == null || user.getSurname().trim().isEmpty()) {
                throw new IllegalArgumentException("Surname is required");
            }

            // Check if username already exists
            User existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser != null) {
                throw new RuntimeException("Username already exists");
            }

            // Generate UUID for the new user
            UUID uuid = UUID.randomUUID();
            user.setUuid(uuid.toString());

            // Encode the user's password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Set default values
            if (user.getDisabled() == null) {
                user.setDisabled(false);
            }
            if (user.getExternalAuth() == null) {
                user.setExternalAuth(false);
            }

            // Get the currently authenticated user to set as the creator
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
                String username = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
                User authenticatedUser = this.getUserByUsername(username);
                if (authenticatedUser != null) {
                    user.setCreatedBy(authenticatedUser);
                }
            }

            // Handle roles: fetch existing roles by UUID
            Set<Role> attachedRoles = new HashSet<>();
            if (user.getRoles() != null) {
                for (Role role : user.getRoles()) {
                    if (role.getUuid() != null) {
                        Role existingRole = roleRepository.findByUuid(role.getUuid());
                        if (existingRole != null) {
                            attachedRoles.add(existingRole);
                        } else {
                            System.out.println("WARNING: Role with UUID " + role.getUuid() + " not found, skipping...");
                        }
                    }
                }
            }
            user.setRoles(attachedRoles);

            // Handle groups: fetch existing groups by UUID
            Set<Group> attachedGroups = new HashSet<>();
            if (user.getGroups() != null) {
                for (Group group : user.getGroups()) {
                    if (group.getUuid() != null) {
                        Group existingGroup = groupRepository.findByUuid(group.getUuid());
                        if (existingGroup != null) {
                            attachedGroups.add(existingGroup);
                        } else {
                            System.out.println("WARNING: Group with UUID " + group.getUuid() + " not found, skipping...");
                        }
                    }
                }
            }
            user.setGroups(attachedGroups);

            // Save the user with the associated roles and groups
            User createdUser = userRepository.save(user);

            return createdUser;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error while creating user: " + e.getMessage());
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    @Transactional
    public User updateUser(String uuid, User updatedUser) throws Exception {
        try {
            // Find existing user
            User existingUser = userRepository.findByUuid(uuid);
            if (existingUser == null) {
                throw new RuntimeException("User with UUID " + uuid + " not found");
            }

            // Validate required fields
            if (updatedUser.getUsername() == null || updatedUser.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("Username is required");
            }
            if (updatedUser.getFirstName() == null || updatedUser.getFirstName().trim().isEmpty()) {
                throw new IllegalArgumentException("First name is required");
            }
            if (updatedUser.getSurname() == null || updatedUser.getSurname().trim().isEmpty()) {
                throw new IllegalArgumentException("Surname is required");
            }

            // Check if username is being changed and if new username already exists
            if (!existingUser.getUsername().equals(updatedUser.getUsername())) {
                User userWithNewUsername = userRepository.findByUsername(updatedUser.getUsername());
                if (userWithNewUsername != null) {
                    throw new RuntimeException("Username already exists");
                }
            }

            // Update user fields
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setMiddleName(updatedUser.getMiddleName());
            existingUser.setSurname(updatedUser.getSurname());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setDisabled(updatedUser.getDisabled());
            existingUser.setExternalAuth(updatedUser.getExternalAuth());

            // Update password if provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            // Set last updated by
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
                String username = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
                User authenticatedUser = this.getUserByUsername(username);
                if (authenticatedUser != null) {
                    existingUser.setLastUpdatedBy(authenticatedUser);
                }
            }

            // Handle roles update
            if (updatedUser.getRoles() != null) {
                Set<Role> attachedRoles = new HashSet<>();
                for (Role role : updatedUser.getRoles()) {
                    if (role.getUuid() != null) {
                        Role existingRole = roleRepository.findByUuid(role.getUuid());
                        if (existingRole != null) {
                            attachedRoles.add(existingRole);
                        }
                    }
                }
                existingUser.setRoles(attachedRoles);
            }

            // Handle groups update
            if (updatedUser.getGroups() != null) {
                Set<Group> attachedGroups = new HashSet<>();
                for (Group group : updatedUser.getGroups()) {
                    if (group.getUuid() != null) {
                        Group existingGroup = groupRepository.findByUuid(group.getUuid());
                        if (existingGroup != null) {
                            attachedGroups.add(existingGroup);
                        }
                    }
                }
                existingUser.setGroups(attachedGroups);
            }

            return userRepository.save(existingUser);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error while updating user: " + e.getMessage());
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not found");
        }
        return new CustomUserDetails(user);
    }

    public User getUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not found");
        }
        return user;
    }

    public Role saveRole(Role role) {
        UUID uuid = UUID.randomUUID();
        role.setUuid(uuid.toString());
        return roleRepository.save(role);
    }

    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    public Privilege savePrivilege(Privilege privilege) {
        UUID uuid = UUID.randomUUID();
        privilege.setUuid(uuid.toString());
        return privilegeRepository.save(privilege);
    }

    public List<Privilege> getPrivileges() {
        return privilegeRepository.findAll();
    }

    public Privilege getPrivilegeByName(String name) {
        return privilegeRepository.findByName(name);
    }

    public User getUSer(String uuid) throws Exception {
        User user = userRepository.findByUuid(uuid);
        if (user == null) {
            throw new Exception("User with uuid " + uuid + " does not exist");
        }
        return user;
    }

    public Role getRole(String uuid) throws Exception {
        Role role = roleRepository.findByUuid(uuid);
        if (role == null) {
            throw new Exception("The role with uuid " + uuid + " does not exist");
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
        if (privilege == null) {
            throw new Exception("Privilege with uuid " + uuid + " does not exist");
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
        if (group == null) {
            throw new Exception("The group with uuid " + uuid + " does not exist");
        }
        return group;
    }

    @Transactional
    public void deleteUser(String uuid) throws Exception {
        try {
            User user = userRepository.findByUuid(uuid);
            if (user == null) {
                throw new RuntimeException("User with UUID " + uuid + " not found");
            }

            // Hard delete - permanently remove user from database
            userRepository.delete(user);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error while deleting user: " + e.getMessage());
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }

    public List<Privilege> getUserPrivileges(String userUuid) throws Exception {
        User user = this.getUSer(userUuid);
        Set<Privilege> privileges = new HashSet<>();
        
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                if (role.getPrivileges() != null) {
                    privileges.addAll(role.getPrivileges());
                }
            }
        }
        
        return new ArrayList<>(privileges);
    }

    @Transactional
    public User assignRoleToUser(String userUuid, String roleUuid) throws Exception {
        User user = this.getUSer(userUuid);
        Role role = this.getRole(roleUuid);
        
        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }
        
        user.getRoles().add(role);
        return userRepository.save(user);
    }

    @Transactional
    public User removeRoleFromUser(String userUuid, String roleUuid) throws Exception {
        User user = this.getUSer(userUuid);
        Role role = this.getRole(roleUuid);
        
        if (user.getRoles() != null) {
            user.getRoles().remove(role);
            return userRepository.save(user);
        }
        
        return user;
    }

    @Transactional
    public User assignGroupToUser(String userUuid, String groupUuid) throws Exception {
        User user = this.getUSer(userUuid);
        Group group = this.getGroup(groupUuid);
        
        if (user.getGroups() == null) {
            user.setGroups(new HashSet<>());
        }
        
        user.getGroups().add(group);
        return userRepository.save(user);
    }

    @Transactional
    public User removeGroupFromUser(String userUuid, String groupUuid) throws Exception {
        User user = this.getUSer(userUuid);
        Group group = this.getGroup(groupUuid);
        
        if (user.getGroups() != null) {
            user.getGroups().remove(group);
            return userRepository.save(user);
        }
        
        return user;
    }
}
