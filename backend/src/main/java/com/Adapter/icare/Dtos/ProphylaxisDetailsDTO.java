package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class ProphylaxisDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String date;
    private String code;
    private String type;
    private String name;
    private String status;
    private String notes;
    private ReactionDTO reaction;


    public Map<String, Object> toMap(){
        HashMap<String, Object> prophylaxisDetails = new LinkedHashMap<>();
        prophylaxisDetails.put("date", this.getDate());
        prophylaxisDetails.put("code", this.getCode());
        prophylaxisDetails.put("type", this.getType());
        prophylaxisDetails.put("name", this.getName());
        prophylaxisDetails.put("status", this.getStatus());
        prophylaxisDetails.put("notes", this.getNotes());
        prophylaxisDetails.put("reaction", this.getReaction().toMap());
        return prophylaxisDetails;
    }
}
