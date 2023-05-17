package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.security.CustomUserDetails;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
