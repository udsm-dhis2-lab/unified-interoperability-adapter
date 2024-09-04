package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class) // Specify the controller to test
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;


    @Test
    public void createUserTest() throws Exception {
        User user = new User();
        user.setUsername("abdul");
        user.setFirstName("Abdul");
        user.setSurname("Mrisho");
        user.setEmail("mrisho@gmail.com");
        user.setPassword("Testing");
        user.setPhoneNumber("0798762321");
        user.setDisabled(false);
        user.setMiddleName("Test");

        // Mock the service call for creating a user
        when(userService.createUser(user)).thenReturn(user);

        // Execute the POST request and verify the response status
        mockMvc.perform(
                post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(user))
        ).andExpect(status().isCreated());
    }

    @Test
    public void getUsersTest() throws Exception {
        User user = new User();
        user.setUsername("abdul");
        user.setFirstName("Abdul");
        user.setSurname("Mrisho");
        user.setEmail("mrisho@gmail.com");
        user.setPassword("Testing");
        user.setPhoneNumber("0798762321");
        user.setDisabled(false);
        user.setMiddleName("Test");

        // Assuming there's a getUser() method in UserService for the GET request
        when(userService.getUserByUsername("abdul")).thenReturn(user);

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk());
    }

    private String asJsonString(Object obj) throws JsonProcessingException {
        return objectMapper.writeValueAsString(obj); // Use the autowired objectMapper
    }
}