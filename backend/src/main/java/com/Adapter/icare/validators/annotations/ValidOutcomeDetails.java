package com.Adapter.icare.validators.annotations;

import com.Adapter.icare.validators.OutcomeDetailsValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = OutcomeDetailsValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidOutcomeDetails {

    // Default error message if specific field messages aren't added
    String message() default "Inconsistent outcome details: isAlive status conflicts with death details.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}