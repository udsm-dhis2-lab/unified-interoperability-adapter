package com.Adapter.icare.SharedHealthRecords.Utilities;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.Adapter.icare.Dtos.LabInvestigationDetailsDTO;
import com.Adapter.icare.Dtos.LabTestResultsDTO;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.DiagnosticReport;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Reference;

import java.util.ArrayList;
import java.util.List;

import static com.Adapter.icare.Utils.ExtensionUtils.getNestedExtensionValueBoolean;
import static com.Adapter.icare.Utils.ExtensionUtils.getNestedExtensionValueString;

public class LabInvestigationDetailsUtils {
    public static LabInvestigationDetailsDTO getLabInvestigationDetailsFromDiagnosticReport (IGenericClient fhirClient, DiagnosticReport diagnosticReport){
        LabInvestigationDetailsDTO labInvestigationDetailsDTO = new LabInvestigationDetailsDTO();
        labInvestigationDetailsDTO.setTestCode(
                diagnosticReport.hasCode()
                        &&
                        diagnosticReport.getCode()
                                .hasCoding()
                        &&
                        !diagnosticReport
                                .getCode()
                                .getCoding()
                                .isEmpty()
                        ? diagnosticReport
                        .getCode()
                        .getCoding()
                        .get(0)
                        .getCode()
                        : null);

        labInvestigationDetailsDTO
                .setTestResultDate(
                        diagnosticReport.hasEffectiveDateTimeType()
                                && diagnosticReport
                                .getEffectiveDateTimeType()
                                .hasValue()
                                ? diagnosticReport
                                .getEffectiveDateTimeType()
                                .getValue()
                                : null);
        labInvestigationDetailsDTO
                .setTestStatus(getNestedExtensionValueString(
                        diagnosticReport,
                        "http://fhir.moh.go.tz/fhir/StructureDefinition/diagonostic-report-results",
                        "testStatus"));

        List<Identifier> identifiers = diagnosticReport
                .getIdentifier();
        for (Identifier reportIdentifier : identifiers) {
            if (reportIdentifier.hasValue()
                    && reportIdentifier
                    .hasType()
                    && reportIdentifier
                    .getType()
                    .hasCoding()
                    && !reportIdentifier
                    .getType()
                    .getCoding()
                    .isEmpty()) {
                if (reportIdentifier
                        .getType()
                        .getCoding()
                        .get(0)
                        .getCode()
                        .equals("TEST-ORDER")) {
                    labInvestigationDetailsDTO
                            .setTestOrderId(reportIdentifier
                                    .getValue());
                } else if (reportIdentifier
                        .getType()
                        .getCoding()
                        .get(0)
                        .getCode()
                        .equals("SAMPLE-ID")) {
                    labInvestigationDetailsDTO
                            .setTestSampleId(
                                    reportIdentifier.getValue());
                }
            }
        }
        labInvestigationDetailsDTO
                .setTestOrderDate(
                        diagnosticReport.hasEffectiveDateTimeType()
                                ? diagnosticReport
                                .getEffectiveDateTimeType()
                                .getValue()
                                : null);

        labInvestigationDetailsDTO.setTestType(
                diagnosticReport.hasCode()
                        &&
                        diagnosticReport.getCode()
                                .hasCoding()
                        &&
                        !diagnosticReport
                                .getCode()
                                .getCoding()
                                .isEmpty()
                        ? diagnosticReport
                        .getCode()
                        .getCoding()
                        .get(0)
                        .getDisplay()
                        : null);

        labInvestigationDetailsDTO
                .setStandardCode(
                        getNestedExtensionValueBoolean(
                                diagnosticReport,
                                "http://fhir.moh.go.tz/fhir/StructureDefinition/diagonostic-report-results",
                                "standardCode"));
        labInvestigationDetailsDTO.setCodeType(
                diagnosticReport.hasCode()
                        &&
                        diagnosticReport.getCode()
                                .hasCoding()
                        &&
                        !diagnosticReport
                                .getCode()
                                .getCoding()
                                .isEmpty()
                        && diagnosticReport
                        .getCode()
                        .getCoding()
                        .get(0)
                        .getSystem()
                        .contains("loinc")
                        ? "LOINC"
                        : null);

        List<LabTestResultsDTO> labTestResultsDTOS = new ArrayList<>();
        if (diagnosticReport.hasResult()) {
            for (Reference reference : diagnosticReport
                    .getResult()) {
                LabTestResultsDTO labTestResultsDTO = new LabTestResultsDTO();
                IIdType obsReference = reference
                        .getReferenceElement();
                if (obsReference.getResourceType()
                        .equals("Observation")) {
                    Observation observation = fhirClient
                            .read()
                            .resource(Observation.class)
                            .withId(obsReference
                                    .getIdPart())
                            .execute();
                    labTestResultsDTO
                            .setStandardCode(
                                    getNestedExtensionValueBoolean(
                                            observation,
                                            "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                            "standardCode"));
//                    labTestResultsDTO
//                            .setReleaseDate(observation
//                                    .hasEffectiveDateTimeType()
//                                    ? observation.getEffectiveDateTimeType()
//                                    .getValue()
//                                    : null);
                    labTestResultsDTO
                            .setValueType(observation
                                    .hasValueStringType()
                                    ? "TEXT"
                                    : observation.hasValueQuantity()
                                    ? "NUMERIC"
                                    : observation.hasValueCodeableConcept()
                                    ? "CODED"
                                    : null);

                    labTestResultsDTO
                            .setResult(
                                    observation.hasInterpretation()
                                            && !observation.getInterpretation()
                                            .isEmpty()
                                            ? observation.getInterpretationFirstRep()
                                            .getText()
                                            : observation.hasValueStringType()
                                            ? observation.getValueStringType()
                                            .getValue()
                                            : observation.hasValueQuantity()
                                            ? String.valueOf(
                                            observation
                                                    .getValueQuantity()
                                                    .getValue())
                                            : observation
                                            .hasValueCodeableConcept()
                                            ? observation
                                            .getValueCodeableConcept()
                                            .getText()
                                            : null);

                    labTestResultsDTO
                            .setCodedValue(
                                    observation.hasCode()
                                            && observation.getCode()
                                            .hasText()
                                            ? observation.getCode()
                                            .getText()
                                            : null);
                    labTestResultsDTO
                            .setHighRange(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "highRange"));
                    labTestResultsDTO
                            .setLowRange(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "lowRange"));
                    labTestResultsDTO
                            .setRemarks(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "remarks"));
                    labTestResultsDTO
                            .setCodeType(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "codeType"));
                    labTestResultsDTO
                            .setParameter(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "parameter"));
                    labTestResultsDTO
                            .setUnit(getNestedExtensionValueString(
                                    observation,
                                    "http://fhir.moh.go.tz/fhir/StructureDefinition/laboratory-results",
                                    "unit"));
                }
                labTestResultsDTOS.add(
                        labTestResultsDTO);
            }
        }
        labInvestigationDetailsDTO
                .setTestResults(labTestResultsDTOS);
        return labInvestigationDetailsDTO;
    }
}
