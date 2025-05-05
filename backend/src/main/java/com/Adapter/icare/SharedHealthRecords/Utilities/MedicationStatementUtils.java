package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.server.exceptions.BaseServerResponseException;
import ca.uhn.fhir.util.BundleUtil;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.MedicationStatement;

import java.util.Collections;
import java.util.List;

public class MedicationStatementUtils {
    /**
     * Finds MedicationStatement resources matching a specific category code and medication code.
     * Only matches the code part of the token (ignores system).
     *
     * @param fhirClient     The initialized HAPI FHIR generic client.
     * @param ctx            The FHIR context associated with the client.
     * @param categoryCode   The code for the MedicationStatement category (e.g., "community", "inpatient").
     *                       See http://hl7.org/fhir/valueset-medication-statement-category.html
     * @param medicationCode The code representing the medication itself (e.g., an RxNorm, ATC, or local code).
     *                       This searches the MedicationStatement.medicationCodeableConcept field.
     * @return A List of matching MedicationStatement resources, or an empty list if none found or an error occurs.
     */
    public static List<MedicationStatement> getMedicationStatementsByCategoryAndCode(
            IGenericClient fhirClient,
            FhirContext ctx,
            String categoryCode,
            String medicationCode) {

        if (fhirClient == null || ctx == null || categoryCode == null || categoryCode.isBlank() || medicationCode == null || medicationCode.isBlank()) {
            System.err.println("FHIR client, context, category code, and medication code must be provided.");
            return Collections.emptyList();
        }

        try {
            Bundle resultsBundle = fhirClient.search()
                    .forResource(MedicationStatement.class)
                    .where(MedicationStatement.CATEGORY.exactly().code(categoryCode))
                    .and(MedicationStatement.CODE.exactly().code(medicationCode))
                    .returnBundle(Bundle.class)
                    .execute();

            List<MedicationStatement> statements = BundleUtil.toListOfResourcesOfType(ctx, resultsBundle, MedicationStatement.class);

            System.out.println("Found " + statements.size() + " MedicationStatements matching category '" + categoryCode + "' and medication code '" + medicationCode + "'.");
            return statements;

        } catch (BaseServerResponseException e) {
            System.err.println("Error response from FHIR server while searching MedicationStatements: "
                    + e.getStatusCode() + " " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred while searching for MedicationStatements: " + e.getMessage());
        }

        return Collections.emptyList();
    }

    /**
     * Finds MedicationStatement resources matching a specific category code and a medication represented by a CodeableConcept.
     * Uses the system and code from the *first* Coding found within the medicationCodeableConcept for the medication search criteria.
     * Matches only the code part of the token for the category.
     *
     * @param fhirClient                The initialized HAPI FHIR generic client.
     * @param ctx                       The FHIR context associated with the client.
     * @param categoryCode              The code for the MedicationStatement category (e.g., "community").
     * @param medicationCodeableConcept The CodeableConcept representing the medication to search for.
     * @return A List of matching MedicationStatement resources, or an empty list if none found or an error occurs.
     */
    public static List<MedicationStatement> getMedicationStatementsByCategoryAndCodeableConcept(
            IGenericClient fhirClient,
            FhirContext ctx,
            String categoryCode,
            CodeableConcept medicationCodeableConcept) {

        if (fhirClient == null || ctx == null || categoryCode == null || categoryCode.isBlank()) {
            System.err.println("FHIR client, context, and category code must be provided.");
            return Collections.emptyList();
        }
        if (medicationCodeableConcept == null || !medicationCodeableConcept.hasCoding()) {
            System.err.println("Medication CodeableConcept must be provided and contain at least one coding.");
            return Collections.emptyList();
        }

        Coding medicationCoding = medicationCodeableConcept.getCodingFirstRep();
        String medicationSystem = medicationCoding.getSystem();
        String medicationCode = medicationCoding.getCode();

        if (medicationSystem == null || medicationSystem.isBlank() || medicationCode == null || medicationCode.isBlank()) {
            System.err.println("The first coding in the medication CodeableConcept must have both a system and a code.");
            return Collections.emptyList();
        }

        try {
            Bundle resultsBundle = fhirClient.search()
                    .forResource(MedicationStatement.class)
                    .where(MedicationStatement.CATEGORY.exactly().code(categoryCode))
                    .and(MedicationStatement.CODE.exactly().systemAndCode(medicationSystem, medicationCode))
                    .returnBundle(Bundle.class)
                    .execute();

            List<MedicationStatement> statements = BundleUtil.toListOfResourcesOfType(ctx, resultsBundle, MedicationStatement.class);

            System.out.println("Found " + statements.size() + " MedicationStatements matching category '" + categoryCode
                    + "' and medication '" + medicationSystem + "|" + medicationCode + "'.");
            return statements;

        } catch (BaseServerResponseException e) {
            System.err.println("Error response from FHIR server while searching MedicationStatements: "
                    + e.getStatusCode() + " " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred while searching for MedicationStatements: " + e.getMessage());
        }

        return Collections.emptyList();
    }
}
