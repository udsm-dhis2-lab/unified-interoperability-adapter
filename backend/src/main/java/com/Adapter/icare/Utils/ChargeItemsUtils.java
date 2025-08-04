package com.Adapter.icare.Utils;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.ChargeItem;
import org.hl7.fhir.r4.model.Extension;
import org.hl7.fhir.r4.model.Type;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ChargeItemsUtils {
    public static List<ChargeItem> getChargeItemsByEncounterId(IGenericClient fhirClient, String encounterId) throws Exception {
        List<ChargeItem> chargeItems = new ArrayList<>();
        var chargeItemsSearch = fhirClient.search().forResource(ChargeItem.class)
                .where(ChargeItem.CONTEXT.hasAnyOfIds(encounterId));

        Bundle chargeItemsBundle;
        chargeItemsBundle = chargeItemsSearch.returnBundle(Bundle.class).execute();
        if (chargeItemsBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : chargeItemsBundle.getEntry()) {
                ChargeItem chargeItem = (ChargeItem) entryComponent.getResource();
                chargeItems.add(chargeItem);
            }
        }
        return chargeItems;
    }


    /**
     * Gets the value of a specific type from a nested extension structure
     * within a ChargeItem resource.
     * <p>
     * Searches for a parent extension matching parentUrl, then within that,
     * searches for a child extension matching childUrl whose value is of the
     * specified expectedValueType.
     *
     * @param chargeItem         The ChargeItem resource to search within.
     * @param parentExtensionUrl The canonical URL of the parent extension.
     * @param childExtensionUrl  The canonical URL of the child extension (nested).
     * @param expectedValueType  The Class of the expected FHIR data type for the child extension's value
     *                           (e.g., Quantity.class, StringType.class, IntegerType.class).
     * @param <T>                The generic type extending FHIR's Type class, representing the expected value type.
     * @return An Optional containing the extracted value of type T if found and type matches,
     * otherwise Optional.empty().
     */
    public static <T extends Type> Optional<String> getChargeItemNestedExtensionValue(
            ChargeItem chargeItem,
            String parentExtensionUrl,
            String childExtensionUrl,
            Class<String> expectedValueType) {

        if (chargeItem == null) {
            System.err.println("Input ChargeItem cannot be null.");
            return Optional.empty();
        }
        if (parentExtensionUrl == null || parentExtensionUrl.isBlank()) {
            System.err.println("Parent extension URL cannot be null or blank.");
            return Optional.empty();
        }
        if (childExtensionUrl == null || childExtensionUrl.isBlank()) {
            System.err.println("Child extension URL cannot be null or blank.");
            return Optional.empty();
        }
        if (expectedValueType == null) {
            System.err.println("Expected value type class cannot be null.");
            return Optional.empty();
        }


        if (chargeItem.hasExtension()) {
            List<Extension> topLevelExtensions = chargeItem.getExtension();

            for (Extension parentExtension : topLevelExtensions) {
                if (parentExtensionUrl.equals(parentExtension.getUrl()) && parentExtension.hasExtension()) {
                    for (Extension childExtension : parentExtension.getExtension()) {
                        if (childExtensionUrl.equals(childExtension.getUrl()) && childExtension.hasValue()) {
                            Type value = childExtension.getValue();
                            if (expectedValueType.isInstance(value)) {
                                return Optional.of(expectedValueType.cast(value));
                            } else {
                                System.err.println("Child extension '" + childExtensionUrl +
                                        "' found, but its value type (" + value.getClass().getSimpleName() +
                                        ") does not match expected type (" + expectedValueType.getSimpleName() + ").");
                            }
                        }
                    }
                }
            }
        }

        return Optional.empty();
    }
}
