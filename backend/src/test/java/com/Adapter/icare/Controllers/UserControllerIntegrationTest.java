package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

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
        // 1. Define the behavior of the service
        when(userService.createUser(user)).thenReturn(user);
        mockMvc.perform(
                get("/api/v1/users")
        ).andExpect(status().isOk());
    }
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
        // 1. Define the behavior of the service
        when(userService.createUser(user)).thenReturn(user);
        // 2. Use the mockMvc
        mockMvc.perform(
                post("/api/v1/users").contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(user))
        ).andExpect(status().isOk());
        // 3. Verify
    }

    private String asJsonString(Object obj) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper.writeValueAsString(obj);
    }
}