package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
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
    public UserService(UserRepository userRepository,RoleRepository roleRepository, PrivilegeRepository privilegeRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User createUser(User user) throws Exception {
        User createdUser = new User();
        try {
            UUID uuid = UUID.randomUUID();
            user.setUuid(uuid);

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
        return roleRepository.save(role);
    }

    public List<Role> getRoles(){
        return  roleRepository.findAll();
    }

    public Privilege savePrivilege(Privilege privilege){
        return privilegeRepository.save(privilege);
    }

    public List<Privilege> getPrivileges(){
        return privilegeRepository.findAll();
    }
}
