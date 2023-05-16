package com.Adapter.icare;
import com.Adapter.icare.Controllers.UserController;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
public class UserControllerTest {

    private MockMvc mockMvc;
    @InjectMocks
    private UserController userController;
    @Mock
    private UserService userService;

    @Before
    public  void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void UserControllerGetStatusTest() throws Exception {
        mockMvc.perform(
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
        user.setPhonenumber("09876232");
        UUID uuid = UUID.randomUUID();

        Mockito.when(userService.createUser(user)).thenReturn(user);
        mockMvc.perform(
                        get("/api/v1/users").accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.username").value("josephat"));;
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

    @Test
    public void createUserTest() throws Exception {
//        MockHttpServletRequest newPostRequest = newPostRequest("icare/item", item);
//        MockHttpServletResponse handle = handle(newPostRequest);
        ObjectMapper objectMapper = new ObjectMapper();
        User user = new User();
        user.setUsername("Dennis");
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                        .andReturn();
        String responseContent = result.getResponse().getContentAsString();
        System.out.println("Response: " + responseContent);

//                .andExpect(MockMvcResultMatchers.status().isOk())
//                //.andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("Dennis"));


    }
}
