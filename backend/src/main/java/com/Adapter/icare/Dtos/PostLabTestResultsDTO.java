package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class PostLabTestResultsDTO {
    private Integer obrSetId;
    private String typeOfTest;
    private Instant dateTimeResultsReceivedAtFacility;
    private Instant dateTimeResultsprovidedToClient;

    public Map<String, Object> toMap(){
        Map<String, Object> postLabTestResultsMap = new HashMap<>();
        postLabTestResultsMap.put("obrSetId", this.getObrSetId() != null ? this.getObrSetId().toString() : null);
        postLabTestResultsMap.put("typeOfTest", this.getTypeOfTest());
        postLabTestResultsMap.put("dateTimeResultsReceivedAtFacility", this.getDateTimeResultsprovidedToClient() != null ? this.getDateTimeResultsReceivedAtFacility().toString() : null);
        postLabTestResultsMap.put("dateTimeResultsprovidedToClient", this.getDateTimeResultsprovidedToClient() != null ? this.getDateTimeResultsprovidedToClient().toString() : null);
        return postLabTestResultsMap;
    }
}
