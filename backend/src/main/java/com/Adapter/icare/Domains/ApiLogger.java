package com.Adapter.icare.Domains;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "api_logger")
public class ApiLogger extends BaseEntity{
    public enum RequestType { POST, PUT }

    public enum TransactionType {
        CLIENT_REGISTRY,
        SHARED_HEALTH_RECORD,
        CLIENT_REGISTRY_SHARED_HEALTH_RECORD,
        REFERRAL
    }

    public enum ValidationIssue { YES, NO }

    public enum Status { SUCCESS, CONFLICT, ERROR }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="api_log_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 3)
    private ValidationIssue validationIssue;

    @Column(nullable = false)
    private Long numberOfRecords = 0L;

    @Column(nullable = false)
    private Long createdRecords = 0L;

    @Column(nullable = false)
    private Long updatedRecords = 0L;

    @Column(nullable = false)
    private Long failedRecords = 0L;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Status status;

    @Column(length = 10)
    private Integer statusCode;

    @Column(length = 50)
    private String systemCode;

    @Column(length = 100)
    private String systemName;

    @Column(length = 50)
    private String facilityCode;

    @Column(length = 100)
    private String facilityName;

    @Column(length = 100)
    private String referralNumber;

    @Column
    private LocalDate referralDate;

    @Column(length = 50)
    private String referredFacilityCode;

    @Column(length = 100)
    private String referredFacilityName;

    @Column
    private Boolean referredToOtherCountry;

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("uuid",                   getUuid());
        map.put("requestType",           requestType == null ? null : requestType.name());
        map.put("transactionType",       transactionType == null ? null : transactionType.name());
        map.put("validationIssue",       validationIssue == null ? null : validationIssue.name());
        map.put("numberOfRecords",       numberOfRecords == null ? null : numberOfRecords.toString());
        map.put("createdRecords",        createdRecords == null ? null : createdRecords.toString());
        map.put("updatedRecords",        updatedRecords == null ? null : updatedRecords.toString());
        map.put("failedRecords",         failedRecords == null ? null : failedRecords.toString());
        map.put("status",                status == null ? null : status.name());
        map.put("statusCode",            statusCode == null ? null : statusCode.toString());
        map.put("systemCode",            systemCode);
        map.put("systemName",            systemName);
        map.put("facilityCode",          facilityCode);
        map.put("facilityName",          facilityName);
        map.put("referralNumber",         referralNumber);
        map.put("referralDate",           referralDate == null ? null : referralDate.toString());
        map.put("referredFacilityCode",   referredFacilityCode);
        map.put("referredFacilityName",   referredFacilityName);
        map.put("referredToOtherCountry", referredToOtherCountry == null ? null : referredToOtherCountry.toString());
        return map;
    }

    public static ApiLogger fromMap(Map<String, String> map) {
        var log = new ApiLogger();
        if (map.get("id") != null) {
            log.setId(Long.valueOf(map.get("id")));
        }
        if (map.get("uuid") != null)               log.setId(Long.valueOf(map.get("uuid")));
        if (map.get("requestType") != null)      log.setRequestType(RequestType.valueOf(map.get("requestType")));
        if (map.get("transactionType") != null)  log.setTransactionType(TransactionType.valueOf(map.get("transactionType")));
        if (map.get("validationIssue") != null)  log.setValidationIssue(ValidationIssue.valueOf(map.get("validationIssue")));
        log.setNumberOfRecords(Long.valueOf(map.getOrDefault("numberOfRecords", "0")));
        log.setCreatedRecords(Long.valueOf(map.getOrDefault("createdRecords", "0")));
        log.setUpdatedRecords(Long.valueOf(map.getOrDefault("updatedRecords", "0")));
        log.setFailedRecords(Long.valueOf(map.getOrDefault("failedRecords", "0")));
        if (map.get("status") != null)           log.setStatus(Status.valueOf(map.get("status")));
        if (map.get("statusCode") != null) {
            log.setStatusCode(Integer.valueOf(map.get("statusCode")));
        }
        log.setSystemCode(map.get("systemCode"));
        log.setSystemName(map.get("systemName"));
        log.setFacilityCode(map.get("facilityCode"));
        log.setFacilityName(map.get("facilityName"));

        log.setReferralNumber      (map.get("referralNumber"));
        log.setReferredFacilityCode  (map.get("referredFacilityCode"));
        log.setReferredFacilityName  (map.get("referredFacilityName"));

        String rd = map.get("referralDate");
        if (rd != null && !rd.isBlank()) log.setReferralDate(java.time.LocalDate.parse(rd));

        String roc = map.get("referredToOtherCountry");
        if (roc != null) log.setReferredToOtherCountry(Boolean.valueOf(roc));
        return log;
    }

}
