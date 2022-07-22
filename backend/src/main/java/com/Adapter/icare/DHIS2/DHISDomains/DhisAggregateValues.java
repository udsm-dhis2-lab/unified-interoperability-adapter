package com.Adapter.icare.DHIS2.DHISDomains;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DhisAggregateValues {
    
    private String dataSet;
    private String completeDate;
    private String period;
    private String orgUnit;
    private String attributeOptionCombo;
    private List<DataValues> dataValues;

}
