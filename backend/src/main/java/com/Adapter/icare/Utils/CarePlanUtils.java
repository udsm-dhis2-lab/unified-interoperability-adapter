package com.Adapter.icare.Utils;

import ca.uhn.fhir.rest.api.SortOrderEnum;
import ca.uhn.fhir.rest.api.SortSpec;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.CarePlan;
import org.hl7.fhir.r4.model.Observation;

import java.util.ArrayList;
import java.util.List;

public class CarePlanUtils {
    public static List<CarePlan> getCarePlansByCategory(IGenericClient fhirClient, String encounterId, String category) throws Exception {
        List<CarePlan> carePlans = new ArrayList<>();
        var carePlanSearch = fhirClient.search().forResource(CarePlan.class)
                .where(CarePlan.ENCOUNTER.hasAnyOfIds(encounterId))
                .where(CarePlan.CATEGORY.exactly().code(category));

        carePlanSearch.sort(new SortSpec(CarePlan.DATE.getParamName())
                .setOrder(SortOrderEnum.DESC));

        Bundle carePlanBundle = carePlanSearch.returnBundle(Bundle.class).execute();
        if (carePlanBundle.hasEntry()) {
            for (Bundle.BundleEntryComponent entryComponent : carePlanBundle.getEntry()) {
                CarePlan carePlan = (CarePlan) entryComponent.getResource();
                carePlans.add(carePlan);
            }
        }
        return carePlans;
    }
}
