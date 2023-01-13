package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DHISConstants {

    @Value("${DHIS_URL:https://play.dhis2.org/2.36.11.1}")
    public String DHIS2Instance;

    @Value("${DHIS_USERNAME:admin}")
    public String DHIS2Username; // = "dkibahila"

    @Value("${DHIS_PASSWORD:district}")
    public String DHIS2Password; // = "Jezzy@1234";

    @Value("${DHIS_OU:ImspTQPwCqd}")
    public String OrgUnit;//="Yc6Dt4UL6yl"(Chuo Kikuu Health Center); // = "a6eqFyAF1Rz"; // AAR TABATA Other Clinic
}
