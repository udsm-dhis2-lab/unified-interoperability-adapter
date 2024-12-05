package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContactPeopleDTO {
    private String firstName;
    private String lastName;
    private List<String> phoneNumbers;
    private String relationShip;

    public ContactPeopleDTO(String firstName, String lastName, List<String> phoneNumbers, String relationShip) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumbers =  phoneNumbers;
        this.relationShip =  relationShip;
    }
}
