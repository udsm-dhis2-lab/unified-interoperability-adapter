package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Dtos.*;
import com.Adapter.icare.Enums.*;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.apache.bcel.classfile.Code;
import org.hl7.fhir.r4.model.*;
import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

@Slf4j
public class LabRequestDetailsUtils {

    public static LabRequestDetailsDTO getLabRequestDetailsBySpecimen(IGenericClient fhirClient, Specimen specimen){
        try {
            LabRequestDetailsDTO labRequestDetailsDTO = new LabRequestDetailsDTO();
            labRequestDetailsDTO.setDateOccurred(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/dateOccurred"));

            labRequestDetailsDTO.setSpecimenID(specimen.hasIdentifier() && !specimen.getIdentifier().isEmpty() && specimen.getIdentifier().get(0).hasValue() ? specimen.getIdentifier().get(0).getValue() : null);

            if(specimen.hasType() && specimen.getType().hasCoding()){
                CodeDTO typeOfSpecimenDTO = new CodeDTO();
                CodeDTO specimenSite = new CodeDTO();
                for(var coding: specimen.getType().getCoding()){
                    if(coding.hasSystem() && coding.getSystem().equals("http://fhir.moh.go.tz/fhir/lab-request/typeOfSpecimen")){
                        typeOfSpecimenDTO.setCode(coding.hasCode() ? coding.getCode() : null);
                        typeOfSpecimenDTO.setCodeType(coding.hasDisplay() ? coding.getDisplay() : null);
                    }
                    if(coding.hasSystem() && coding.getSystem().equals("http://fhir.moh.go.tz/fhir/lab-request/specimenSite")){
                        specimenSite.setCode(coding.hasCode() ? coding.getCode() : null);
                        specimenSite.setCodeType(coding.hasDisplay() ? coding.getDisplay() : null);
                    }
                }
                labRequestDetailsDTO.setTypeOfSpecimen(typeOfSpecimenDTO);
                labRequestDetailsDTO.setSpecimenSite(specimenSite);
            }

            labRequestDetailsDTO.setSpecimenCollectedFrom(SpecimentCollectedFrom.fromString(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/specimentCollectedFrom")));

            labRequestDetailsDTO.setSpecimenCollectionVolumeInMl(specimen.hasCollection() && specimen.getCollection().hasQuantity() && specimen.getCollection().getQuantity().hasValue() ? specimen.getCollection().getQuantity().getValue().intValue() : null);

            if(specimen.hasCollection() && specimen.getCollection().hasCollector() && specimen.getCollection().getCollector().hasReference()){
                String specimenCollectorReference = specimen.getCollection().getCollector().getReference();

                Practitioner specimenCollector = fhirClient.read()
                        .resource(Practitioner.class)
                        .withId(specimenCollectorReference)
                        .execute();

                if(specimenCollector != null){
                    labRequestDetailsDTO.setSpecimenCollectorName(specimenCollector.hasName() && !specimenCollector.getName().isEmpty() ? specimenCollector.getName().get(0).getText() : null);
                    if(specimenCollector.hasTelecom() && !specimenCollector.getTelecom().isEmpty()){
                        for (var telecom: specimenCollector.getTelecom()){
                            labRequestDetailsDTO.setSpecimenCollectorContactNumber(telecom.hasSystem() && telecom.getSystem().equals(ContactPoint.ContactPointSystem.PHONE) && telecom.hasValue()? telecom.getValue() : null);
                        }
                    }

                }

                if(specimen.hasCollection() && specimen.getCollection().hasCollectedDateTimeType()){
                    Date collectedDate = specimen.getCollection().getCollectedDateTimeType().getValue();
                    labRequestDetailsDTO.setDateTimeSpecimenCollected(collectedDate != null ? collectedDate.toInstant() : null);
                }
                labRequestDetailsDTO.setDateTimeSpecimenReceived(specimen.hasReceivedTime() ? specimen.getReceivedTime().toInstant() : null);
                labRequestDetailsDTO.setSpecimenSentToLab(getExtensionValueBoolean(specimen, "http://fhir.moh.go.tz/fhir/lab-request/specimenSentToLab"));

                Date dateSpecimenSentToLab = getExtensionValueDatetime(specimen, "http://fhir.moh.go.tz/fhir/lab-request/dateTimeSpecimenSentToLab");
                labRequestDetailsDTO.setDateTimeSpecimenSentToLab(dateSpecimenSentToLab != null ? dateSpecimenSentToLab.toInstant() : null);

                labRequestDetailsDTO.setSpecimenRegisteredBy(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/specimenRegisteredBy"));

                Date dateTimeSpecimenRegistered = getExtensionValueDatetime(specimen, "http://fhir.moh.go.tz/fhir/lab-request/dateTimeSpecimenRegistered");
                labRequestDetailsDTO.setDateTimeSpecimenRegistered(dateTimeSpecimenRegistered != null ? dateTimeSpecimenRegistered.toInstant() : null);


                labRequestDetailsDTO.setRequestTypeCode(RequestTypeCode.fromString(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/requestTypeCode")));

                labRequestDetailsDTO.setReferringSpecimenId(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/referringSpecimenId"));

                String clinicalCodes = getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/clinicalCodes");

                if(!clinicalCodes.isEmpty()){
                    labRequestDetailsDTO.setClinicalCodes(Arrays.stream(clinicalCodes.split("\\| ")).collect(Collectors.toList()));
                }

                labRequestDetailsDTO.setClinicalNotes(specimen.hasNote() && !specimen.getNote().isEmpty() && specimen.getNote().get(0).hasText() ? specimen.getNote().get(0).getText() : null);

                // Get Service Requests for requestedLabTests
                Bundle responseServiceRequests = fhirClient.search()
                        .forResource(ServiceRequest.class)
                        .where(ServiceRequest.SPECIMEN.hasId(specimen.getIdPart()))
                        .returnBundle(Bundle.class)
                        .execute();

                RequestingFacilityDTO requestingFacilityDTO = new RequestingFacilityDTO();
                List<LabTestsDTO> labTests = new ArrayList<LabTestsDTO>();
                for (Bundle.BundleEntryComponent entry : responseServiceRequests.getEntry()) {
                    if (entry.getResource() instanceof ServiceRequest) {
                        ServiceRequest serviceRequest = (ServiceRequest) entry.getResource();
                        if(labRequestDetailsDTO.getRequestingFacility() != null && labRequestDetailsDTO.getRequestingFacility().getCode() == null && serviceRequest.hasRequester() && serviceRequest.getRequester().hasReference()){
                            var requestingFacilityReference = serviceRequest.getRequester().getReference();

                            ServiceRequest requestingFacility = fhirClient.read()
                                    .resource(ServiceRequest.class)
                                    .withId(requestingFacilityReference)
                                    .execute();

                            requestingFacilityDTO.setCode(requestingFacility.getIdPart());
                        }

                        LabTestsDTO labTestDTO = getLabTestsFromSpecimenServiceRequest(serviceRequest);
                        if(labTestDTO != null){
                            labTests.add(labTestDTO);
                        }
                    }
                }
                labRequestDetailsDTO.setRequestedLabTests(labTests);


                requestingFacilityDTO.setCareType(CareType.fromString(getExtensionValueString(specimen, "http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/specimen-collection-careType")));

                labRequestDetailsDTO.setRequestingFacility(requestingFacilityDTO);

                // Get Observations for labTestResults
                Bundle responseLabResultsObservations = fhirClient.search()
                        .forResource(Observation.class)
                        .where(Observation.SPECIMEN.hasId(specimen.getIdPart()))
                        .returnBundle(Bundle.class)
                        .execute();

                List<LabTestResultsFinalDTO> labResults = new ArrayList<LabTestResultsFinalDTO>();
                for (Bundle.BundleEntryComponent entry : responseLabResultsObservations.getEntry()) {
                    if (entry.getResource() instanceof Observation) {
                        Observation observation = (Observation) entry.getResource();

                        LabTestResultsFinalDTO labTestResultsFinalDTO = getLabTestResultsFromObservation(fhirClient, observation);
                        if(labTestResultsFinalDTO != null){
                            labResults.add(labTestResultsFinalDTO);
                        }
                    }
                }

                labRequestDetailsDTO.setLabTestResults(labResults);

            }

            return labRequestDetailsDTO;

        } catch (Exception e){
            log.error("GET_SPECIMEN_LAB_TEMPLATE_ERROR: {}", e.getMessage());
            return null;
        }
    }

    private static LabTestsDTO getLabTestsFromSpecimenServiceRequest(ServiceRequest serviceRequest){
        LabTestsDTO labTest = new LabTestsDTO();

        if(serviceRequest != null){
            if(serviceRequest.hasIdentifier() && !serviceRequest.getIdentifier().isEmpty()){
                for(Identifier identifier: serviceRequest.getIdentifier()){
                    labTest.setObrSetId(identifier.hasSystem() && identifier.getSystem().equals("urn:sys:obr-set-id") && identifier.hasValue() ? Integer.parseInt(identifier.getValue()) : null);
                }
            }

            if(serviceRequest.hasPriority() && serviceRequest.getPriority() != null){
                ServiceRequest.ServiceRequestPriority priority = serviceRequest.getPriority();
                labTest.setPriority(Priority.fromString(priority.toCode()));
            }

            CodeDTO typeOfTestDTO = new CodeDTO();
            if(serviceRequest.hasCode() && serviceRequest.getCode().hasCoding() && !serviceRequest.getCode().getCoding().isEmpty()){
                for(Coding code: serviceRequest.getCode().getCoding()){
                    if(code.hasSystem() && code.getSystem().equals("http://fhir.moh.go.tz/fhir/lab-request/requested-lab-test/type-of-test/codeType")){
                        typeOfTestDTO.setCode(code.hasCode() ? code.getCode() : null);
                        typeOfTestDTO.setCodeType(code.hasDisplay() ? code.getDisplay() : null);
                    }
                }
            }
            labTest.setTypeOfTest(typeOfTestDTO);

            labTest.setRepeated(getExtensionValueInt(serviceRequest, "http://fhir.moh.go.tz/fhir/lab-request/requested-lab-test/repeated"));

            return labTest;
        }

        return null;
    }

    private static LabTestResultsFinalDTO getLabTestResultsFromObservation(IGenericClient fhirClient, Observation observation){
        LabTestResultsFinalDTO labTestResultsFinalDTO = new LabTestResultsFinalDTO();
        if(observation != null){
            labTestResultsFinalDTO.setSpecimenAcceptanceStatus(SpecimenAcceptanceStatus.fromString(getExtensionValueString(observation, "http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/specimenAcceptanceStatus")));

            List<CodeDTO> specimenRejectionCodesList = new ArrayList<CodeDTO>();
            CodeableConcept specimenRejectionConcept = getExtensionValueCodeableConcept(observation, "http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/specimenRejectionCodes");

            if(specimenRejectionConcept != null && specimenRejectionConcept.hasCoding() && !specimenRejectionConcept.getCoding().isEmpty()){
                for(Coding rejectionCode: specimenRejectionConcept.getCoding()){
                    CodeDTO specimenRejectionCode = new CodeDTO();
                    specimenRejectionCode.setCode(rejectionCode.hasCode() ? rejectionCode.getCode() : null);
                    specimenRejectionCode.setCodeType(rejectionCode.hasDisplay() ? rejectionCode.getDisplay() : null);
                    specimenRejectionCodesList.add(specimenRejectionCode);
                }
            }
            labTestResultsFinalDTO.setSpecimenRejectionCodes(specimenRejectionCodesList);

            if(observation.hasCode() && observation.getCode().hasCoding() && !observation.getCode().getCoding().isEmpty()){
                CodeDTO typeOftest = new CodeDTO();
                for(Coding code: observation.getCode().getCoding()){
                    if(code.hasSystem() && code.getSystem().equals("http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/typeOfTest")){
                        typeOftest.setCode(code.hasCode() ? code.getCode() : null);
                        typeOftest.setCodeType(code.hasDisplay() ? code.getDisplay() : null);
                    }
                }
                labTestResultsFinalDTO.setTypeOfTest(typeOftest);

            }

            Date testOrderDateExtension = getExtensionValueDatetime(observation, "http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/testOrderDate");
            labTestResultsFinalDTO.setTestOrderDate(testOrderDateExtension != null ? testOrderDateExtension.toInstant() : null);


            if(observation.hasIdentifier() && !observation.getIdentifier().isEmpty()){
                for(var identifier: observation.getIdentifier()){
                    if(identifier.hasSystem() && identifier.getSystem().equals("urn:sys:obr-set-id")){
                        labTestResultsFinalDTO.setObrSetId(identifier.hasValue() ? Integer.parseInt(identifier.getValue()) : null);
                    }
                }
            }

            if(observation.hasDevice() && observation.getDevice().hasReference()){
                var deviceReference = observation.getDevice().getReference();

                Device device = fhirClient.read()
                        .resource(Device.class)
                        .withId(deviceReference)
                        .execute();

                if(device != null){
                    if(device.hasIdentifier() && !device.getIdentifier().isEmpty()){
                        CodeDTO analyzerCode = new CodeDTO();
                        for(Identifier identifier: device.getIdentifier()){
                            if(identifier.hasSystem() && identifier.getSystem().equals("urn:sys:analyzer-code")){
                                analyzerCode.setCode(identifier.hasValue() ? identifier.getValue() : null);
                            }

                        }
                        analyzerCode.setCodeType(getExtensionValueString(device, "http://fhir.moh.go.tz/fhir/lab-request/lab-test-result/analyzer-code/codeType"));

                        labTestResultsFinalDTO.setAnalyzerCode(analyzerCode);
                    }
                }

                Date dateSpecimenAnalyzed = observation.getEffectiveDateTimeType().getValue();
                labTestResultsFinalDTO.setDateTimeSpecimenAnalyzed(dateSpecimenAnalyzed != null ? dateSpecimenAnalyzed.toInstant() : null);



            }



            return labTestResultsFinalDTO;
        }

        return null;
    }
}
