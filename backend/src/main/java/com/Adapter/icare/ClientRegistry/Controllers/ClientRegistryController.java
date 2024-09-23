package com.Adapter.icare.ClientRegistry.Controllers;

import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clients")
public class ClientRegistryController {
    private final ClientRegistryService clientRegistryService;

    @Autowired
    public ClientRegistryController(ClientRegistryService clientRegistryService) {
        this.clientRegistryService = clientRegistryService;
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getPatients(
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam( value = "identifier", required = false) String identifier,
            @RequestParam( value = "identifierType", required = false) String identifierType,
            @RequestParam( value = "gender", required = false) String gender,
            @RequestParam( value = "firstName", required = false) String firstName,
            @RequestParam( value = "middleName", required = false) String middleName,
            @RequestParam( value = "lastName", required = false) String lastName,
            @RequestParam( value = "dateOfBirth", required = false) Date dateOfBirth
    ) throws Exception {
        try {
            Map<String, Object> patientDataResponse = new HashMap<>();
            List<Map<String, Object>> patients = clientRegistryService.getPatients(
                    page,
                    pageSize,
                    identifier,
                    identifierType,
                    gender,
                    firstName,
                    middleName,
                    lastName,
                    dateOfBirth);
            patientDataResponse.put("results", patients);
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            // TODO: Use query parameter to identify if there is need to get total (For addressing performance issue)
            pager.put("total", clientRegistryService.getTotalPatients());
            patientDataResponse.put("pager", pager);
            return ResponseEntity.ok(patientDataResponse);
        }   catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
}
