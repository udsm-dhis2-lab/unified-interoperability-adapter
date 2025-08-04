package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class AncHivStatusDTO {
    private STATUS status;
    private Integer numberOfTestsTaken;

    public Map<String, Object> toMap(){
        Map<String, Object> ancHivStatus = new HashMap<>();
        ancHivStatus.put("status", this.getStatus() != null ? this.getStatus() : null);
        ancHivStatus.put("numberOfTestsTaken", this.getNumberOfTestsTaken());
        return ancHivStatus;
    }
}
