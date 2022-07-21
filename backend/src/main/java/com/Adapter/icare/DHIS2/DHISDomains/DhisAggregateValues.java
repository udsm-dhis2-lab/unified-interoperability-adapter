package com.Adapter.icare.DHIS2.DHISDomains;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DhisAggregateValues {
    
    private String datasetId;
    private String completeDate;
    private String period;
    private String orgUnitId;
    private String attributeOptionCombo;
    private List<DataValues> dataValues;

    public static DhisAggregateValues fromMap(Map<String, Object> DhisAggregateMap) {
        DhisAggregateValues newDhisAggregateValues = new DhisAggregateValues();
        newDhisAggregateValues.setDatasetId((String) DhisAggregateMap.get("dataSet"));
        newDhisAggregateValues.setCompleteDate((String) DhisAggregateMap.get("completeDate"));
        newDhisAggregateValues.setPeriod((String) DhisAggregateMap.get("period"));
        newDhisAggregateValues.setOrgUnitId((String) DhisAggregateMap.get("orgUnit"));
        newDhisAggregateValues.setAttributeOptionCombo((String) DhisAggregateMap.get("attributeOptionCombo"));
        newDhisAggregateValues.setDataValues((List<DataValues>) DhisAggregateMap.get("dataValues"));
        return newDhisAggregateValues;
    }

    public Map<String, Object> toMap() {
        HashMap<String, Object> newDhisAggregateValuesMap = (new HashMap<String, Object>());
        newDhisAggregateValuesMap.put("dataSet", this.datasetId);
        newDhisAggregateValuesMap.put("completeDate", this.completeDate);
        newDhisAggregateValuesMap.put("period", this.period);
        newDhisAggregateValuesMap.put("orgUnit", this.orgUnitId);
        newDhisAggregateValuesMap.put("attributeOptionCombo", this.attributeOptionCombo);
        newDhisAggregateValuesMap.put("dataValues", this.dataValues);
        return newDhisAggregateValuesMap;
    }

}
