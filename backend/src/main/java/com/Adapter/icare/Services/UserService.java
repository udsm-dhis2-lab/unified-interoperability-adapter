package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
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
}
