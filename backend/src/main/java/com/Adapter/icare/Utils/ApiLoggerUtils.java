package com.Adapter.icare.Utils;

import com.Adapter.icare.Domains.ApiLogger;
import com.Adapter.icare.Domains.HfrFacility;
import com.Adapter.icare.Dtos.DataTemplateDTO;
import com.Adapter.icare.Dtos.ReferralDetailsDTO;
import com.Adapter.icare.Services.ApiLoggerService;
import com.Adapter.icare.Services.HfrFacilityService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;

import java.beans.Beans;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class ApiLoggerUtils {

    public static void saveApiLogger(
            ApiLoggerService apiLoggerService,
            DataTemplateDTO dataTemplate,
            Map<String, Object> workflowResponse,
            List<Map<String, Object>> recordsWithIssues,
            Integer responseCode,
            ApiLogger.RequestType requestType,
            HfrFacilityService hfrFacilityService
    ){
        ApiLogger apiLogger = new ApiLogger();
        apiLogger.setFacilityName(dataTemplate.getData() != null && dataTemplate.getData().getFacilityDetails() != null ? dataTemplate.getData().getFacilityDetails().getName() : null);
        apiLogger.setFacilityCode(dataTemplate.getData() != null && dataTemplate.getData().getFacilityDetails() != null ? dataTemplate.getData().getFacilityDetails().getCode() : null);

        String responseStatus = workflowResponse.containsKey("status") ? workflowResponse.get("status").toString().toUpperCase() : "ERROR";
        apiLogger.setStatus(ApiLogger.Status.valueOf(responseStatus));
        apiLogger.setStatusCode(responseCode != null ? responseCode : HttpStatus.OK.value());
        apiLogger.setRequestType(requestType);
        apiLogger.setSystemName(
                dataTemplate.getData() != null && dataTemplate.getData().getFacilityDetails() != null &&
                        dataTemplate.getData().getFacilityDetails().getSystem() != null ? dataTemplate.getData().getFacilityDetails().getSystem().getName() : null);

        var numberOfRecords = dataTemplate.getData() != null && dataTemplate.getData().getListGrid() != null ? dataTemplate.getData().getListGrid().size() : 0;
        var updatedRecords = workflowResponse.getOrDefault("updatedClients", 0);
        var failedRecords = recordsWithIssues.size() + (workflowResponse.containsKey("failedClients") ? Integer.parseInt(workflowResponse.get("failedClients").toString()) : 0);
        var ignoredRecords = workflowResponse.containsKey("ignoredClients") ? Integer.parseInt(workflowResponse.get("ignoredClients").toString()) : 0;
        var finalFailedValue = failedRecords + ignoredRecords;

        var createdRecords = workflowResponse.containsKey("newClients") ? Integer.parseInt(workflowResponse.get("newClients").toString()) : 0;
        apiLogger.setNumberOfRecords(Long.valueOf(String.valueOf(numberOfRecords)));
        apiLogger.setUpdatedRecords(Long.valueOf(String.valueOf(updatedRecords)));
        apiLogger.setFailedRecords(Long.valueOf(String.valueOf(finalFailedValue)));
        apiLogger.setCreatedRecords(Long.valueOf(String.valueOf(createdRecords)));
        apiLogger.setTransactionType(ApiLogger.TransactionType.CLIENT_REGISTRY_SHARED_HEALTH_RECORD);
        apiLogger.setValidationIssue(recordsWithIssues.isEmpty() ? ApiLogger.ValidationIssue.NO : ApiLogger.ValidationIssue.YES);
        apiLoggerService.addNewApiLog(apiLogger);

        if(numberOfRecords > 0){
            for(int i = 0; i < numberOfRecords; i++){
                if (dataTemplate.getData().getListGrid().get(i).getReferralDetails() != null){
                    ReferralDetailsDTO referralDetailsDTO = dataTemplate.getData().getListGrid().get(i).getReferralDetails();
                    ApiLogger referralApiLogger = new ApiLogger();
                    BeanUtils.copyProperties(apiLogger, referralApiLogger);
                    String referredFacilityName = null;
                    String referredFacilityCode = null;
                    String referralNumber = referralDetailsDTO.getReferralNumber();
                    LocalDate referralDate = LocalDate.ofInstant(referralDetailsDTO.getReferralDate().toInstant(), ZoneId.systemDefault());
                    Boolean referredToAnotherCountry = referralDetailsDTO.getReferredToOtherCountry();


                    if(referralDetailsDTO.getHfrCode() != null){
                        HfrFacility hfrFacility = hfrFacilityService.getHfrFacilityById(referralDetailsDTO.getHfrCode());
                        referredFacilityName = hfrFacility != null ? hfrFacility.getName() : null;
                        referredFacilityCode = referralDetailsDTO.getHfrCode();
                    }
                    referralApiLogger.setReferredFacilityName(referredFacilityName);
                    referralApiLogger.setReferredFacilityCode(referredFacilityCode);
                    referralApiLogger.setReferralNumber(referralNumber);
                    referralApiLogger.setReferralDate(referralDate);
                    referralApiLogger.setReferredToOtherCountry(referredToAnotherCountry);
                    referralApiLogger.setTransactionType(ApiLogger.TransactionType.REFERRAL);
                    apiLoggerService.addNewApiLog(referralApiLogger);
                }
            }
        }
    }
}
