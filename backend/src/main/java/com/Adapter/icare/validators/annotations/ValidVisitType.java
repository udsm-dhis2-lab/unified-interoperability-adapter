package com.Adapter.icare.validators.annotations;

import com.Adapter.icare.validators.VisitTypeValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A custom validation annotation to ensure that a VisitType field is not null
 * and does not have the value of UNKNOWN.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = VisitTypeValidator.class)
public @interface ValidVisitType {

    String message() default "Visit type is invalid or not specified.";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}