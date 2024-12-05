package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISServices.DataElementsServices;
import com.Adapter.icare.DHIS2.DHISServices.DataSetsService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dataElements")
public class DataElementsController {

    private final DataElementsServices dataElementsServices;

    public DataElementsController(DataElementsServices dataElementsServices) {
        this.dataElementsServices = dataElementsServices;
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<Map<String,Object>> getDataElementById(
            @PathVariable(value = "uuid") String uuid) throws Exception {
        try {
            Map<String,Object> dataElement = dataElementsServices.getDataElementByDHIS2Id(uuid);
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = dataElement.get("dataElement").toString();
            Map<String, Object> jsonMap = mapper.readValue(jsonString, Map.class);
            return ResponseEntity.ok(jsonMap);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }
}
