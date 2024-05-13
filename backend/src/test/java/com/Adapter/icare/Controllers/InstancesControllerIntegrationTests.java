package com.Adapter.icare.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Repository.DatasourceRepository;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest
class InstancesControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InstanceService instanceService;

    @MockBean
    private DatasourceService datasourceService;

    @MockBean
    private UserService userService;

    @MockBean
    private DataSetElementsService dataSetElementsService;

    @MockBean
    private DataSetsService dataSetsService;

    @MockBean
    private DatasourceRepository datasourceRepository;

    @MockBean
    private ReportsService reportsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getInstancesTest() throws Exception {
        mockMvc.perform(
                get("/api/v1/instance")
        ).andExpect(status().isOk());
    }

    @Test
    void getStatusTest() throws Exception {
        mockMvc.perform(
                get("/api/v1/instance/status")
        ).andExpect(status().isOk());
    }

    @Test
    void addInstancesTest() throws Exception {
        Instances instance = new Instances();
        instance.setUrl("https://play.dhis2.org/2.38.3.1");
        instance.setUsername("admin");
        instance.setPassword("district");
        instance.setName("TEST and TLAND");
        instance.setCode("OU_559");
        instance.setOrganisationUnitId("23984278937429");
        mockMvc.perform(
                post("/api/v1/instance").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(instance))
        ).andExpect(status().isOk());
    }

    @Test
    void deleteInstanceTest() throws Exception {
    }

    @Test
    void updateInstancesTest() throws Exception {
    }
}