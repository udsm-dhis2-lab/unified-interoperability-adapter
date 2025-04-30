package com.Adapter.icare.SharedHealthRecords.Utilities;

import org.hl7.fhir.r4.model.Observation;

import java.math.BigDecimal;
import java.util.Date;

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
}
