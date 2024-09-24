package com.Adapter.icare.ClientRegistry.Controllers;

import ca.uhn.fhir.rest.api.MethodOutcome;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Dtos.MergeClients;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.codesystems.AdministrativeGender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

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
            @RequestParam(value = "status", defaultValue = "true") String status,
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
                    status,
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

    @PostMapping(value = "merge",consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> mergePatients(
            @RequestBody MergeClients clientsToMerge
    ) throws Exception {
        try {
            Map<String, Object> mergeResponse = new HashMap<>();
            // Get patients
            Patient patientToKeep = clientRegistryService.getPatientById(String.valueOf(clientsToMerge.getClientOne()));
            Patient patientToDeActivate = clientRegistryService.getPatientById(String.valueOf(clientsToMerge.getClientTwo()));

            // Merge identifiers
            List<Identifier> mergedIdentifiers = new ArrayList<>(patientToKeep.getIdentifier());
            mergedIdentifiers.addAll(patientToDeActivate.getIdentifier().stream()
                    .filter(id2 -> !mergedIdentifiers.contains(id2))
                    .collect(Collectors.toList()));
            patientToKeep.setIdentifier(mergedIdentifiers);

            // Merge names
            List<HumanName> mergedNames = new ArrayList<>(patientToKeep.getName());
            mergedNames.addAll(patientToDeActivate.getName().stream()
                    .filter(name2 -> !mergedNames.contains(name2))
                    .collect(Collectors.toList()));
            patientToKeep.setName(mergedNames);

            // Merge addresses
            List<Address> mergedAddresses = new ArrayList<>(patientToKeep.getAddress());
            mergedAddresses.addAll(patientToDeActivate.getAddress().stream()
                    .filter(address2 -> !mergedAddresses.contains(address2))
                    .collect(Collectors.toList()));
            patientToKeep.setAddress(mergedAddresses);

            if (patientToKeep.getGender() != null) {
                patientToKeep.setGender(patientToKeep.getGender());
            } else {
                patientToKeep.setGender(patientToDeActivate.getGender());
            }

            patientToKeep.setBirthDate(patientToKeep.getBirthDate() != null ? patientToKeep.getBirthDate() : patientToDeActivate.getBirthDate());

            Patient mergedPatient = clientRegistryService.savePatient(patientToKeep);
            MethodOutcome clientUpdateOutcome = clientRegistryService.markPatientAsInActive(mergedPatient);
            mergeResponse.put("mergedClient", mergedPatient);
            mergeResponse.put("deActivatedClient", patientToDeActivate);

            return ResponseEntity.ok(mergeResponse);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
