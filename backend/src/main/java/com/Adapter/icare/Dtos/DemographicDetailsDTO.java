package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DemographicDetailsDTO {
    private String mrn;
    private String id;
    private String firstName;
    private String middleName;
    private String lastName;
    private Date dateOfBirth;
    private String gender;
    private List<String> phoneNumbers;
    private List<String> emails;
    private String occupation;
    private String maritalStatus;
    private String nationality;
    private List<AddressDTO> addresses;
    private List<IdentifierDTO> identifiers;
    private List<ContactPeopleDTO> contactPeople;
    private List<PaymentDetailsDTO> paymentDetails;
    private List<Map<String,Object>> relatedClients;
}
