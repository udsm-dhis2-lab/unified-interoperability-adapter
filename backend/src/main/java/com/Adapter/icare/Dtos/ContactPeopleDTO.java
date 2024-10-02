package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContactPeopleDTO {
    private String name;
    private List<String> telecom;
    private String relationShip;

    public ContactPeopleDTO(String name, List<String> telecom, String relationShip) {
        this.name = name;
        this.telecom =  telecom;
        this.relationShip =  relationShip;
    }
}
