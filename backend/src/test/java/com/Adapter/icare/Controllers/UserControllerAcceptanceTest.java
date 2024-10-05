package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;

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

    @Disabled
    @Test
    public void getStatusTest() throws Exception {
        mockMvc.perform(
                    get("/api/v1/users/status")
                            .with(httpBasic("admin","AdminUser"))
                ).andExpect(status().isOk())
                .andExpect(content().string(equalTo("OK")));
    }

    @Disabled
    @Test
    public void getUsersTest() throws Exception {
        mockMvc.perform(
                        get("/api/v1/users")
                                .with(httpBasic("admin","AdminUser"))
                ).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(3)));
    }
    @Disabled("")
    @Test
    public void createUserTest() throws Exception {
        Map<String, Object> user = new HashMap<>();
        user.put("username","dennis");
        user.put("firstname","Abdul");
        user.put("surname","Kibahila");
        user.put("email","dennis@gmail.com");
        user.put("password","Testing");
        user.put("phonenumber","0798762321");
        user.put("disabled",false);
        user.put("middlename","Test");
        UUID uuid = UUID.randomUUID();
        user.put("uuid",uuid);
        mockMvc.perform(
                        post("/api/v1/users")
                                .with(httpBasic("admin","AdminUser"))
                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user))
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