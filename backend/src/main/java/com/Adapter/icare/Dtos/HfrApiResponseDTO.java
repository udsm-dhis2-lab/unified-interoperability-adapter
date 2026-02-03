package com.Adapter.icare.Dtos;

import com.Adapter.icare.Domains.HfrFacility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HfrApiResponseDTO {
    private List<HfrFacility> data;
    private HfrMetaData metaData;
}

