package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.util.BundleUtil;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.MedicationDispense;

import java.util.ArrayList;
import java.util.List;

public class medicationDispenseUtils {
    public static List<MedicationDispense> getMedicationDispensesById(IGenericClient fhirClient, String encounterId) throws Exception {
        var medicationDispenseSearch = fhirClient.search().forResource(MedicationDispense.class)
                .where(MedicationDispense.CONTEXT.hasAnyOfIds(encounterId));

        medicationDispenseSearch = medicationDispenseSearch.sort(new SortSpec(MedicationDispense.WHENPREPARED.getParamName())
                .setOrder(SortOrderEnum.DESC));

        Bundle medicationBundle = medicationDispenseSearch.returnBundle(Bundle.class).execute();
//        if (observationBundle.hasEntry()) {
//            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
//                MedicationDispense medicationDispense = (MedicationDispense) entryComponent
//                        .getResource();
//                medicationDispenses.add(medicationDispense);
//            }
//        }

        return BundleUtil.toListOfResourcesOfType(
                fhirClient.getFhirContext(),
                medicationBundle,
                MedicationDispense.class
        );
    }
}
