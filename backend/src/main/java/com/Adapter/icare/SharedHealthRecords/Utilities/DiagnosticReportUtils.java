package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.api.Constants;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.server.exceptions.BaseServerResponseException;
import ca.uhn.fhir.util.BundleUtil;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.DiagnosticReport;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DiagnosticReportUtils {
    public static List<DiagnosticReport> getDiagnosticReportsByCategory(IGenericClient fhirClient, String encounterId, String category)
            throws Exception {
        if (fhirClient == null
                || encounterId == null || encounterId.isBlank()
                || category == null || category.isBlank()) {
            System.err.println("FHIR client, Encounter ID, and Category must be provided.");
            return Collections.emptyList();
        }

        try {
            var diagnosticReportSearch = fhirClient.search().forResource(DiagnosticReport.class)
                    .where(DiagnosticReport.ENCOUNTER.hasAnyOfIds(encounterId))
                    .where(DiagnosticReport.CATEGORY.exactly().code(category));

            diagnosticReportSearch = diagnosticReportSearch.sort(new SortSpec(Constants.PARAM_LASTUPDATED)
                    .setOrder(SortOrderEnum.DESC));

            Bundle observationBundle = diagnosticReportSearch.returnBundle(Bundle.class).execute();
            List<DiagnosticReport> diagnosticReports = BundleUtil.toListOfResourcesOfType(
                    fhirClient.getFhirContext(),
                    observationBundle,
                    DiagnosticReport.class
            );

            System.out.println("Found " + diagnosticReports.size() + " DiagnosticReport(s) for encounter " + encounterId
                    + " and category '" + category + "' (sorted by lastUpdated descending).");

            return diagnosticReports;
        } catch (BaseServerResponseException e) {
            System.err.println("Error response from FHIR server while fetching DiagnosticReports: "
                    + e.getStatusCode() + " " + e.getMessage());
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("An error occurred while fetching Diagnostic Reports: " + e.getMessage());
            return Collections.emptyList();
        }

    }
}
