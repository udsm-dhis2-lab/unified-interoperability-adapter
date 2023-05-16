package com.Adapter.icare;
import com.Adapter.icare.Controllers.UserController;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Before;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import scala.math.BigInt;

import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;
    @Mock
    private UserService userService;
    @Mock
    private UserRepository userRepository;

    private MockMvc mockMvcUser;

    @Before
    public  void setUp() throws Exception {
        mockMvcUser = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void UserControllerGetStatusTest() throws Exception {
        mockMvcUser.perform(
                        get("/api/v1/users/status").accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

    @Test
    public void UserControllerGetUsersTest() throws Exception {
        User user = new User();
        user.setUsername("josephat");
        user.setFirstname("josephat");
        user.setSurname("josephat");
        user.setEmail("josephat@gmail.com");
        user.setMiddlename("josephat");
        user.setPassword("JOSEPHAT");
        user.setPhonenumber("0798762321");
        user.setDisabled(false);
        user.setMiddlename("Test");
        UUID uuid = UUID.randomUUID();
        user.setUuid(uuid);
        user.setId(1);
//        Mockito.when(userService.createUser(user)).thenReturn(user);
//        given(userService.createUser(user)).willReturn(user);
        System.out.println(asJsonString(user));
        mockMvcUser.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(user)))
                .andExpect(status().isOk());
//        mockMvcUser.perform(
//                        get("/api/v1/users").accept(MediaType.APPLICATION_JSON)
//                )
//                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//                .andExpect(jsonPath("$", hasSize(0)));
    }

    private String asJsonString(Object obj) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper.writeValueAsString(obj);
    }

//    @Test
//    public void UserControllerCreateUserTest() throws Exception {
//        User user = new User();
//        user.setUsername("josephat");
//        user.setFirstname("josephat");
//        user.setSurname("josephat");
//        user.setEmail("josephat@gmail.com");
//        user.setMiddlename("josephat");
//        user.setPassword("JOSEPHAT");
//        user.setPhonenumber("09876232");
//        UUID uuid = UUID.randomUUID();
//        user.setUuid(uuid);
//        System.out.println(user.getUuid());
//        System.out.println(user);
////        mockMvc.perform(post("/api/v1/users")
////                        .content(user.toString())
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isOk());
//
//        Mockito.when(userService.createUser(user)).thenReturn(user);
//
//        mockMvc.perform(post("/api/v1/users")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(user.toString()))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.username").value("josephat"))
//                .andExpect(jsonPath("$.email").value("josephat@gmail.com"));
//    }
}
