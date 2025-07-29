package com.Adapter.icare.DHIS2.Controllers;

import com.Adapter.icare.DHIS2.DHISServices.ProgramsService;
import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Domains.Program;
import com.Adapter.icare.Services.InstanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/programs")
public class ProgramsController {
    private final ProgramsService programsService;
    private final InstanceService instanceService;

    public ProgramsController(ProgramsService programsService, InstanceService instanceService) {
        this.programsService = programsService;
        this.instanceService = instanceService;
    }

    @GetMapping("/remote")
    public ResponseEntity<Map<String, Object>> getDHIS2Programs(
            @RequestParam(value = "instance") String instance,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "programType", required = false) String programType,
            @RequestParam(value = "programId", required = false) String programId
    ) {
        try {
            Instance instanceDetails = instanceService.getInstanceByUuid(instance);
            Map<String, Object> response = new HashMap<>();
            if (instanceDetails != null) {
                Map<String, Object> remoteProgramsPayload = programsService.getDhis2Programs(
                        instance,
                        page,
                        pageSize,
                        q,
                        programType,
                        programId
                        );
                response.put("results", remoteProgramsPayload.get("programs"));
                response.put("pager", remoteProgramsPayload.get("pager"));
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Instance with uuid " + instance + " is not set");
                response.put("statusCode", HttpStatus.NOT_FOUND.value());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/select")
    public ResponseEntity<?> selectAndSaveProgram(@RequestBody Map<String, String> payload) {
        String instance = payload.get("instance");
        String programId = payload.get("programId");
        if (instance == null || programId == null) {
            return ResponseEntity.badRequest().body("Missing required parameters: instance, programId");
        }
        try {
            Program saved = programsService.saveSelectedProgram(instance, programId);
            return ResponseEntity.ok(saved.toMap());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
