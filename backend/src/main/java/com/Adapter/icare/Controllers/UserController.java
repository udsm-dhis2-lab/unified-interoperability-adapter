package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.UserGetDto;
import com.Adapter.icare.Mappers.Mappers;
import com.Adapter.icare.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private Mappers mappers;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/status")
    public String getStatus() {
        return "OK";
    }

    @GetMapping
    public List<User> getUsers() throws Exception{
        List<User> users;
        try {
            users = userService.getUsers();
        } catch (Exception e) {
            throw new RuntimeException("Error getting users: " + e);
        }
        return  users;
    }

    @PostMapping()
    public User createUser(@RequestBody User user) throws Exception {
        User userResponse;
        try {
            userResponse = userService.createUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e);
        }
        if (userResponse != null) {
            UserGetDto userGetDto = new UserGetDto();
            System.out.println(userResponse.toString());
//            mappers.userToUserDto(userResponse);
            System.out.println(userGetDto);
        }
        return  userResponse;
    }

    @PutMapping("/{uuid}")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
}
