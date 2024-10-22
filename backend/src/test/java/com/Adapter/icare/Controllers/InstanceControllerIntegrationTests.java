package com.Adapter.icare.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.Adapter.icare.DHIS2.DHISServices.DataSetElementsService;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.Adapter.icare.DHIS2.DHISServices.ReportsService;
import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Repository.DatasourceRepository;
import com.Adapter.icare.Services.DatasourceService;
import com.Adapter.icare.Services.InstanceService;
import com.Adapter.icare.Services.UserService;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest
class InstanceControllerIntegrationTests {

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

    @Disabled
    @Test
    void getInstancesTest() throws Exception {
        // Mock the behavior of the instanceService to return a list of instances
        given(instanceService.getInstances()).willReturn(new ArrayList<>());
        mockMvc.perform(
                get("/api/v1/instance")
        ).andExpect(status().isOk());
    }

    @Disabled
    @Test
    void getStatusTest() throws Exception {
        mockMvc.perform(
                get("/api/v1/instance/status")
        ).andExpect(status().isOk());
    }

    @Disabled
    @Test
    void addInstancesTest() throws Exception {
        Instance instance = new Instance();
        instance.setUrl("https://play.im.dhis2.org/stable-2-40-5");
        instance.setUsername("admin");
        instance.setPassword("district");
        instance.setName("TEST and TLAND");
        instance.setCode("OU_559");
        instance.setOrganisationUnitId("23984278937429");
        // Mock instanceService behavior to "save" the instance
        given(instanceService.AddNewInstance(instance)).willReturn(instance);

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