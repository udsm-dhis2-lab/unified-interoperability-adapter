package com.Adapter.icare.Services;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.SummaryEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.StringClientParam;
import com.Adapter.icare.ClientRegistry.Services.ClientRegistryService;
import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Constants.ClientRegistryConstants;
import com.Adapter.icare.Constants.FHIRConstants;
import com.Adapter.icare.Constants.SharedRecordsConstants;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Enums.*;
import com.Adapter.icare.Organisations.Dtos.OrganizationDTO;
import com.Adapter.icare.Utils.PrintOutHelper;
import com.google.common.collect.Iterables;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.Adapter.icare.SharedHealthRecords.Utilities.InvestigationDetailsUtils.getInvestigationDetailsFromObservationGroup;
import static com.Adapter.icare.SharedHealthRecords.Utilities.LabInvestigationDetailsUtils.getLabInvestigationDetailsFromDiagnosticReport;
import static com.Adapter.icare.SharedHealthRecords.Utilities.LabRequestDetailsUtils.getLabRequestDetailsBySpecimen;
import static com.Adapter.icare.SharedHealthRecords.Utilities.MedicationStatementUtils.getMedicationStatementsByCategoryAndCodeableConcept;
import static com.Adapter.icare.SharedHealthRecords.Utilities.medicationDispenseUtils.getMedicationDispensesById;
import static com.Adapter.icare.Utils.AllergyIntoleranceUtils.getAllergyTolerances;
import static com.Adapter.icare.Utils.CarePlanUtils.getCarePlansByCategory;
import static com.Adapter.icare.Utils.ChargeItemsUtils.getChargeItemsByEncounterId;
import static com.Adapter.icare.Utils.ChronicConditionsUtils.getConditionsByCategory;
import static com.Adapter.icare.Utils.ComponentUtils.*;
import static com.Adapter.icare.Utils.ComponentUtils.getComponentValueString;
import static com.Adapter.icare.Utils.DiagnosticReportUtils.getDiagnosticReportsByCategory;
import static com.Adapter.icare.Utils.ExtensionUtils.*;
import static com.Adapter.icare.Utils.ExtensionUtils.getNestedExtensionValueBoolean;
import static com.Adapter.icare.Utils.ObservationsUtils.*;
import static com.Adapter.icare.Utils.ObservationsUtils.getObservationsByCategory;
import static com.Adapter.icare.Utils.ProceduresUtils.getProceduresByCategoryAndObservationReference;
import static com.Adapter.icare.Utils.ServiceRequestUtils.getServiceRequestsByCategory;

@Service
public class LabDataTemplateService {
    private final IGenericClient fhirClient;
    private final FhirContext fhirContext;
    private final FHIRConstants fhirConstants;
    private final ClientRegistryConstants clientRegistryConstants;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;
    private final SharedRecordsConstants sharedRecordsConstants;
    private final ClientRegistryService clientRegistryService;
    private final MediatorsService mediatorsService;

    public LabDataTemplateService(FHIRConstants fhirConstants,
                                      UserService userService,
                                      ClientRegistryService clientRegistryService,
                                      MediatorsService mediatorsService,
                                      ClientRegistryConstants clientRegistryConstants,
                                      SharedRecordsConstants sharedRecordsConstants) {
        this.fhirConstants = fhirConstants;
        this.userService = userService;
        this.clientRegistryService = clientRegistryService;
        this.mediatorsService = mediatorsService;
        this.clientRegistryConstants = clientRegistryConstants;
        this.sharedRecordsConstants = sharedRecordsConstants;
        this.fhirContext = FhirContext.forR4();
        this.fhirClient = this.fhirContext.newRestfulGenericClient(fhirConstants.FHIRServerUrl);
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService
                    .getUserByUsername(((CustomUserDetails) authentication.getPrincipal())
                            .getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Map<String, Object> getLabRecordsWithPagination(Integer page,
                                                              Integer pageSize, String facilityCode, String specimenId) throws Exception {

        List<Map<String, Object>> labRecords = new ArrayList<>();
        Bundle response = new Bundle();
        Bundle specimensTotalBundle = new Bundle();
        var records = fhirClient.search().forResource(Specimen.class);
        records.sort().descending("_lastUpdated");

        records.where(Specimen.IDENTIFIER.exactly().systemAndCode("urn:sys:lab-request:specimen-id", ""));
        records.and(Specimen.SUBJECT.isMissing(true));

        System.out.println("FHIR SERVER: " + fhirConstants.FHIRServerUrl);

        response = records.count(pageSize).offset(page - 1).returnBundle(Bundle.class)
                .execute();

        if(response.hasEntry()){
            for(Bundle.BundleEntryComponent entry :  response.getEntry()){
                if (entry.getResource() instanceof Specimen){
                    Specimen specimen = (Specimen) entry.getResource();

                    LabRequestDetailsDTO labRequestDetailsDTO = getLabRequestDetailsBySpecimen(fhirClient, specimen);

                    if(labRequestDetailsDTO != null){
                        labRecords.add(labRequestDetailsDTO.toMap());
                    }
                }
            }
        }

        specimensTotalBundle = records.summaryMode(SummaryEnum.COUNT)
                .returnBundle(Bundle.class).execute();



        Map<String, Object> labRecordsResponse = new HashMap<>();
        labRecordsResponse.put("results", labRecords);
        Map<String, Object> pager = new HashMap<>();
        pager.put("total", specimensTotalBundle.getTotal());
        pager.put("totalPages", null);
        pager.put("page", page);
        pager.put("pageSize", pageSize);
        labRecordsResponse.put("pager", pager);
        return labRecordsResponse;
    }
}
