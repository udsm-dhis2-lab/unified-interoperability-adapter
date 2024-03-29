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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    private  final RoleRepository roleRepository;

    private final PrivilegeRepository privilegeRepository;

    private final GroupRepository groupRepository;
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

            createdUser = userRepository.save(user);
        } catch (Exception e) {
            System.out.println("Error while creating user" + e);
        }

        System.out.println("created user: "+createdUser);
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

    public Privilege updatePrivilage(Privilege privilege, String uuid) throws Exception {
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
