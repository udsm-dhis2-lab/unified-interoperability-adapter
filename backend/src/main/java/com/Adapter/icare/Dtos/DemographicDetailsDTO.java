package com.Adapter.icare.Dtos;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DemographicDetailsDTO {
    private String id;
    @NotBlank(message = "firstName cannot be blank")
    private String firstName;
    private String middleName;
    @NotBlank(message = "lastName cannot be blank")
    private String lastName;
    @NotNull(message = "Date of birth can not be null")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String dateOfBirth;
    @NotBlank(message = "Gender can not be null")
    private String gender;
    private List<String> phoneNumbers;
    private List<String> emails;
    private String occupation;
    private String maritalStatus;
    private String nationality;
    private List<AddressDTO> addresses;
    @NotNull(message = "Identifiers list cannot be null")
    @NotEmpty(message = "At least one identifier must be provided")
    private List<@Valid IdentifierDTO> identifiers;
    private List<ContactPeopleDTO> contactPeople;
    private List<PaymentDetailsDTO> paymentDetails;
    private List<Map<String, Object>> relatedClients;
    private List<FileDTO> files;
    private List<AppointmentDetailsDTO> appointment;

    public Map<String, Object> toMap() {
        Map<String, Object> demographicDetails = new LinkedHashMap<>();
        demographicDetails.put("id", this.getId());
        demographicDetails.put("firstName", this.getFirstName());
        demographicDetails.put("middleName", this.getMiddleName());
        demographicDetails.put("lastName", this.getLastName());
        demographicDetails.put("dateOfBirth", this.getDateOfBirth());
        demographicDetails.put("gender", this.getGender());
        demographicDetails.put("phoneNumbers", this.getPhoneNumbers());
        demographicDetails.put("emails", this.getEmails());
        demographicDetails.put("occupation", this.getOccupation());
        demographicDetails.put("maritalStatus", this.getMaritalStatus());
        demographicDetails.put("nationality", this.getNationality());
        demographicDetails.put("addresses", this.getAddresses().stream().map(address -> address.toMap()));
        if (this.getIdentifiers() != null) {
            demographicDetails.put("identifiers", this.getIdentifiers().stream().map(identifier -> identifier.toMap()));
        }
        demographicDetails.put("contactPeople", this.getContactPeople());
        demographicDetails.put("paymentDetails", this.getPaymentDetails());
        demographicDetails.put("relatedClients", this.getRelatedClients());
        demographicDetails.put("appointment", this.getAppointment());
        if (this.getFiles() != null) {
            demographicDetails.put("files", this.getFiles().stream().map(file -> file.toMap()));
        } else {
            demographicDetails.put("files", new ArrayList<>());
        }
        return demographicDetails;
    }
}
