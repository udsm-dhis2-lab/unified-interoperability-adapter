package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MotherHivStatusDTO {
    private STATUS status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date testingDate;
}
