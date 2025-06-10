package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Dtos.InvestigationDetailsDTO;
import com.Adapter.icare.Enums.SpecimenAcceptanceStatus;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Observation;

import java.util.List;

import static com.Adapter.icare.SharedHealthRecords.Utilities.ObservationsUtils.getObservationsByCategoryAndCode;
import static com.Adapter.icare.SharedHealthRecords.Utilities.ObservationsUtils.getObservationsByObservationGroupId;

public class InvestigationDetailsUtils {

    public static InvestigationDetailsDTO getInvestigationDetailsFromObservationGroup(IGenericClient fhirClient, Encounter encounter, Observation observationGroup, FhirContext fhirContext) throws Exception {
        InvestigationDetailsDTO investigationDetailsDTO = new InvestigationDetailsDTO();

        List<Observation> caseClassificationData = getObservationsByObservationGroupId(
                fhirClient,
                "case-classification",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!caseClassificationData.isEmpty()) {
            for (Observation observation : caseClassificationData) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setCaseClassification(
                                    observation.getValueStringType()
                                            .toString());
                    break;
                }
            }
        }
        investigationDetailsDTO
                .setDateOccurred(
                        observationGroup.hasEffectiveDateTimeType()
                                ? observationGroup
                                .getEffectiveDateTimeType()
                                .getValue()
                                : null);

        List<Observation> daysSinceSymptomsData = getObservationsByCategoryAndCode(
                fhirClient,
                fhirContext,
                encounter,
                "days-since-symptoms",
                null);

        if (!daysSinceSymptomsData.isEmpty()) {
            for (Observation observation : daysSinceSymptomsData) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setDaysSinceSymptoms(
                                    Integer.valueOf(observation.getValueStringType()
                                            .getValue())
                            );
                    break;
                }
            }
        }

        List<Observation> diseaseCodeData = getObservationsByObservationGroupId(
                fhirClient,
                "disease-code",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!diseaseCodeData.isEmpty()) {
            for (Observation observation : diseaseCodeData) {
                if (observation.hasValueCodeableConcept()) {
                    investigationDetailsDTO
                            .setDiseaseCode(observation
                                    .getValueCodeableConcept()
                                    .getCoding()
                                    .get(0)
                                    .getCode());
                    break;
                }
            }
        }
        List<Observation> labSpecimenTakenData = getObservationsByObservationGroupId(
                fhirClient,
                "lab-specimen-taken",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!labSpecimenTakenData.isEmpty()) {
            for (Observation observation : labSpecimenTakenData) {
                if (observation.hasValueBooleanType()) {
                    investigationDetailsDTO
                            .setLabSpecimenTaken(
                                    observation.hasValueBooleanType() && observation.getValueBooleanType().hasValue() ? observation.getValueBooleanType().getValue() : null);
                    break;
                }
            }
        }
        List<Observation> specimenSentToData = getObservationsByObservationGroupId(
                fhirClient,
                "specimen-sent-to-lab",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());

        if (!specimenSentToData.isEmpty()) {
            for (Observation observation : specimenSentToData) {
                if (observation.hasValueBooleanType()) {
                    investigationDetailsDTO
                            .setSpecimenSentToLab(
                                    observation.hasValueBooleanType() && observation.getValueBooleanType().hasValue() ? observation.getValueBooleanType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenCollected = getObservationsByObservationGroupId(
                fhirClient,
                "specimen-collected",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenCollected.isEmpty()) {
            for (Observation observation : specimenCollected) {
                if (observation.hasValueBooleanType()) {
                    investigationDetailsDTO
                            .setSpecimenCollected(
                                    observation.hasValueBooleanType() && observation.getValueBooleanType().hasValue() ? observation.getValueBooleanType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> dateSpecimenCollected = getObservationsByObservationGroupId(
                fhirClient,
                "date-specimen-collected",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!dateSpecimenCollected.isEmpty()) {
            for (Observation observation : dateSpecimenCollected) {
                if (observation.hasValueDateTimeType()) {
                    investigationDetailsDTO
                            .setDateSpecimenCollected(
                                    observation.hasValueDateTimeType() && observation.getValueDateTimeType().hasValue() ? observation.getValueDateTimeType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> dateSpecimenSentToLab = getObservationsByObservationGroupId(
                fhirClient,
                "date-specimen-sent-to-lab",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!dateSpecimenSentToLab.isEmpty()) {
            for (Observation observation : dateSpecimenSentToLab) {
                if (observation.hasValueDateTimeType()) {
                    investigationDetailsDTO
                            .setDateSpecimenSentToLab(
                                    observation.hasValueDateTimeType() && observation.getValueDateTimeType().hasValue() ? observation.getValueDateTimeType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenCollectedFrom = getObservationsByObservationGroupId(
                fhirClient,
                "specimen-collected-from",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenCollectedFrom.isEmpty()) {
            for (Observation observation : specimenCollectedFrom) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setSpecimenCollectedFrom(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenID = getObservationsByObservationGroupId(
                fhirClient,
                "specimen-id",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenID.isEmpty()) {
            for (Observation observation : specimenID) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setSpecimenID(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> typeOfSpecimen = getObservationsByObservationGroupId(
                fhirClient,
                "type-of-Specimen",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!typeOfSpecimen.isEmpty()) {
            for (Observation observation : typeOfSpecimen) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setTypeOfSpecimen(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> laboratoryName = getObservationsByObservationGroupId(
                fhirClient,
                "laboratoryName",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!laboratoryName.isEmpty()) {
            for (Observation observation : laboratoryName) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setLaboratoryName(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> typeOfTest = getObservationsByObservationGroupId(
                fhirClient,
                "typeOfTest",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!typeOfTest.isEmpty()) {
            for (Observation observation : typeOfTest) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setTypeOfTest(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue() : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenAcceptanceStatus = getObservationsByObservationGroupId(
                fhirClient,
                "specimenAcceptanceStatus",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenAcceptanceStatus.isEmpty()) {
            for (Observation observation : specimenAcceptanceStatus) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setSpecimenAcceptanceStatus(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? SpecimenAcceptanceStatus.fromString(observation.getValueStringType().getValue())  : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenCollectorName = getObservationsByObservationGroupId(
                fhirClient,
                "specimenCollectorName",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenCollectorName.isEmpty()) {
            for (Observation observation : specimenCollectorName) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setSpecimenCollectorName(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue()  : null
                            );
                    break;
                }
            }
        }

        List<Observation> specimenCollectorContactNumber = getObservationsByObservationGroupId(
                fhirClient,
                "specimenCollectorContactNumber",
                encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!specimenCollectorContactNumber.isEmpty()) {
            for (Observation observation : specimenCollectorContactNumber) {
                if (observation.hasValueStringType()) {
                    investigationDetailsDTO
                            .setSpecimenCollectorContactNumber(
                                    observation.hasValueStringType() && observation.getValueStringType().hasValue() ? observation.getValueStringType().getValue()  : null
                            );
                    break;
                }
            }
        }

        List<Observation> vaccinatedData = getObservationsByObservationGroupId(
                fhirClient,
                "vaccinated", encounter,
                observationGroup.getIdElement()
                        .getIdPart());
        if (!vaccinatedData.isEmpty()) {
            for (Observation observation : vaccinatedData) {
                if (observation.hasValueBooleanType()) {
                    investigationDetailsDTO
                            .setVaccinated(
                                    observation.hasValueBooleanType() && observation.getValueBooleanType().hasValue() ? observation.getValueBooleanType().getValue() : null
                            );
                    break;
                }
            }
        }

        return investigationDetailsDTO;
    }
}
