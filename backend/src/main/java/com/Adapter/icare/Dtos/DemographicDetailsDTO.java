package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
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
    @NotNull(message = "Date of birth can not be null")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    @NotNull(message = "Gender can not be null")
    private String gender;
    private List<String> phoneNumbers;
    private List<String> emails;
    private String occupation;
    private String maritalStatus;
    private String nationality;
    private List<AddressDTO> addresses;
    @NotNull(message = "Identifiers can not be null")
    private List<IdentifierDTO> identifiers;
    private List<ContactPeopleDTO> contactPeople;
    private List<PaymentDetailsDTO> paymentDetails;
    private List<Map<String,Object>> relatedClients;
}
