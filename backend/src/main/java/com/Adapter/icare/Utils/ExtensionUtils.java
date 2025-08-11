package com.Adapter.icare.Utils;

import org.hl7.fhir.r4.model.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class ExtensionUtils {
    public static String getNestedExtensionValueString(DomainResource resource, String parentUrl, String childUrl) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof StringType) {
                            return ((StringType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static Integer getNestedExtensionValueInteger(DomainResource resource, String parentUrl, String childUrl) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof IntegerType) {
                            return ((IntegerType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static Integer getNestedExtensionValueDecimal(DomainResource resource, String parentUrl, String childUrl) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof DecimalType) {
                            return ((DecimalType) childExtension.getValue()).getValue().intValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static Date getNestedExtensionValueDateTime(DomainResource resource, String parentUrl, String childUrl) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof DateTimeType) {
                            return ((DateTimeType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    public static Boolean getNestedExtensionValueBoolean(DomainResource resource, String parentUrl, String childUrl) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof BooleanType) {
                            return ((BooleanType) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return Boolean.FALSE;
    }

    public static Date getExtensionValueDatetime(DomainResource resource, String url){
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof DateTimeType) {
                    return ((DateTimeType) parentExtension.getValue()).getValue();
                }
            }
        }
        return null;
    }

    public static Boolean getExtensionValueBoolean(DomainResource resource, String url) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof BooleanType) {
                    return ((BooleanType) parentExtension.getValue()).getValue();
                }
            }
        }
        return null;
    }

    public static String getExtensionValueString(DomainResource resource, String url) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof StringType) {
                    return ((StringType) parentExtension.getValue()).getValue();
                }
            }
        }
        return "";
    }

    public static Integer getExtensionValueInt(DomainResource resource, String url) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof IntegerType) {
                    return ((IntegerType) parentExtension.getValue()).getValue();
                }
            }
        }
        return 0;
    }

    public static DecimalType getExtensionValueDecimal(DomainResource resource, String url) {
        if (resource != null && resource.hasExtension()) {
            for (Extension parentExtension : resource.getExtension()) {
                if (parentExtension.getUrl().equals(url) && parentExtension.hasValue()
                        && parentExtension.getValue() instanceof DecimalType) {
                    return ((DecimalType) parentExtension.getValue());
                }
            }
        }
        return null;
    }

    /**
     * Finds an extension by its URL on a given resource and returns its value
     * if that value is a CodeableConcept.
     *
     * @param resource The FHIR resource to search within (e.g., Specimen, Observation).
     * @param url The unique URL of the extension to find.
     * @return The CodeableConcept object if found, otherwise null.
     */
    public static CodeableConcept getExtensionValueCodeableConcept(DomainResource resource, String url) {
        if (resource == null || !resource.hasExtension() || url == null || url.isEmpty()) {
            return null;
        }

        for (Extension extension : resource.getExtension()) {
            if (url.equals(extension.getUrl()) && extension.hasValue()) {
                if (extension.getValue() instanceof CodeableConcept) {
                    return (CodeableConcept) extension.getValue();
                }
            }
        }

        return null;
    }

    public static BigDecimal getResourceNestedExtensionQuantityValue(Procedure procedure, String parentUrl,
                                                                     String childUrl) {
        if (procedure != null && procedure.hasExtension()) {
            for (Extension parentExtension : procedure.getExtension()) {
                if (parentExtension.getUrl().equals(parentUrl) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtension.getUrl().equals(childUrl)
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof Quantity) {
                            return ((Quantity) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Gets the BigDecimal value from a Quantity found in a nested extension structure
     * within any FHIR resource.
     * <p>
     * Searches for a parent extension matching parentUrl, then within that,
     * searches for a child extension matching childUrl whose value is a Quantity.
     *
     * @param resource  The FHIR resource (e.g., Procedure, Observation, Patient) to search within.
     *                  Must implement IBaseResource (which most FHIR model classes do).
     * @param parentUrl The canonical URL of the parent extension. Cannot be null or blank.
     * @param childUrl  The canonical URL of the child extension (nested within the parent). Cannot be null or blank.
     * @return The BigDecimal value of the Quantity if found, otherwise null.
     */
    public static BigDecimal getResourceNestedExtensionQuantityValue(
            DomainResource resource,
            String parentUrl,
            String childUrl) {

        if (resource == null) {
            System.err.println("Input resource cannot be null.");
            return null;
        }
        if (parentUrl == null || parentUrl.isBlank()) {
            System.err.println("Parent extension URL cannot be null or blank.");
            return null;
        }
        if (childUrl == null || childUrl.isBlank()) {
            System.err.println("Child extension URL cannot be null or blank.");
            return null;
        }

        if (resource.hasExtension()) {
            List<Extension> topLevelExtensions;
            try {
                topLevelExtensions = resource.getExtension();
            } catch (ClassCastException e) {
                System.err.println("Could not get extensions. Type: " + resource.getClass().getName());
                return null;
            }


            for (Extension parentExtension : topLevelExtensions) {
                if (parentUrl.equals(parentExtension.getUrl()) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childUrl.equals(childExtension.getUrl())
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof Quantity) {
                            return ((Quantity) childExtension.getValue()).getValue();
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Gets the Integer value from a Quantity found in a nested extension structure
     * within any FHIR DomainResource.
     * <p>
     * Searches for a parent extension matching parentUrl, then within that,
     * searches for a child extension matching childUrl whose value is a Quantity.
     * The BigDecimal value of the Quantity is converted to an Integer using intValue()
     * (fractional parts are truncated).
     *
     * @param resource  The FHIR resource (e.g., Procedure, Observation, Patient) to search within.
     *                  Must be a DomainResource or inherit from it.
     * @param parentUrl The canonical URL of the parent extension. Cannot be null or blank.
     * @param childUrl  The canonical URL of the child extension (nested within the parent). Cannot be null or blank.
     * @return The Integer value of the Quantity if found and convertible, otherwise null.
     *         Returns null if the Quantity's value is null.
     */
    public static Integer getResourceNestedExtensionQuantityValueAsInteger(
                DomainResource resource,
                String parentUrl,
                String childUrl) {

        if (resource == null) {
            System.err.println("Input resource cannot be null.");
            return null;
        }
        if (parentUrl == null || parentUrl.isBlank()) {
            System.err.println("Parent extension URL cannot be null or blank.");
            return null;
        }
        if (childUrl == null || childUrl.isBlank()) {
            System.err.println("Child extension URL cannot be null or blank.");
            return null;
        }

        if (resource.hasExtension()) {
            List<Extension> topLevelExtensions;
            try {
                topLevelExtensions = resource.getExtension();
            } catch (Exception e) {
                System.err.println("Could not get extensions. Type: " + resource.getClass().getName() + ", Error: " + e.getMessage());
                return null;
            }

            for (Extension parentExtension : topLevelExtensions) {
                if (parentUrl.equals(parentExtension.getUrl()) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childUrl.equals(childExtension.getUrl())
                                && childExtension.hasValue()
                                && childExtension.getValue() instanceof Quantity) {

                            Quantity quantity = (Quantity) childExtension.getValue();

                            if (quantity.hasValue()) {
                                BigDecimal decimalValue = quantity.getValue();
                                if (decimalValue != null) {
                                    return decimalValue.intValue();
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

}
