package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.AllergyIntolerance;
import org.hl7.fhir.r4.model.Bundle;

import java.util.ArrayList;
import java.util.List;

public class AllergyIntoleranceUtils {
    public static List<AllergyIntolerance> getAllergyTolerances(IGenericClient fhirClient, String patientId) throws Exception {
        List<AllergyIntolerance> allergyIntolerances = new ArrayList<>();
        var allergySearch = fhirClient.search().forResource(AllergyIntolerance.class)
                .where(AllergyIntolerance.PATIENT.hasAnyOfIds(patientId));

        Bundle observationBundle = new Bundle();
        observationBundle = allergySearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                AllergyIntolerance allergyIntolerance = (AllergyIntolerance) entryComponent
                        .getResource();
                allergyIntolerances.add(allergyIntolerance);
            }
        }
        return allergyIntolerances;
    }

}
