package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.DiagnosticReport;

import java.util.ArrayList;
import java.util.List;

public class DiagnosticReportUtils {
    public static List<DiagnosticReport> getDiagnosticReportsByCategory(IGenericClient fhirClient, String encounterId, String category)
            throws Exception {
        List<DiagnosticReport> diagnosticReports = new ArrayList<>();
        var diagnosticReportSearch = fhirClient.search().forResource(DiagnosticReport.class)
                .where(DiagnosticReport.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(DiagnosticReport.CATEGORY.exactly().code(category));

        Bundle observationBundle;
        observationBundle = diagnosticReportSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                DiagnosticReport diagnosticReport = (DiagnosticReport) entryComponent.getResource();
                diagnosticReports.add(diagnosticReport);
            }
        }
        return diagnosticReports;
    }
}
