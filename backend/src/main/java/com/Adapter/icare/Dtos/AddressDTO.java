package com.Adapter.icare.Dtos;

import java.util.List;

public class AddressDTO {
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private List<String> line;

    public AddressDTO() {}

    public AddressDTO(String city, String state, String postalCode, String country, List<String> line) {
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.line = line;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public List<String> getLine() {
        return line;
    }

    public void setLine(List<String> line) {
        this.line = line;
    }
}
