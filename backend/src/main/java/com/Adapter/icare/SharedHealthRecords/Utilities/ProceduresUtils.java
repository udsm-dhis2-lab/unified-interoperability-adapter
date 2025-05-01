package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Procedure;

import java.util.ArrayList;
import java.util.List;

public class ProceduresUtils {
    public static List<Procedure> getProceduresByCategoryAndObservationReference(IGenericClient fhirClient, String encounterId, String category,
                                                                                 String observationId) throws Exception {
        List<Procedure> procedures = new ArrayList<>();
        var procedureSearch = fhirClient.search().forResource(Procedure.class)
                .where(Procedure.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(Procedure.CATEGORY.exactly().code(category));

        Bundle observationBundle;
        observationBundle = procedureSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Procedure procedure = (Procedure) entryComponent.getResource();
                if (observationId != null) {
                    if (procedure.hasReasonReference() && !procedure.getReasonReference().isEmpty()
                            && procedure
                            .getReasonReference().get(0).getReference()
                            .equals("Observation/" + observationId)) {
                        procedures.add(procedure);
                    }
                } else {
                    procedures.add(procedure);
                }
            }
        }
        return procedures;
    }
}
