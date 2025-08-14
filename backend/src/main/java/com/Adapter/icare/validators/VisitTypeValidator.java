package com.Adapter.icare.validators;

import com.Adapter.icare.Enums.VisitType;
import com.Adapter.icare.validators.annotations.ValidVisitType;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class VisitTypeValidator implements ConstraintValidator<ValidVisitType, VisitType> {

    @Override
    public void initialize(ValidVisitType constraintAnnotation) {
        // We can perform initialization here if needed, but for this case, it's not necessary.
        System.out.println("Validator is being called: ");
    }

    @Override
    public boolean isValid(VisitType visitType, ConstraintValidatorContext context) {
        return visitType != null && !visitType.toString().isEmpty();
    }
}