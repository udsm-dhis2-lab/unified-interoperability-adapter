package com.Adapter.icare.Organisations.Controllers;

import com.Adapter.icare.Organisations.Services.OrganisationsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organisationUnits")
public class OrganisationsController {

    private final OrganisationsService organisationsService;

    public OrganisationsController(OrganisationsService organisationsService) {
        this.organisationsService = organisationsService;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getOrganisations(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "q", required = false) String q
    ) throws Exception {
        try {
            Map<String, Object> orgUnitsResponse = new HashMap<>();
            List<Map<String,Object>> organizationsList = organisationsService.getOrganisations(page,pageSize,q);
            orgUnitsResponse.put("results", organizationsList);
            Map<String, Object> pager = new HashMap<>();
            pager.put("total", organizationsList.size());
            pager.put("totalPages", null);
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            orgUnitsResponse.put("pager", pager);
            return ResponseEntity.ok(orgUnitsResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
