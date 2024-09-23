package com.Adapter.icare.ClientRegistry.Controllers;

import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Map<String, Object>>> getPatients() {
        try {
            List<Map<String, Object>> patients = clientRegistryService.getPatients();
            return ResponseEntity.ok(patients);
        }   catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
}
