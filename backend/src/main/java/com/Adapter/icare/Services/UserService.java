package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.InstancesRepository;
import com.Adapter.icare.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User AddNewUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(User user) {
        boolean exists = userRepository.existsById(user.getId());
        if(!exists){
            throw new IllegalStateException("The user with username "+ user.getUsername() + " does not exist");
        }
        userRepository.deleteById(user.getId());
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
