package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.api.Constants;
import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Condition;

import java.util.ArrayList;
import java.util.List;

public class ChronicConditionsUtils {
    public static List<Condition> getConditionsByCategory(IGenericClient fhirClient, String encounterId, String category) throws Exception {
        List<Condition> conditions = new ArrayList<>();
        var conditionSearch = fhirClient.search().forResource(Condition.class)
                .where(Condition.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(Condition.CATEGORY.exactly().code(category));

        conditionSearch.sort(new SortSpec(Constants.PARAM_LASTUPDATED)
                .setOrder(SortOrderEnum.DESC));

        Bundle observationBundle = new Bundle();
        observationBundle = conditionSearch.returnBundle(Bundle.class).execute();
        if (observationBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : observationBundle.getEntry()) {
                Condition condition = (Condition) entryComponent.getResource();
                conditions.add(condition);
            }
        }
        return conditions;
    }
}
