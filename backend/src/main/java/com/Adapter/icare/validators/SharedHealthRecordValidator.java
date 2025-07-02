package com.Adapter.icare.validators;

import com.Adapter.icare.Dtos.SharedHealthRecordsDTO;
import com.Adapter.icare.Utils.DTONavigator;
import com.Adapter.icare.validators.models.CustomValidator;
import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class SharedHealthRecordValidator {

    private final Validator validator; // JSR-380 Validator
    private static final Pattern TEMPLATE_PATTERN = Pattern.compile("#\\{([^}]+)\\}");
    private static final ExpressionParser expressionParser = new SpelExpressionParser();

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

    public List<String> dynamicValidate(SharedHealthRecordsDTO record){
        if (record == null) {
            return List.of("SharedHealthRecordsDTO record cannot be null.");
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            File jsonFile = new File("src/main/resources/validators.json");

            List<CustomValidator> customValidators = mapper.readValue(jsonFile, new TypeReference<List<CustomValidator>>() {});

            if(!customValidators.isEmpty()){
                for(CustomValidator validator: customValidators){
                    Matcher matcher = TEMPLATE_PATTERN.matcher(validator.getRuleExpression());

                    String ruleExpression = validator.getRuleExpression();

                    while (matcher.find()){

                        String keyInsideVariable = matcher.group(1);
                        String variableToReplace = matcher.group(0);

                        AtomicReference<Object> valueRef = new AtomicReference<>();

                        Optional<Object> valueOptional = DTONavigator.getValueByPath(record, keyInsideVariable);

                        valueOptional.ifPresent(valueRef::set);

                        var value = valueRef.get();

                        ruleExpression = ruleExpression.replace(variableToReplace, keyInsideVariable);

                    }

                    Expression ruleExpressionParsed = expressionParser.parseExpression(ruleExpression);
                    System.out.println("Rule expression answer: " + ruleExpressionParsed.getValue(record));

                    System.out.println("Rule Expression: " + validator.getRuleExpression());
                }
            }

        } catch (DatabindException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            System.err.println("Error reading or mapping JSON file: " + e.getMessage());
            System.out.println(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Map to String
        // Rule definition reader
//        - Regex to get variables in our rule
//         - EG -> "#{}"
        // Get values based on variables from the String (1)
        // replace variables with values
        // Execute the expression to get boolean value
        // From boolean accumulate errors
        // Extract message based on the rule
//        return errors
        return List.of("");
    }
}