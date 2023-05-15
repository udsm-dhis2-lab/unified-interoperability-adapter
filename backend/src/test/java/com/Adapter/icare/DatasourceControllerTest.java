package com.Adapter.icare;
import com.Adapter.icare.Controllers.DatasourceController;
import com.Adapter.icare.Controllers.UserController;
import com.Adapter.icare.Domains.User;
import org.junit.Before;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
public class DatasourceControllerTest {

    private MockMvc mockMvc;
    @InjectMocks
    private DatasourceController datasourceController;

    @Before
    public  void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(datasourceController).build();
    }

    @Test
    public void DatasourceControllerGetStatusTest() throws Exception {
        mockMvc.perform(
                        get("/api/v1/datasource/status").accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk()).andExpect(content().string("OK"));
    }

}
