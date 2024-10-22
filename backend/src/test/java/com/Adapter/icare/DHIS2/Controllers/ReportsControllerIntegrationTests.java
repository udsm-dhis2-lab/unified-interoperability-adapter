package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISRepository.DataSetsRepository;
import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Repository.DatasourceRepository;
import com.Adapter.icare.Repository.InstancesRepository;
import com.Adapter.icare.Repository.UserRepository;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @Autowired
    private ObjectMapper objectMapper;
    @Test
    void searchDataSetElementsPerDataSetTest() {
    }

    @Disabled
    @Test
    void sendDataToDHISTest() {
    }

    @Disabled
    @Test
    public void dhis2ConnectionTest() throws Exception {
        mockMvc.perform(
                    get("/api/v1/reports/dhisConnection")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", Matchers.is("admin")));
    }

    @Disabled
    @Test
    public void getDHIS2OrgUnitViaCodeTest() throws Exception {
        Instance instance = new Instance();
        instance.setUrl("https://play.dhis2.org/2.38.3.1");
        instance.setUsername("admin");
        instance.setPassword("district");
        instance.setName("TEST and TLAND");
        instance.setCode("OU_559");
        instance.setOrganisationUnitId("23984278937429");
        mockMvc.perform(
                    post("/api/v1/reports/verifyCode").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(instance))
                ).andExpect(status().isOk())
                .andExpect(jsonPath("$.code", Matchers.is("OU_559")));
    }
}