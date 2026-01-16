package com.Adapter.icare.Conveters;

import com.Adapter.icare.Domains.ApiLogger;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import static com.Adapter.icare.Domains.ApiLogger.TransactionType.*;

@Converter(autoApply = true)
public class TransactionTypeConverter implements AttributeConverter<ApiLogger.TransactionType, String> {

    @Override
    public String convertToDatabaseColumn(ApiLogger.TransactionType transactionType) {
        if (transactionType == null) return null;
        switch (transactionType) {
            case CLIENT_REGISTRY:                     return "Client Registry";
            case SHARED_HEALTH_RECORD:              return "Shared Health Record";
            case CLIENT_REGISTRY_SHARED_HEALTH_RECORD: return "Client Registry-Shared Health Record";
            case REFERRAL:                          return "Referral";
            default: throw new IllegalArgumentException("Unexpected enum " + transactionType);
        }
    }

    @Override
    public ApiLogger.TransactionType convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        switch (dbData) {
            case "Client Registry":                     return ApiLogger.TransactionType.CLIENT_REGISTRY;
            case "Shared Health Record":                return ApiLogger.TransactionType.SHARED_HEALTH_RECORD;
            case "Client Registry-Shared Health Record": return CLIENT_REGISTRY_SHARED_HEALTH_RECORD;
            case "Referral":                            return ApiLogger.TransactionType.REFERRAL;
            default: throw new IllegalArgumentException("Unknown DB value " + dbData);
        }
    }
}