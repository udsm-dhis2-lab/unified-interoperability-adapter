package com.Adapter.icare.Initializer;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.UserService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

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
        User user = userRepository.findByUsername("admin");
        if(user == null){
            User userCreate = new User();
            userCreate.setPassword("c");
            userCreate.setUsername("admin");
            userService.createUser(userCreate);

        }
    }
}
