package com.Adapter.icare.Controllers;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Domains.Validator;
import com.Adapter.icare.Services.UserService;
import com.Adapter.icare.Services.ValidatorService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.zip.DataFormatException;

@RestController
@RequestMapping("/api/v1")
public class ValidatorsController {

    private final ValidatorService validatorService;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public ValidatorsController(
            ValidatorService validatorService,
            UserService userService) {
     this.validatorService = validatorService;
     this.userService = userService;

        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }

    }

    @GetMapping("validators")
    public ResponseEntity<Map<String, Object>> getValidators(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "paging", defaultValue = "true") Boolean paging,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "name", required = false) String name) throws Exception {
        try {
            List<Map<String, Object>> validatorsList = new ArrayList<>();
            Page<Validator> pagedValidatorData = validatorService.getValidatorsByPagination(page, pageSize, paging, code,
                    name);
            for (Validator validator : pagedValidatorData.getContent()) {
                validatorsList.add(validator.toMap());
            }
            Map<String, Object> returnObject = new HashMap<>();
            Map<String, Object> pager = new HashMap<>();
            pager.put("page", page);
            pager.put("pageSize", pageSize);
            pager.put("totalPages", pagedValidatorData.getTotalPages());
            pager.put("total", pagedValidatorData.getTotalElements());
            returnObject.put("pager", pager);
            returnObject.put("results", validatorsList);
            return ResponseEntity.ok(returnObject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("validators/{uuid}")
    public ResponseEntity<Map<String, Object>> getValidator(
            @PathVariable("uuid") String uuid) throws Exception {
        try {
            Validator validator = validatorService.getValidatorByUuid(uuid);
            if (validator != null) {
                return ResponseEntity.ok(validator.toMap());
            } else {
                throw new NoSuchElementException("Validator with uuid " + uuid + " does not exists");
            }
        } catch (NoSuchElementException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to get validator");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e);
            error.put("message", "Failed to get validator");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("validators")
    public ResponseEntity<Map<String, Object>> addValidator(@Valid @RequestBody Map<String, Object> validatorDTO) {
        try {
            Validator validator = new Validator().fromMap(validatorDTO);
            if (this.authentication != null && this.authenticatedUser != null) {
                validator.setCreatedBy(this.authenticatedUser);
            }
            return ResponseEntity.ok(validatorService.addNewValidator(validator).toMap());
        } catch (DataFormatException e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("message", e.getMessage());
            errorMap.put("error", "Failed to add validator");

            System.out.println("ERROR CREATING VALIDATOR: "+ e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("message", e.getMessage());
            errorMap.put("error", "Failed to add validator");

            System.out.println("ERROR CREATING VALIDATOR: "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
        }
    }

    @PutMapping("validators/{uuid}")
    public ResponseEntity<Map<String, Object>> updateValidator(@PathVariable("uuid") String uuid,
                                                              @Valid @RequestBody Map<String, Object> validatorDTO) {
        try {
            Validator validator = new Validator().fromMap(validatorDTO);
            if (validator.getUuid() == null) {
                validator.setUuid(uuid);
                if (this.authentication != null && this.authenticatedUser != null) {
                    validator.setLastUpdatedBy(this.authenticatedUser);
                }
            }
            return ResponseEntity.ok(validatorService.updateValidator(validator).toMap());
        } catch (DataFormatException e){
            System.out.println("UPDATE VALIDATOR: "+ e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to update validator");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            System.out.println("UPDATE VALIDATOR: "+ e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to update validator");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("validators/{uuid}")
    public ResponseEntity<Map<String, Object>> deleteValidators(@PathVariable("uuid") String uuid) throws Exception {
        try {
            Validator validator = validatorService.getValidatorByUuid(uuid);
            if (validator != null) {
                validatorService.deleteValidator(validator.getId());
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("message", "Validator deleted successfully.");
                return ResponseEntity.status(HttpStatus.OK).body(responseMap);
            } else {
                throw new NoSuchElementException("Validator with uuid " + uuid + " does not exists");
            }
        } catch (NoSuchElementException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to delete validator");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Failed to delete validator");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
