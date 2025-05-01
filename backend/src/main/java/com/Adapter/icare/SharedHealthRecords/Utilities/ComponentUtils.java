package com.Adapter.icare.SharedHealthRecords.Utilities;

import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Observation;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ComponentUtils {
    public static  BigDecimal getComponentValueQuantityInt(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueQuantity() && component.getValueQuantity().hasValue()) {
                return component.getValueQuantity().getValue();
            }
        }
        return null;
    }

    public static  Integer getComponentIntValue(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueIntegerType() && component.getValueIntegerType().hasValue()) {
                return component.getValueIntegerType().getValue();
            }
        }
        return null;
    }

    public static  String getComponentValueString(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueStringType() && component.getValueStringType().hasValue()) {
                return component.getValueStringType().toString();
            }
        }
        return null;
    }

    public static  Date getComponentValueDateTime(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueDateTimeType() && component.getValueDateTimeType().hasValue()) {
                return component.getValueDateTimeType().getValue();
            }
        }
        return null;
    }

    public static  Boolean getComponentValueBoolean(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueBooleanType() && component.getValueBooleanType().hasValue()) {
                return component.getValueBooleanType().booleanValue();
            }
        }
        return null;
    }

    public static String getComponentValueCodeableConceptDisplay(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding()
                    && !component.getValueCodeableConcept().getCoding().isEmpty()) {
                return component.getValueCodeableConcept().getCoding().get(0).getDisplay();
            }
        }
        return null;
    }

    public static  String getComponentValueCodeableConceptCode(Observation observation, int index) {
        if (observation.hasComponent() && observation.getComponent().size() > index) {
            Observation.ObservationComponentComponent component = observation.getComponent().get(index);
            if (component.hasValueCodeableConcept() && component.getValueCodeableConcept().hasCoding()
                    && !component.getValueCodeableConcept().getCoding().isEmpty()) {
                return component.getValueCodeableConcept().getCoding().get(0).getCode();
            }
        }
        return null;
    }

    /**
     * Finds and returns all Observation components within a given Observation
     * that match the specified code and system.
     *
     * This method is null-safe for the observation input.
     * It requires non-blank targetSystem and targetCode.
     *
     * @param observation   The HAPI FHIR Observation object to search within. Can be null.
     * @param targetSystem  The coding system URI (e.g., "http://loinc.org", "http://snomed.info/sct", or your custom system URL). Must not be blank.
     * @param targetCode    The specific code value to match within the target system (e.g., "8480-6", "YOUR_CUSTOM_CODE"). Must not be blank.
     * @return A List containing all matching ObservationComponentComponent objects. Returns an empty list if
     *         the observation is null, has no components, no matching components are found,
     *         or if targetSystem/targetCode are blank.
     */
    public static List<Observation.ObservationComponentComponent> getComponentsByCode(
            Observation observation,
            String targetSystem,
            String targetCode) {

        if (observation == null || !observation.hasComponent()) {
            return Collections.emptyList();
        }
        if (targetSystem == null || targetSystem.isBlank() || targetCode == null || targetCode.isBlank()) {
            System.err.println("Error: Target system and code cannot be blank.");
            return Collections.emptyList();
        }

        return observation.getComponent().stream()
                .filter(Objects::nonNull)
                .filter(Observation.ObservationComponentComponent::hasCode)
                .filter(component -> codeableConceptMatches(component.getCode(), targetSystem, targetCode))
                .collect(Collectors.toList());
    }

    /**
     * Helper method to check if a CodeableConcept contains a Coding
     * matching the target system and code.
     *
     * @param codeableConcept The CodeableConcept to check.
     * @param targetSystem   The system URI to match.
     * @param targetCode     The code value to match.
     * @return true if a matching Coding is found, false otherwise.
     */
    private static boolean codeableConceptMatches(CodeableConcept codeableConcept, String targetSystem, String targetCode) {
        if (codeableConcept == null || !codeableConcept.hasCoding()) {
            return false;
        }

        return codeableConcept.getCoding().stream()
                .filter(Objects::nonNull)
                .filter(coding -> coding.hasSystem() && coding.hasCode())
                .anyMatch(coding -> targetSystem.equals(coding.getSystem()) &&
                        targetCode.equals(coding.getCode()));
    }
}
