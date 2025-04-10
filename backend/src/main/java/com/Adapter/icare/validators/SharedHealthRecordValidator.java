package com.Adapter.icare.validators;

import com.Adapter.icare.Dtos.SharedHealthRecordsDTO;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SharedHealthRecordValidator {

    private final Validator validator; // JSR-380 Validator

    // Initialize the validator instance (thread-safe)
    public SharedHealthRecordValidator() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            this.validator = factory.getValidator();
        }
    }

    /**
     * Validates a SharedHealthRecordsDTO using Bean Validation annotations (@NotNull, @Valid, etc.).
     *
     * @param record The record to validate.
     * @return A list of formatted validation error messages. Empty if valid.
     */
    public List<String> validate(SharedHealthRecordsDTO record) {
        if (record == null) {
            return List.of("SharedHealthRecordsDTO record cannot be null.");
        }

        // Trigger Bean Validation
        Set<ConstraintViolation<SharedHealthRecordsDTO>> violations = validator.validate(record);

        return violations.stream()
                .map(violation -> String.format("Field '%s': %s",
                        violation.getPropertyPath(), // e.g., "demographicDetails.firstName"
                        violation.getMessage()))     // e.g., "firstName can not be null"
                .collect(Collectors.toList());
    }
}