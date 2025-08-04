package com.Adapter.icare.Utils;

import ca.uhn.fhir.rest.api.Constants;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.util.BundleUtil;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Procedure;

import java.util.List;
import java.util.stream.Collectors;

public class ProceduresUtils {
    public static List<Procedure> getProceduresByCategoryAndObservationReference(IGenericClient fhirClient, String encounterId, String category,
                                                                                 String observationId) throws Exception {
        var procedureSearch = fhirClient.search().forResource(Procedure.class)
                .where(Procedure.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(Procedure.CATEGORY.exactly().code(category));

        procedureSearch = procedureSearch.sort(new SortSpec(Constants.PARAM_LASTUPDATED)
                .setOrder(SortOrderEnum.DESC));

        Bundle procedureBundle = procedureSearch.returnBundle(Bundle.class).execute();

        List<Procedure> procedures = BundleUtil.toListOfResourcesOfType(
                fhirClient.getFhirContext(),
                procedureBundle,
                Procedure.class
        );

        List<Procedure> finalProcedures;
        if (observationId != null && !observationId.isBlank()) {
            finalProcedures = procedures.stream()
                    .filter(procedure -> procedure.hasReasonReference() &&
                            procedure.getReasonReference().stream()
                                    .anyMatch(ref -> ("Observation/" + observationId).equals(ref.getReference())))
                    .collect(Collectors.toList());
        } else {
            finalProcedures = procedures;
        }

//        if (procedureBundle.hasEntry()) {
//            for (Bundle.BundleEntryComponent entryComponent : procedureBundle.getEntry()) {
//                Procedure procedure = (Procedure) entryComponent.getResource();
//                if (observationId != null) {
//                    if (procedure.hasReasonReference() && !procedure.getReasonReference().isEmpty()
//                            && procedure
//                            .getReasonReference().get(0).getReference()
//                            .equals("Observation/" + observationId)) {
//                        procedures.add(procedure);
//                    }
//                } else {
//                    procedures.add(procedure);
//                }
//            }
//        }
        return finalProcedures;
    }
}
