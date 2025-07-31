package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
public class LabObservationDTO {
    private String parameter;
    private Instant releaseDate;
    private CodeDTO resultStatus;
    private Integer obrSetId;
    private Integer obxSetId;
    private Integer obxSubId;
    private String result;
    private String codedValue;
    private ObservationDTO observation;
    private CodeDTO confirmedDiagnosis;
    private String abnormalFlagCode;
    private Instant dateTimeValue;
    private String resultSemiquantitive;
    private Boolean note;
    private Integer workUnitsInMinutes;
    private Float costUnits;
    private String valueType;
    private Boolean standardCode;
    private String unit;
    private Float lowRange;
    private Float highRange;
    private String remarks;

    public Map<String, Object> toMap(){
        Map<String, Object> labObservationMap = new HashMap<>();
        labObservationMap.put("parameter", this.getParameter());
        labObservationMap.put("releaseDate", this.getReleaseDate().toString());
        labObservationMap.put("resultStatus", this.getResultStatus());
        labObservationMap.put("obrSetId", this.getObrSetId());
        labObservationMap.put("obxSetId", this.getObxSetId());
        labObservationMap.put("obxSubId", this.getObxSubId());
        labObservationMap.put("result", this.getResult());
        labObservationMap.put("codedValue", this.getCodedValue());
        labObservationMap.put("observation", this.getObservation().toMap());
        labObservationMap.put("abnormalFlagCode", this.getAbnormalFlagCode());
        labObservationMap.put("dateTimeValue", this.getDateTimeValue().toString());
        labObservationMap.put("resultSemiquantitive", this.getResultSemiquantitive());
        labObservationMap.put("note", this.getNote());
        labObservationMap.put("workUnitsInMinutes", this.getWorkUnitsInMinutes());
        labObservationMap.put("costUnits", this.getCostUnits());
        labObservationMap.put("valueType", this.getValueType());
        labObservationMap.put("standardCode", this.getStandardCode());
        labObservationMap.put("unit", this.getUnit());
        labObservationMap.put("lowRange", this.getLowRange());
        labObservationMap.put("highRange", this.getHighRange());
        labObservationMap.put("remarks", this.getRemarks());

        return labObservationMap;
    }
}
