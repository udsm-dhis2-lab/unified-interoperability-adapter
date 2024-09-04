package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Group;
import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
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

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    private  final RoleRepository roleRepository;

    private final PrivilegeRepository privilegeRepository;

    private final GroupRepository groupRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> authenticate(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            throw new Exception("No Basic Authentication header found");
        }

        String base64Credentials = authHeader.substring(6);
        String credentials = new String(Base64.getDecoder().decode(base64Credentials));
        String[] values = credentials.split(":", 2);

        if (values.length != 2) {
            throw new Exception("Invalid Basic Authentication header");
        }

        String username = values[0];
        String password = values[1];
        // Load user from database or other source
        User user;
        try {
            user = userRepository.findByUsername(username);
        } catch (UsernameNotFoundException e) {
            throw new Exception("User not found");
        }

        // Check password
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

    public User createUser(User user) throws Exception {
        User createdUser = new User();
        try {
            UUID uuid = UUID.randomUUID();
            user.setUuid(uuid.toString());

            //Password encoding
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                User authenticatedUser = this.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
                if (authenticatedUser != null) {
                    user.setCreatedBy(authenticatedUser);
                }
            }
            createdUser = userRepository.save(user);
        } catch (Exception e) {
            System.out.println("Error while creating user" + e);
        }

        return createdUser;
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

    public Privilege savePrivilege(Privilege privilege){
        UUID uuid = UUID.randomUUID();
        privilege.setUuid(uuid.toString());
        return privilegeRepository.save(privilege);
    }

    public List<Privilege> getPrivileges(){
        return privilegeRepository.findAll();
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
