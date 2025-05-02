package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;
import ca.uhn.fhir.rest.server.exceptions.BaseServerResponseException;
import ca.uhn.fhir.util.BundleUtil;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Observation;

import java.util.ArrayList;
import java.util.List;

public class ObservationsUtils {
    public static List<Observation> getObservationsByCategory(IGenericClient fhirClient, String category, Encounter encounter, boolean forGroup,
                                                              boolean fetchLastUpdated) throws Exception {
        List<Observation> observations = new ArrayList<>();
        var observationSearch = fhirClient.search().forResource(Observation.class)
                .where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        Bundle observationBundle = new Bundle();
        // Valid sort params
        /**
         * [_content, _id, _lastUpdated, _profile, _security, _source, _tag, _text,
         * based-on,
         * category, code, code-value-concept, code-value-date, code-value-quantity,
         * code-value-string, combo-code, combo-code-value-concept,
         * combo-code-value-quantity,
         * combo-data-absent-reason, combo-value-concept, combo-value-quantity]
         */
        if (fetchLastUpdated) {
            observationBundle = observationSearch.sort().descending("_lastUpdated").offset(0).count(1)
                    .returnBundle(Bundle.class).execute();
        } else {
            observationBundle = observationSearch.sort().descending("_lastUpdated")
                    .returnBundle(Bundle.class)
                    .execute();
        }

        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Observation observation = (Observation) entryComponent.getResource();
                if (forGroup && !observation.hasDerivedFrom() && !observation.hasHasMember()) {
                    observations.add(observation);
                } else if (!forGroup) {
                    observations.add(observation);
                } else {
                    // Check if non-grouped obs falls here
                }
            }
        }

        return observations;
    }

    public static List<Observation> getObservationsByObservationGroupId(IGenericClient fhirClient, String category, Encounter encounter, String id)
            throws Exception {
        List<Observation> observations = new ArrayList<>();
        var observationSearch = fhirClient.search().forResource(Observation.class)
                .where(Observation.ENCOUNTER.hasAnyOfIds(encounter.getIdElement().getIdPart()));
        observationSearch.where(Observation.CATEGORY.exactly().code(category));
        observationSearch.where(Observation.HAS_MEMBER.hasId(id));
        Bundle observationBundle = new Bundle();
        observationBundle = observationSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Observation observation = (Observation) entryComponent.getResource();
                observations.add(observation);
            }
        }

        return observations;
    }

    /**
     * Finds Observation resources matching a specific category code and observation code.
     * Only matches the code part of the token.
     *
     * @param categoryCode The code for the Observation category (e.g., "vital-signs").
     * @param observationCode The code for the Observation itself (e.g., "8302-2" for body height).
     * @return A list of matching Observation resources, or an empty list if none found.
     */
    public static List<Observation> getObservationsByCategoryAndCode(IGenericClient fhirClient, FhirContext ctx, String categoryCode, String observationCode) {

        if (fhirClient == null || ctx == null || categoryCode == null || categoryCode.isBlank() || observationCode == null || observationCode.isBlank()) {
            System.err.println("FHIR client, context, category code, and observation code must be provided.");
            return List.of(); // Return empty list for invalid input
        }

        try {
            // Build the search query using .hasCode()
            Bundle resultsBundle = fhirClient.search()
                    .forResource(Observation.class)
                    .where(Observation.CATEGORY.exactly().code(categoryCode))
                    .and(Observation.CODE.exactly().code(observationCode))
                    .returnBundle(Bundle.class)
                    .execute();

            // Extract resources
            List<Observation> observations = BundleUtil.toListOfResourcesOfType(ctx, resultsBundle, Observation.class);

            System.out.println("Found " + observations.size() + " observations matching category code '" + categoryCode + "' and observation code '" + observationCode + "'.");
            return observations;

        } catch (BaseServerResponseException e) {
            System.err.println("Error response from FHIR server: " + e.getStatusCode() + " " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred while searching for observations: " + e.getMessage());
        }

        return List.of(); // Return empty list on error
    }

    /**
     * Finds Observation resources matching a specific category and observation code,
     * including their systems.
     *
     * @param categorySystem The system URL for the category code.
     * @param categoryCode The code for the Observation category.
     * @param observationSystem The system URL for the observation code (e.g., "http://loinc.org").
     * @param observationCode The code for the Observation itself.
     * @return A list of matching Observation resources, or an empty list if none found.
     */
    public static List<Observation> getObservationsByCategoryAndCodeWithSystem(
            IGenericClient fhirClient,
            FhirContext ctx,
            String categorySystem, String categoryCode,
            String observationSystem, String observationCode) {

        // Basic input validation (add more checks if needed)
        if (categoryCode == null || categoryCode.isBlank() || observationCode == null || observationCode.isBlank()) {
            System.err.println("Category code and observation code must be provided.");
            return List.of(); // Return empty list for invalid input
        }
        // Systems can potentially be optional in some searches, but check if required
        if (categorySystem == null || categorySystem.isBlank() || observationSystem == null || observationSystem.isBlank()) {
            System.err.println("Systems for category and observation code must be provided for this specific search.");
            return List.of();
        }

        try {
            // Build the search query
            Bundle resultsBundle = fhirClient.search()
                    .forResource(Observation.class)
                    // --- Add criteria with systems ---
                    .where(Observation.CATEGORY.exactly().systemAndCode(categorySystem, categoryCode))
                    .and(Observation.CODE.exactly().systemAndCode(observationSystem, observationCode))
                    // --- Specify return type and execute ---
                    .returnBundle(Bundle.class)
                    .execute();

            List<Observation> observations = BundleUtil.toListOfResourcesOfType(ctx, resultsBundle, Observation.class);

            System.out.println("Found " + observations.size() + " observations matching category '"
                    + categorySystem + "|" + categoryCode + "' and code '" + observationSystem + "|" + observationCode + "'.");
            return observations;

        } catch (BaseServerResponseException e) {
            System.err.println("Error response from FHIR server: " + e.getStatusCode() + " " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred while searching for observations: " + e.getMessage());
        }

        return List.of();
    }
}
