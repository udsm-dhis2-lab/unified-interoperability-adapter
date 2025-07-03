package com.Adapter.icare.Utils;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ExpressionEvaluator {

    public static class ValidationResult {
        private final boolean isValid;
        private final List<String> errors;
        private final String processedExpression;

        public ValidationResult(boolean isValid, List<String> errors, String processedExpression) {
            this.isValid = isValid;
            this.errors = new ArrayList<>(errors);
            this.processedExpression = processedExpression;
        }

        public boolean isValid() { return isValid; }
        public List<String> getErrors() { return new ArrayList<>(errors); }
        public String getProcessedExpression() { return processedExpression; }

        @Override
        public String toString() {
            return String.format("Valid: %s, Errors: %s, Expression: %s",
                    isValid, errors, processedExpression);
        }
    }

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("#\\{([^}]+)\\}");

    /**
     * Evaluates an expression by replacing variables and checking the condition
     * @param expression The expression with variables in #{variable_name} format
     * @param variables Map of variable names to their values
     * @return ValidationResult containing the evaluation result and any errors
     */
    public static ValidationResult evaluateExpression(String expression, Map<String, Object> variables) {
        List<String> errors = new ArrayList<>();

        try {
            // Replace variables in the expression
            String processedExpression = replaceVariables(expression, variables, errors);

            if (!errors.isEmpty()) {
                return new ValidationResult(false, errors, processedExpression);
            }

            // Evaluate the boolean expression
            boolean result = evaluateBooleanExpression(processedExpression);

            // If result is false, the condition is violated
            if (!result) {
                errors.add("Expression condition violated: " + processedExpression);

                // Find which variables contributed to the violation
                findViolatedVariables(expression, variables, errors);
            }

            return new ValidationResult(result, errors, processedExpression);

        } catch (Exception e) {
            errors.add("Error evaluating expression: " + e.getMessage());
            return new ValidationResult(false, errors, expression);
        }
    }

    /**
     * Replaces variables in the expression with their values
     */
    private static String replaceVariables(String expression, Map<String, Object> variables, List<String> errors) {
        Matcher matcher = VARIABLE_PATTERN.matcher(expression);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String variableName = matcher.group(1);

            if (!variables.containsKey(variableName)) {
                errors.add("Variable not found: " + variableName);
                matcher.appendReplacement(result, "null");
            } else {
                Object value = variables.get(variableName);
                String replacement = (value != null) ? value.toString() : "null";
                matcher.appendReplacement(result, replacement);
            }
        }
        matcher.appendTail(result);

        return result.toString();
    }

    /**
     * Evaluates a simple boolean expression
     * Supports: ==, !=, <, >, <=, >=, &&, ||, parentheses
     */
    private static boolean evaluateBooleanExpression(String expression) {
        // Remove whitespace
        expression = expression.replaceAll("\\s+", "");

        // Handle OR operations (||)
        if (expression.contains("||")) {
            String[] parts = expression.split("\\|\\|");
            for (String part : parts) {
                if (evaluateBooleanExpression(part.trim())) {
                    return true;
                }
            }
            return false;
        }

        // Handle AND operations (&&)
        if (expression.contains("&&")) {
            String[] parts = expression.split("&&");
            for (String part : parts) {
                if (!evaluateBooleanExpression(part.trim())) {
                    return false;
                }
            }
            return true;
        }

        // Handle parentheses
        if (expression.contains("(")) {
            return evaluateParentheses(expression);
        }

        // Handle comparison operations
        return evaluateComparison(expression);
    }

    /**
     * Evaluates expressions with parentheses
     */
    private static boolean evaluateParentheses(String expression) {
        while (expression.contains("(")) {
            int start = expression.lastIndexOf('(');
            int end = expression.indexOf(')', start);

            if (end == -1) {
                throw new IllegalArgumentException("Unmatched parentheses");
            }

            String innerExpression = expression.substring(start + 1, end);
            boolean innerResult = evaluateBooleanExpression(innerExpression);

            expression = expression.substring(0, start) + innerResult + expression.substring(end + 1);
        }

        return Boolean.parseBoolean(expression);
    }

    /**
     * Evaluates comparison operations
     */
    private static boolean evaluateComparison(String expression) {
        String[] operators = {"==", "!=", "<=", ">=", "<", ">"};

        for (String op : operators) {
            if (expression.contains(op)) {
                String[] parts = expression.split(Pattern.quote(op), 2);
                if (parts.length == 2) {
                    String left = parts[0].trim();
                    String right = parts[1].trim();

                    return compareValues(left, right, op);
                }
            }
        }

        throw new IllegalArgumentException("Invalid comparison expression: " + expression);
    }

    /**
     * Compares two values based on the operator
     */
    private static boolean compareValues(String left, String right, String operator) {
        // Try to parse as numbers first
        try {
            double leftNum = Double.parseDouble(left);
            double rightNum = Double.parseDouble(right);

            switch (operator) {
                case "==": return leftNum == rightNum;
                case "!=": return leftNum != rightNum;
                case "<": return leftNum < rightNum;
                case ">": return leftNum > rightNum;
                case "<=": return leftNum <= rightNum;
                case ">=": return leftNum >= rightNum;
                default: return false;
            }
        } catch (NumberFormatException e) {
            // If not numbers, compare as strings
            switch (operator) {
                case "==": return left.equals(right);
                case "!=": return !left.equals(right);
                default:
                    throw new IllegalArgumentException("String comparison only supports == and !=");
            }
        }
    }

    /**
     * Identifies which specific variables contributed to a violation
     */
    private static void findViolatedVariables(String originalExpression, Map<String, Object> variables, List<String> errors) {
        Matcher matcher = VARIABLE_PATTERN.matcher(originalExpression);
        Set<String> variablesInExpression = new HashSet<>();

        while (matcher.find()) {
            variablesInExpression.add(matcher.group(1));
        }

        // Report the values of all variables that were part of the failed expression
        for (String varName : variablesInExpression) {
            if (variables.containsKey(varName)) {
                Object value = variables.get(varName);
                errors.add(String.format("Variable '%s' has value: %s", varName, value));
            }
        }
    }

    /**
     * Example usage and testing
     */
    public static void main(String[] args) {
        // Test case 1: Valid condition
        String expression1 = "#{MSDQI_RCH Patient 9 IPT} == 0 || #{MSDQI_RCH Patient 9 IPT} == -1";
        Map<String, Object> variables1 = new HashMap<>();
        variables1.put("MSDQI_RCH Patient 9 IPT", 0);

        ValidationResult result1 = evaluateExpression(expression1, variables1);
        System.out.println("Test 1 (valid): " + result1);
        System.out.println();

        // Test case 2: Invalid condition
        Map<String, Object> variables2 = new HashMap<>();
        variables2.put("MSDQI_RCH Patient 9 IPT", 5);

        ValidationResult result2 = evaluateExpression(expression1, variables2);
        System.out.println("Test 2 (invalid): " + result2);
        System.out.println("Errors:");
        result2.getErrors().forEach(error -> System.out.println("  - " + error));
        System.out.println();

        // Test case 3: Missing variable
        Map<String, Object> variables3 = new HashMap<>();

        ValidationResult result3 = evaluateExpression(expression1, variables3);
        System.out.println("Test 3 (missing variable): " + result3);
        System.out.println("Errors:");
        result3.getErrors().forEach(error -> System.out.println("  - " + error));
        System.out.println();

        // Test case 4: Complex expression
        String expression4 = "#{age} >= 18 && (#{status} == 1 || #{priority} == 0)";
        Map<String, Object> variables4 = new HashMap<>();
        variables4.put("age", 25);
        variables4.put("status", 0);
        variables4.put("priority", 1);

        ValidationResult result4 = evaluateExpression(expression4, variables4);
        System.out.println("Test 4 (complex): " + result4);
        if (!result4.getErrors().isEmpty()) {
            System.out.println("Errors:");
            result4.getErrors().forEach(error -> System.out.println("  - " + error));
        }
    }
}
