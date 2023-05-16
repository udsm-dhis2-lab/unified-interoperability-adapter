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

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/status")
    public String getStatus() {
        List<User> users= userService.getUsers();
        System.out.println(users.size());
        if (users == null) {
            System.out.println("NULL");
        } else {
            System.out.println("NOT NULL");
        }
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
        try {
            System.out.println(user.getId());
            return userService.createUser(user);
//            return userResponse;
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e);
        }
//        if (userResponse != null) {
//            UserGetDto userGetDto = new UserGetDto();
//            System.out.println(userResponse.toString());
//            mappers.userToUserGetDto(userResponse);
//            System.out.println(userGetDto);
//        }
//        return  userResponse;
    }

    @PutMapping("/{uuid}")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
}
