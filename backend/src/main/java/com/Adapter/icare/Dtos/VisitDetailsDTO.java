package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class VisitDetailsDTO {
    @NotNull
    private String id;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date visitDate;
    private Boolean newThisYear;
    private Boolean isNew;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date closedDate;
    private String visitType;
    private List<CareServiceDTO> careServices;
    private List<AttendedSpecialistDTO> attendedSpecialist;
    private ServiceComplaintsDTO serviceComplaints;

    private Boolean referredIn;
    private Boolean disabled;

    public Map<String,Object> toMap() {
        Map<String,Object> visitDetails = new HashMap<>();
        visitDetails.put("id", this.getId());
        visitDetails.put("visitDate", this.getVisitDate());
        visitDetails.put("closedDate", this.getClosedDate());
        visitDetails.put("visitType", this.getVisitType());
        visitDetails.put("newThisYear", this.newThisYear);
        visitDetails.put("isNew", this.isNew);
        visitDetails.put("careServices", this.getCareServices().stream().map(careService -> careService.toMap()));
        visitDetails.put("attendedSpecialists", this.getAttendedSpecialist().stream().map(attendedSpecialist -> attendedSpecialist.toMap()));
        visitDetails.put("serviceComplaints", this.getServiceComplaints().toMap());
        return visitDetails;
    }
}
