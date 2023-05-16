package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerAcceptanceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
    @Test
    public void getStatusTest() throws Exception {
        mockMvc.perform(
                    get("/api/v1/users/status")
                ).andExpect(status().isOk())
                .andExpect(content().string(equalTo("OK")));
    }

    @Test
    public void getUsersTest() throws Exception {
        mockMvc.perform(
                        get("/api/v1/users")
                ).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void createUserTest() throws Exception {
        Map<String, Object> user = new HashMap<>();
        user.put("username","abdul");
        user.put("firstname","Abdul");
        user.put("surname","Mrisho");
        user.put("email","mrisho@gmail.com");
        user.put("password","Testing");
        user.put("phonenumber","0798762321");
        user.put("disabled",false);
        user.put("middlename","Test");
//        UUID uuid = UUID.randomUUID();
//        user.setUuid(uuid);
//        user.setId(1);
        System.out.println(user);
        mockMvc.perform(
                        post("/api/v1/users").accept(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user))
                ).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void updateUser() {
    }

    private String asJsonString(Object obj) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper.writeValueAsString(obj);
    }
}