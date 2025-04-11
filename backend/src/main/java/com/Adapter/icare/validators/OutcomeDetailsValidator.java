package com.Adapter.icare.validators;

import com.Adapter.icare.Dtos.OutcomeDetailsDTO;
import com.Adapter.icare.validators.annotations.ValidOutcomeDetails;
import org.springframework.util.StringUtils;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class OutcomeDetailsValidator implements ConstraintValidator<ValidOutcomeDetails, OutcomeDetailsDTO> {

    @Override
    public void initialize(ValidOutcomeDetails constraintAnnotation) {
    }

    @Override
    public boolean isValid(OutcomeDetailsDTO outcomeDetails, ConstraintValidatorContext context) {
        if (outcomeDetails == null) {
            return true;
        }

        Boolean isAlive = outcomeDetails.getIsAlive();

        if (isAlive == null) {
            return false;
        }

        boolean isValid = true;

        if (Boolean.TRUE.equals(isAlive)) {
            // If alive, death details MUST be null/blank
            if (StringUtils.hasText(outcomeDetails.getDeathLocation())) {
                addConstraintViolation(context, "Death location must be null or blank when isAlive is true", "deathLocation");
                isValid = false;
            }
            if (outcomeDetails.getDeathDate() != null) {
                addConstraintViolation(context, "Death date must be null when isAlive is true", "deathDate");
                isValid = false;
            }
        } else {
            // If not alive, death details MUST be provided
            if (!StringUtils.hasText(outcomeDetails.getDeathLocation())) {
                addConstraintViolation(context, "Death location must be provided when isAlive is false", "deathLocation");
                isValid = false;
            }
            if (outcomeDetails.getDeathDate() == null) {
                addConstraintViolation(context, "Death date must be provided when isAlive is false", "deathDate");
                isValid = false;
            }
        }

        return isValid;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message, String fieldName) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(fieldName)
                .addConstraintViolation();
    }
}