package com.Adapter.icare.Dtos;

import com.Adapter.icare.Utils.CervicalCancerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CancerScreeningDetailsDTO {
    private BreastCancerDTO breastCancer;

    @JsonDeserialize(using = CervicalCancerDeserializer.class)
    private ParentCervicalCancerDTO cervicalCancer;
}
