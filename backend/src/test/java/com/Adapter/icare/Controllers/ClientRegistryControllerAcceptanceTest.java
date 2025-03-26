package com.Adapter.icare.Controllers;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class ClientRegistryControllerAcceptanceTest {
    @Autowired
    private MockMvc mockMvc;

    @Disabled
    @Test
    public void getPatientsTest() throws Exception {
        mockMvc.perform(
                get("http://localhost:8091/api/v1/clients")).andExpect(status().isOk())
                .andExpect(content().string(equalTo("OK")));
    }
}
