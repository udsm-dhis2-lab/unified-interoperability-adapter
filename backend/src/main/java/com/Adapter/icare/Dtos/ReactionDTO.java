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
public class ReactionDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date reactionDate;
    private String notes;
    private Boolean reported;

    public Map<String, Object> toMap(){
        HashMap<String, Object> reaction = new LinkedHashMap<>();
        reaction.put("reactionDate", this.getReactionDate());
        reaction.put("notes", this.getNotes());
        reaction.put("reported", this.getReported());
        return reaction;
    }
}
