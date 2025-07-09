package com.Adapter.icare.validators;

import com.Adapter.icare.Dtos.SharedHealthRecordsDTO;
import com.Adapter.icare.Services.ValidatorService;
import com.Adapter.icare.Utils.DtoSchemaGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class SharedHealthRecordValidator {

    private final Validator validator;// JSR-380 Validator
    private static final Pattern TEMPLATE_PATTERN = Pattern.compile("#\\{([^}]+)\\}");
    private final ValidatorService validatorService;
    private static final ExpressionParser expressionParser = new SpelExpressionParser();

    // Initialize the validator instance (thread-safe)
    public SharedHealthRecordValidator(ValidatorService validatorService) {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            this.validator = factory.getValidator();
        }

        this.validatorService = validatorService;
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

    public List<String> dynamicValidate(SharedHealthRecordsDTO record){
        List<String> errors = new ArrayList<>();
        if (record == null) {
            return List.of("SharedHealthRecordsDTO record cannot be null.");
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            var validators = this.validatorService.getValidators();
            File jsonFile = new File("src/main/resources/validators.json");

//            List<CustomValidator> customValidators = mapper.readValue(jsonFile, new TypeReference<List<CustomValidator>>() {});

            if(!validators.isEmpty()){
                for(var validator: validators){
                    Matcher matcher = TEMPLATE_PATTERN.matcher(validator.getRuleExpression());

                    String ruleExpression = validator.getRuleExpression();

                    while (matcher.find()){

                        String keyInsideVariable = matcher.group(1);
                        String variableToReplace = matcher.group(0);

                        ruleExpression = ruleExpression.replace(variableToReplace, keyInsideVariable);

                    }

                    Expression ruleExpressionParsed = expressionParser.parseExpression(ruleExpression);
                    var expressionValue = (Boolean) ruleExpressionParsed.getValue(record);
                    if(expressionValue != null && !expressionValue){
                        errors.add(validator.getErrorMessage());
                    }
                }
            }

            for(String error: errors){
                System.out.println(error);
            }
            return errors;

//        } catch (DatabindException e) {
//            errors.add("Data Bind error occurred: "+ e);
//            System.out.println("DATABIND EXCEPTION " + e);
//        } catch (IOException e) {
//            System.err.println("Error reading or mapping JSON file: " + e.getMessage());
//            errors.add("Error reading json file: "+ e);
        } catch (Exception e) {
            System.err.println("Unknown error occurred: " + e.getMessage());
            errors.add("Unknown error occurred: "+ e);
        }

        return errors;
    }
}