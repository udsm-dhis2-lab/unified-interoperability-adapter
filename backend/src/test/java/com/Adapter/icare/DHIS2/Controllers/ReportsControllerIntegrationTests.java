package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Repository.DatasourceRepository;
import com.Adapter.icare.Repository.InstancesRepository;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Services.UserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
public class ReportsControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportsService reportsService;
    @MockBean
    private DatasourceService datasourceService;

    @MockBean
    private InstanceService instanceService;
    @MockBean
    private UserService userService;

    @MockBean
    private DataSetsService dataSetsService;
    @MockBean
    private DataSetElementsService dataSetElementsService;

    @MockBean
    private DatasourceRepository datasourceRepository;

    @MockBean
    private InstancesRepository instancesRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DataSetsRepository dataSetsRepository;
    @Test
    void searchDataSetElementsPerDataSetTest() {
    }

    @Test
    void sendDataToDHISTest() {
    }

    @Test
    public void dhis2ConnectionTest() throws Exception {
        mockMvc.perform(
                    get("/api/v1/reports/dhisConnection")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", Matchers.is("admin")));
    }
}